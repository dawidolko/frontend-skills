export function Tabs({ role, current }) {
  return (
    <div role="tablist" aria-label="Plans">
      <button role="tab" aria-selected={current === 1} aria-controls="p1">One</button>
      <div role="tabpanel" id="p1" aria-labelledby="t1" />
      <section role="doc-chapter" />
      <svg role="graphics-document img" aria-roledescription="chart" />
      <div role={role} aria-busy="true" />
      <p aria-description="Extra detail" />
    </div>
  )
}
