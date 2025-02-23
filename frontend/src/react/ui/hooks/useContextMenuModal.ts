import * as React from 'react'
import { MenuOptionGroup } from '../sharedComponents/modal/ContextMenuModal'

export const useContextMenuModal = (optionGroups: MenuOptionGroup[],  optionHeight: number) => {

  let height = 1
  optionGroups.forEach(group => {
    height += 1
    group.options.forEach(_ => {
      height += (optionHeight + 3)
    })
  })

  const [ isOpen, setIsOpen ] = React.useState({
    clickCoords: {
      x: 0,
      y: 0
    },
    isOpen: false
  })

  const setModalOpen = (e: React.MouseEvent) => {
    if (isOpen.isOpen) return
    setIsOpen({
      isOpen: true,
      clickCoords: {
        x: e.pageX,
        y: e.pageY
      }
    })
  }

  const setModalClosed = () => {
    setIsOpen({ isOpen: false, clickCoords: { x: 0, y: 0 }})
  }

  const friendInteractInnerModalWidth = 150
  const adjustModalXPosition = isOpen.clickCoords.x + friendInteractInnerModalWidth > window.innerWidth

  const friendInteractX = adjustModalXPosition ? window.innerWidth - friendInteractInnerModalWidth : isOpen.clickCoords.x
  const friendInteractY = isOpen.clickCoords.y

  const modalBackgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 900
  }

  const innerWindowStyle: React.CSSProperties = {
    position: 'relative',
    top: friendInteractY,
    left: friendInteractX,
    width: friendInteractInnerModalWidth,
    height,
    background: 'darkgray',
    zIndex: 1000
  }

  return {
    isOpen: isOpen.isOpen,
    setModalOpen,
    setModalClosed,
    innerWindowStyle,
    modalBackgroundStyle,
    optionGroups
  }
}