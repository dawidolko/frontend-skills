/*
 * Encodes the video's frames and sound track into one MP4 with AVFoundation, so no ffmpeg is needed on macOS. Frames
 * arrive on standard input as a 4-byte big-endian length followed by a JPEG or PNG; each becomes one H.264 frame
 * (BT.709, High profile). The WAV (16-bit PCM) is encoded to AAC and interleaved with the frames as they are written.
 * With --inspect it prints the duration, size and codecs of a movie and saves PNG frames at the given seconds.
 * Usage: encode <out.mp4> <width> <height> <fps> <bitrate> <audio.wav>   (frames on stdin)
 *        encode --inspect <movie.mp4> [seconds ...]
 */
import AVFoundation
import Foundation
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
  FileHandle.standardError.write(Data("encode: \(message)\n".utf8))
  exit(1)
}

func fourcc(_ code: FourCharCode) -> String {
  let bytes = [24, 16, 8, 0].map { UInt8((code >> UInt32($0)) & 0xff) }
  return String(bytes: bytes, encoding: .ascii) ?? "\(code)"
}

func inspect(_ path: String, _ seconds: [Double]) {
  let asset = AVURLAsset(url: URL(fileURLWithPath: path))
  let done = DispatchSemaphore(value: 0)
  Task {
    do {
      let duration = try await asset.load(.duration)
      print(String(format: "file: %@\nduration: %.3f s", path, duration.seconds))
      for track in try await asset.load(.tracks) {
        let formats = try await track.load(.formatDescriptions)
        let codec = formats.first.map { fourcc(CMFormatDescriptionGetMediaSubType($0)) } ?? "?"
        let rate = try await track.load(.estimatedDataRate)
        if track.mediaType == .video {
          let size = try await track.load(.naturalSize)
          let fps = try await track.load(.nominalFrameRate)
          print(String(format: "video: %@ %.0fx%.0f %.2f fps %.1f Mbit/s", codec, size.width, size.height, fps, rate / 1e6))
        } else if track.mediaType == .audio, let f = formats.first, let asbd = CMAudioFormatDescriptionGetStreamBasicDescription(f)?.pointee {
          print(String(format: "audio: %@ %.0f Hz %d ch %.0f kbit/s", codec, asbd.mSampleRate, asbd.mChannelsPerFrame, rate / 1e3))
        }
      }
      let generator = AVAssetImageGenerator(asset: asset)
      generator.requestedTimeToleranceBefore = .zero
      generator.requestedTimeToleranceAfter = .zero
      for s in seconds {
        let (image, _) = try await generator.image(at: CMTime(seconds: s, preferredTimescale: 600))
        let out = URL(fileURLWithPath: path).deletingPathExtension().path + String(format: "-frame-%06.2f.png", s)
        guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: out) as CFURL, UTType.png.identifier as CFString, 1, nil) else { fail("cannot write \(out)") }
        CGImageDestinationAddImage(dest, image, nil)
        CGImageDestinationFinalize(dest)
        print("frame: \(out)")
      }
    } catch {
      fail("\(error)")
    }
    done.signal()
  }
  done.wait()
}

func readWav(_ path: String) -> (Data, Double, Int) {
  guard let data = FileManager.default.contents(atPath: path) else { fail("cannot read \(path)") }
  func u32(_ at: Int) -> Int { Int(data[at]) | Int(data[at + 1]) << 8 | Int(data[at + 2]) << 16 | Int(data[at + 3]) << 24 }
  func u16(_ at: Int) -> Int { Int(data[at]) | Int(data[at + 1]) << 8 }
  var at = 12
  var rate = 48000.0
  var channels = 2
  while at + 8 <= data.count {
    let id = String(bytes: data[at..<at + 4], encoding: .ascii) ?? ""
    let size = u32(at + 4)
    if id == "fmt " {
      channels = u16(at + 10)
      rate = Double(u32(at + 12))
      if u16(at + 22) != 16 { fail("only 16-bit PCM WAV files are supported") }
    } else if id == "data" {
      return (data.subdata(in: at + 8..<min(at + 8 + size, data.count)), rate, channels)
    }
    at += 8 + size + (size & 1)
  }
  fail("no data chunk in \(path)")
}

func readExactly(_ count: Int) -> Data? {
  var out = Data()
  while out.count < count {
    let chunk = FileHandle.standardInput.readData(ofLength: count - out.count)
    if chunk.isEmpty { return out.isEmpty ? nil : out }
    out.append(chunk)
  }
  return out
}

func encode(out: String, width: Int, height: Int, fps: Int32, bitrate: Int, wav: String) {
  let url = URL(fileURLWithPath: out)
  try? FileManager.default.removeItem(at: url)
  guard let writer = try? AVAssetWriter(outputURL: url, fileType: .mp4) else { fail("cannot create \(out)") }
  writer.shouldOptimizeForNetworkUse = true

  let video = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoColorPropertiesKey: [
      AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
      AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
      AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
    ],
    AVVideoCompressionPropertiesKey: [
      AVVideoAverageBitRateKey: bitrate,
      AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
      AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2,
      AVVideoExpectedSourceFrameRateKey: Int(fps),
    ],
  ])
  video.expectsMediaDataInRealTime = false
  let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: video, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height,
  ])

  let (pcm, rate, channels) = readWav(wav)
  var asbd = AudioStreamBasicDescription(
    mSampleRate: rate, mFormatID: kAudioFormatLinearPCM, mFormatFlags: kLinearPCMFormatFlagIsSignedInteger | kLinearPCMFormatFlagIsPacked,
    mBytesPerPacket: UInt32(2 * channels), mFramesPerPacket: 1, mBytesPerFrame: UInt32(2 * channels), mChannelsPerFrame: UInt32(channels),
    mBitsPerChannel: 16, mReserved: 0)
  var pcmFormat: CMAudioFormatDescription?
  CMAudioFormatDescriptionCreate(allocator: nil, asbd: &asbd, layoutSize: 0, layout: nil, magicCookieSize: 0, magicCookie: nil, extensions: nil, formatDescriptionOut: &pcmFormat)
  guard let pcmFormat else { fail("cannot describe the WAV format") }
  let audio = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVSampleRateKey: rate,
    AVNumberOfChannelsKey: channels,
    AVEncoderBitRateKey: 192_000,
  ], sourceFormatHint: pcmFormat)
  audio.expectsMediaDataInRealTime = false

  writer.add(video)
  writer.add(audio)
  guard writer.startWriting() else { fail("cannot start: \(String(describing: writer.error))") }
  writer.startSession(atSourceTime: .zero)

  let bytesPerFrame = 2 * channels
  let totalSamples = pcm.count / bytesPerFrame
  var audioAt = 0
  var audioDone = false
  func appendAudioChunk() {
    let count = min(4800, totalSamples - audioAt)
    var block: CMBlockBuffer?
    CMBlockBufferCreateWithMemoryBlock(allocator: nil, memoryBlock: nil, blockLength: count * bytesPerFrame, blockAllocator: nil, customBlockSource: nil, offsetToData: 0, dataLength: count * bytesPerFrame, flags: kCMBlockBufferAssureMemoryNowFlag, blockBufferOut: &block)
    guard let block else { fail("cannot allocate audio") }
    pcm.withUnsafeBytes { raw in
      _ = CMBlockBufferReplaceDataBytes(with: raw.baseAddress!.advanced(by: audioAt * bytesPerFrame), blockBuffer: block, offsetIntoDestination: 0, dataLength: count * bytesPerFrame)
    }
    var sample: CMSampleBuffer?
    CMAudioSampleBufferCreateReadyWithPacketDescriptions(allocator: nil, dataBuffer: block, formatDescription: pcmFormat, sampleCount: count, presentationTimeStamp: CMTime(value: CMTimeValue(audioAt), timescale: CMTimeScale(rate)), packetDescriptions: nil, sampleBufferOut: &sample)
    guard let sample, audio.append(sample) else { fail("cannot append audio: \(String(describing: writer.error))") }
    audioAt += count
    if audioAt >= totalSamples {
      audio.markAsFinished()
      audioDone = true
    }
  }
  func waitForVideo() {
    while !video.isReadyForMoreMediaData {
      if !audioDone && audio.isReadyForMoreMediaData { appendAudioChunk() } else { usleep(1000) }
    }
  }

  let space = CGColorSpace(name: CGColorSpace.sRGB)!
  var frame: Int64 = 0
  while let head = readExactly(4) {
    let length = head.reduce(0) { $0 << 8 | Int($1) }
    guard let bytes = readExactly(length), bytes.count == length else { fail("frame \(frame) is cut short") }
    guard let source = CGImageSourceCreateWithData(bytes as CFData, nil), let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else { fail("frame \(frame) is not an image") }
    guard let pool = adaptor.pixelBufferPool else { fail("no pixel buffer pool: \(String(describing: writer.error))") }
    var buffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
    guard let buffer else { fail("cannot allocate frame \(frame)") }
    CVPixelBufferLockBaseAddress(buffer, [])
    let context = CGContext(data: CVPixelBufferGetBaseAddress(buffer), width: width, height: height, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buffer), space: space, bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    context?.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
    CVPixelBufferUnlockBaseAddress(buffer, [])
    waitForVideo()
    guard adaptor.append(buffer, withPresentationTime: CMTime(value: frame, timescale: fps)) else { fail("cannot append frame \(frame): \(String(describing: writer.error))") }
    frame += 1
    let ahead = Int(Double(frame) / Double(fps) * rate + rate / 2)
    while !audioDone && audioAt < ahead && audio.isReadyForMoreMediaData { appendAudioChunk() }
  }
  video.markAsFinished()
  while !audioDone {
    while !audio.isReadyForMoreMediaData { usleep(1000) }
    appendAudioChunk()
  }
  let done = DispatchSemaphore(value: 0)
  writer.finishWriting { done.signal() }
  done.wait()
  if writer.status != .completed { fail("writing failed: \(String(describing: writer.error))") }
  print(String(format: "%@: %lld frames, %.2f s of video, %.2f s of audio", out, frame, Double(frame) / Double(fps), Double(totalSamples) / rate))
}

let args = CommandLine.arguments
if args.count >= 3 && args[1] == "--inspect" {
  inspect(args[2], args.dropFirst(3).compactMap(Double.init))
} else if args.count == 7, let w = Int(args[2]), let h = Int(args[3]), let fps = Int32(args[4]), let rate = Int(args[5]) {
  encode(out: args[1], width: w, height: h, fps: fps, bitrate: rate, wav: args[6])
} else {
  fail("usage: encode <out.mp4> <width> <height> <fps> <bitrate> <audio.wav> | encode --inspect <movie.mp4> [seconds ...]")
}
