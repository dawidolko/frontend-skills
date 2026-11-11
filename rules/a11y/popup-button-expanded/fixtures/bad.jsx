export function Actions({ onOpen }) {
  return (
    <>
      <button type="button" aria-haspopup="menu" onClick={onOpen}>Actions</button>
      <input role="combobox" aria-controls="city-list" aria-autocomplete="list" />
    </>
  )
}
