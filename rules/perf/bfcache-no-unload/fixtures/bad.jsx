export function useSaveDraft(save) {
  useEffect(() => {
    window.addEventListener('unload', save)
    return () => window.removeEventListener('unload', save)
  }, [save])
}
window.onunload = () => navigator.sendBeacon('/log', 'bye')
