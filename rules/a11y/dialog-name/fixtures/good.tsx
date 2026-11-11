export function Confirm({ dialogProps, role }: { dialogProps: object; role: string }) {
  return (
    <>
      <dialog aria-labelledby="delete-title">
        <h2 id="delete-title">Delete project?</h2>
      </dialog>
      <div role="dialog" aria-label="Cookie settings" />
      <dialog {...dialogProps} />
      <div role={role} />
      <Dialog title="Rename" />
    </>
  )
}
