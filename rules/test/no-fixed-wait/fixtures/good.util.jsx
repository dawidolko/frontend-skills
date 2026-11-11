export const settle = () => new Promise((r) => setTimeout(r, 300))
export function Toast({ text }) {
  return <p role="status">{text}</p>
}
