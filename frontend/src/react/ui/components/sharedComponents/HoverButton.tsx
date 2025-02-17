import * as React from 'react'
const { useState } = React

interface HoverButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  onContextMenu?: React.MouseEventHandler<HTMLButtonElement>
  style: React.CSSProperties
  children: React.ReactNode
  onHover?: Function
  opacityMax?: number
  opacityMin?: number
  disabled?: boolean 
}

const HoverButton = ({ onClick, onHover, onContextMenu = () => {}, style, disabled, children, opacityMax, opacityMin }: HoverButtonProps) => {
  const [ isHovering, setIsHovering ] = useState(false)

  let computedStyle = disabled ? style 
    : isHovering ? 
    { ...style, opacity: typeof opacityMax === 'number' ? opacityMax : 1 } 
    : { ...style, opacity: typeof opacityMin === 'number' ? opacityMin : .8 }

  return (
    <button
      disabled={disabled === undefined ? false : disabled}
      style={computedStyle}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => {
        if (onHover) onHover()
        setIsHovering(true)
      }}
      onMouseLeave={() => setIsHovering(false)}
    >{children}</button>
  )
}

export default HoverButton