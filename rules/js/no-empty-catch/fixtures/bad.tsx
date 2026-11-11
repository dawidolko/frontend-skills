export function SaveButton({ save }: { save: () => Promise<void> }) {
  async function onClick() {
    try {
      await save()
    } catch {}
  }
  return <button type="button" onClick={() => save().catch(() => {})} onDoubleClick={onClick}>Save</button>
}
