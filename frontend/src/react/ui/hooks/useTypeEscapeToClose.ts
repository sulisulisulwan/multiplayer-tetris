import { useEffect } from "react"

export const useTypeEscapeToClose = (closeHandler: Function) => {
  
  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => { if (e.key === 'Escape') closeHandler() }
    document.addEventListener('keydown', keydownListener)
    return () => document.removeEventListener('keydown', keydownListener)
  }, [])
}