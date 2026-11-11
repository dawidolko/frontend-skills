export function Toolbar({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <nav>
      <button type="button" className="p-2" onClick={() => onOpen()}>
        <svg aria-hidden="true" className="size-5"><use href="#icon-menu" /></svg>
        <span className="sr-only md:not-sr-only">Menu</span>
      </button>
      <button type="button" aria-label="Search" onClick={onOpen}>
        <span className="hidden md:inline">Search</span>
      </button>
      <a href="/cart">
        Cart <span className="hidden md:inline">(view all)</span>
      </a>
      <button type="button" onClick={onOpen}>
        <span className="hidden md:inline">{label}</span>
        {label}
      </button>
    </nav>
  )
}
