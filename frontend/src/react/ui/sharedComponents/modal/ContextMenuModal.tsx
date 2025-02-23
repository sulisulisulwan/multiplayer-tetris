import * as React from 'react'
import HoverButton from '../HoverButton'

type ContextMenuModalProps = {
  optionHeight: number
  optionGroups: MenuOptionGroup[]
}

export type MenuOptionGroup = {
  type: string
  options: MenuOptionData[]
}
type MenuOptionData = {
  imgSrc: string,
  text: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

type ContextMenuOptions = {
  imgSrc: string, 
  text: string, 
  disabled: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  optionHeight: number, 
}

const MenuOption = ({ imgSrc, text, disabled, optionHeight, onClick }: ContextMenuOptions) => {

  return (
    <HoverButton
      style={{
        border: 0,
        height: '100%',
        width: '100%',
        fontFamily: 'Exo',
        fontSize: 10,
        background: disabled ? 'darkgray' : 'silver',
        color: 'dimgray'
      }}
      disabled={disabled}
      opacityMax={1}
      opacityMin={.8}
      onClick={onClick}
      children={
        <div style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'left',
        }}>
          <img style={{ width: optionHeight - 2, height: optionHeight - 2 }} src={imgSrc}/>
          <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: 5 }}>{text}</span>
        </div>
      }
    />
  )
}

const ContextMenuModal = ({ optionHeight, optionGroups }: ContextMenuModalProps) => {


  return (
    <div
      style={{
        borderTop: 'solid white 1px',
        borderBottom: 'solid darkgray 1px',
      }}
    >
      {
        optionGroups.map((optionGroup, groupIndex) => {
          return optionGroup.options.map((option, optionIndex) => {
            return (
              <div 
                style={{
                  borderBottom: (optionIndex === optionGroup.options.length - 1 && groupIndex !== optionGroups.length - 1) ? '1px solid white ' : ''        
                }}
                key={option.text + option.imgSrc + optionIndex}
              >
                <MenuOption 
                  disabled={option.disabled === undefined ? false : option.disabled}
                  optionHeight={optionHeight} 
                  imgSrc={option.imgSrc} 
                  text={option.text} 
                  onClick={option.onClick}
                />
              </div>
            )
          })

        })
      }
    </div>
  )
}

export default ContextMenuModal