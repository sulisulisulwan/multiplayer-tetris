import * as React from 'react'
import HoverButton from '../sharedComponents/HoverButton'

const MenuOptionWrapper = ({ clsName, optionTitle, onBackButtonClick, children }: any) => {


  return (
    <div className={clsName}>
      <h1 
        style={{ 
          marginTop: 60,
          textAlign: 'center',
          fontFamily: 'Exo',
          fontWeight: 900,
          color: 'white'
        }}
      >{optionTitle}</h1>
      <div>
        { children }
      </div>
      <div>
        <HoverButton 
          onClick={onBackButtonClick}
          style={{
            position: 'absolute',
            left: 15,
            top: 15,
            paddingTop: 5,
            paddingBottom: 5,
            textAlign: 'center',
            cursor: 'pointer',
            background: 'none',
            color: 'white',
            border: 'solid white 1px',
            fontFamily: 'Exo',
            minWidth: 80,
          }}
          opacityMax= {1}
          opacityMin={.5}
          children='BACK'
        />
      </div>
    </div>
  )
}

export default MenuOptionWrapper