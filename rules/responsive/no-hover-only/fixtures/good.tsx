export function Row({ item }: { item: { name: string } }) {
  return (
    <li className="group flex">
      {item.name}
      <button className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">Edit</button>
    </li>
  )
}
