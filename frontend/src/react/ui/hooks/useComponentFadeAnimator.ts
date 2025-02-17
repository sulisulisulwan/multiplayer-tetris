import { useEffect, useRef, useState } from "react";

export const useComponentFadeAnimator = (isOpen: boolean, fadeDuration: number, fadeInName: string, fadeOutName: string) => {

  const targetComponent = useRef<HTMLDivElement>(null)

  const [ hookState, setHookState ] = useState({
    isFirstLoad: true,
    cssSettings: {
      displaySetting: 'none',
      animationSetting: ''
    }
  })

  const animationEndListener = (e: any) => { 
    targetComponent.current.style.display = isOpen ? '' : 'none' // we need an immediate change.  Async of setState is too slow.
    targetComponent.current.style.animation = ''
    setHookState((pS) => {
      return {
        ...pS,
        isFirstLoad: pS.isFirstLoad ? false : true
      }
    })
  }

  useEffect(() => {

    targetComponent?.current?.addEventListener('animationend', animationEndListener)
    targetComponent.current.style.animation = isOpen ? `${fadeInName} ${fadeDuration}s` : `${fadeOutName} ${fadeDuration}s`
    targetComponent.current.style.display = hookState.isFirstLoad && !isOpen ? 'none' : ''
    
    return () => {
      targetComponent?.current?.removeEventListener('animationend', animationEndListener)
    }
  }, [isOpen])

  return { 
    fadeRef: targetComponent,
    cssFadeAnimationProps: hookState.cssSettings
  }
}