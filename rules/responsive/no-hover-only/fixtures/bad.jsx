export function Row({ item }) {
  return (
    <li className="group flex">
      {item.name}
      <button className="hidden group-hover:block">Edit</button>
    </li>
  )
}
