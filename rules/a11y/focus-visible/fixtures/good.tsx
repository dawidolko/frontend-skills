export const Close = ({ onClose }: { onClose: () => void }) => (
  <button type="button" className="p-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-600" onClick={onClose}>
    Close
  </button>
)
