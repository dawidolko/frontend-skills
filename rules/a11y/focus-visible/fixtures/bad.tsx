export const Close = ({ onClose }: { onClose: () => void }) => (
  <button type="button" className="p-2 outline-none hover:bg-gray-100" onClick={onClose}>
    Close
  </button>
)
