export function Actions({ open, onOpen, triggerProps }) {
  return (
    <>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={onOpen}>Actions</button>
      <input role="combobox" aria-expanded="false" aria-controls="city-list" />
      <button type="button" aria-haspopup="false">Plain</button>
      <button {...triggerProps} aria-haspopup="dialog">Settings</button>
    </>
  )
}
