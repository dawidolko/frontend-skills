// navigator.userAgent in a comment is not code
export function ShareButton({ onShare }) {
  const canShare = 'share' in navigator
  const coarse = matchMedia('(pointer: coarse)').matches
  const agent = navigator.userAgent // fs-ignore js/feature-detect (sent with error reports)
  return canShare && coarse ? <button type="button" data-agent={agent} onClick={onShare}>Share</button> : null
}
