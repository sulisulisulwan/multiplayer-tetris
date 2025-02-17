import * as React from 'react'
import HoverButton from '../sharedComponents/HoverButton'
import { soundEffects } from '../../../App'

const MenuOptionWrapper = ({ clsName, optionTitle, onBackButtonClick, children }: any) => {


  return (
    <div 
      className={clsName}
      style={{
        height: '100%',
      }}
    >
      <div style={{ height: '100%' }}>
        { children }
      </div>
      <div>
        <HoverButton 
          onClick={() => {
            soundEffects.play('menuBackButtonClick')
            onBackButtonClick()
          }}
          onHover={() => soundEffects.play('menuBasicButtonHover')}
          style={{
            position: 'absolute',
            left: '2vw',
            top: '2vw',
            fontSize: '1.5vw',
            paddingTop: '1vw',
            paddingBottom: '1vw',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'none',
            color: 'white',
            border: 'solid white .2vh',
            fontFamily: 'Exo',
            minWidth: '10vw',
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