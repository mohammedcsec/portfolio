import { useEffect } from 'react'
/** The browser's native dialog is the focus-safe unload guard; no data is persisted. */
export function useUnsavedChanges(unsaved: boolean) {
  useEffect(() => {
    if (!unsaved) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [unsaved])
}
