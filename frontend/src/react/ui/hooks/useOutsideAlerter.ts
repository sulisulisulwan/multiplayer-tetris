import { useEffect, useRef } from "react";

export const useOutsideAlerter = (clickHandler: Function) => {
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e: Event) => { 
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement)) {
        clickHandler() 
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  return wrapperRef
}