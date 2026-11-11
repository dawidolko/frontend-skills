export function Media({ tracks, kind, playerProps }) {
  return (
    <>
      <video controls src="/media/launch.mp4">
        <track kind="captions" src="/media/launch.en.vtt" srcLang="en" label="English" default />
      </video>
      <video controls src="/media/tour.mp4">
        <track kind={kind} src="/media/tour.vtt" srcLang="en" />
      </video>
      <video controls>{tracks.map((t) => <Track key={t.src} {...t} />)}</video>
      <video autoPlay muted loop playsInline src="/media/background.mp4" />
      <video {...playerProps} />
      <video controls src="/media/talk.mp4">{captionTracks}</video>
    </>
  )
}
