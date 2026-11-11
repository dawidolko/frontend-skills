export function Results({ items }: { items: { id: string; name: string; avatar: string }[] }) {
  return (
    <ul role="listbox" aria-label="Recipients">
      {items.map((item) => (
        <li role="option" aria-selected="false" key={item.id}>
          <img src={item.avatar} alt="" /> <strong>{item.name}</strong>
        </li>
      ))}
    </ul>
  )
}
