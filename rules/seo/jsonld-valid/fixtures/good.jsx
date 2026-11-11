export function Seo({ org }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json">{JSON.stringify(org)}</script>
    </>
  )
}
