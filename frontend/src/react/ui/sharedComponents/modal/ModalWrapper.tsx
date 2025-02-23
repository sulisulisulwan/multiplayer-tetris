import * as ReactDom from 'react-dom'
import * as React from 'react'

import { useTypeEscapeToClose } from '../../hooks/useTypeEscapeToClose'
import { useComponentFadeAnimator } from '../../hooks/useComponentFadeAnimator'
import modalFactory from './modalFactory'
import { useOutsideAlerter } from '../../hooks/useOutsideAlerter'

interface ModalWrapperProps {
  modalName: string
  isOpen: boolean
  setModalClosed: React.Dispatch<React.SetStateAction<boolean>>
  childModalContext: { type: string, props: Record<string, any>}
  modalBackgroundStyle?: React.CSSProperties
  innerWindowStyle?: React.CSSProperties
  fadeDuration?: number
  fadeAnimator?: boolean
  outsideAlerter?: boolean
  typeEscapeToClose?: boolean
}


const modalBackgroundStyleDefault: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .5)',
  zIndex: 900
}

const modalInnerWindowDefault: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'darkgray',
  zIndex: 1000
}

const ModalWrapper = ({ 
  modalName, 
  isOpen, 
  setModalClosed, 
  childModalContext, 
  fadeDuration, 
  fadeAnimator=true, 
  typeEscapeToClose = true, 
  outsideAlerter = false,
  modalBackgroundStyle = modalBackgroundStyleDefault,
  innerWindowStyle = modalInnerWindowDefault
}: ModalWrapperProps) => {

  const { type, props } = childModalContext
  let finalProps = props
  
  if (typeEscapeToClose ) {
    useTypeEscapeToClose(setModalClosed)
  }

  let clickOutsideRef = null
  if (outsideAlerter) {
    clickOutsideRef = useOutsideAlerter(setModalClosed)
  }

  let fadeReference = null
  if (fadeAnimator) {
    let computedFadeDuration = fadeAnimator ? (fadeDuration !== undefined ? fadeDuration : .5) : 0
    let computedFadeInAnimationName = fadeAnimator ? 'fadeInModal' : ''
    let computedFadeOutAnimationName = fadeAnimator ? 'fadeOutModal' : ''

    const { fadeRef, cssFadeAnimationProps } = useComponentFadeAnimator(isOpen, computedFadeDuration, computedFadeInAnimationName, computedFadeOutAnimationName)
    fadeReference = fadeRef
    finalProps = Object.assign(props, { cssFadeAnimation: cssFadeAnimationProps })
  }

  const childModal = modalFactory(type, finalProps)

  if (!fadeAnimator) {
    modalBackgroundStyle.display = isOpen ? '' : 'none'
  }

  const wrapperModal = (
    <div 
      id={`${modalName}-modal-wrapper`}
      className="modal-background"
      style={modalBackgroundStyle}
      ref={fadeReference}
    >
      <div className="modal-inner-window"
        ref={clickOutsideRef}
        style={innerWindowStyle}
      >
        {childModal}
      </div>
    </div>
  )

  return ReactDom.createPortal(wrapperModal, document.getElementById('modal'))
}

export default ModalWrapper