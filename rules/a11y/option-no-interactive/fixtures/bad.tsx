export function Results({ items, remove }: { items: { id: string; name: string }[]; remove: (id: string) => void }) {
  return (
    <ul role="listbox" aria-label="Recipients">
      {items.map((item) => (
        <li role="option" aria-selected="false" key={item.id}>
          {item.name}
          <button type="button" onClick={() => remove(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  )
}
