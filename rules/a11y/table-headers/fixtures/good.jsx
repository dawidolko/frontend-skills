export function Prices({ rows, header }) {
  return (
    <>
      <table>
        <caption>Plans</caption>
        <thead><tr><th scope="col">Plan</th><th scope="col">Price</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id}><th scope="row">{r.name}</th><td>{r.price}</td></tr>)}</tbody>
      </table>
      <table>
        <thead>{header}</thead>
        <tbody><tr><td>Basic</td><td>Free</td></tr></tbody>
      </table>
      <table role="presentation"><tr><td>Layout</td></tr></table>
      <table><tbody><Row /></tbody></table>
    </>
  )
}
