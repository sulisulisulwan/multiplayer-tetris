import * as React from 'react'
const { useState } = React

interface iHoverButton {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  style: React.CSSProperties
  children: React.ReactNode
  opacityMax?: number
  opacityMin?: number
}

const HoverButton = ({ onClick, style, children, opacityMax, opacityMin }: iHoverButton) => {
  const [ isHovering, setIsHovering ] = useState(false)

  let computedStyle = isHovering ? 
    { ...style, opacity: typeof opacityMax === 'number' ? opacityMax : 1 } 
    : { ...style, opacity: typeof opacityMin === 'number' ? opacityMin : .8 }

  return (
    <button
      style={computedStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >{children}</button>
  )
}

export default HoverButton