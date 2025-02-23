import * as React from 'react'
import HoverButton from './HoverButton'
import { Dispatch } from 'redux'
import { soundEffects } from '../../App'

interface ToggleFieldProps {
  dispatch: Dispatch
  onClickToggleHandler: Function
  currentValue: boolean
  options: toggleFieldOptionsIF
}

interface toggleFieldOptionsIF {
  stateField: string
}

const ToggleField = ({ dispatch, onClickToggleHandler, currentValue, options }: ToggleFieldProps) => {


  const onClickToggleWrapper = (e: any) => {
    const { stateField } = options
    onClickToggleHandler(dispatch, stateField)
  }

  const toggleButtonStyle = {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  }
  
  return (
    <div>
      <HoverButton
        style={toggleButtonStyle}
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        onClick={(e) => { 
          soundEffects.play('menuBasicButtonClick')
          onClickToggleWrapper(e)
        }}
        opacityMin={.7}
        children={<>&lt;</>}
      />
      <span style={{ 
        fontFamily: 'Exo'
      }}>{currentValue ? 'ON' : 'OFF'}</span>
      <HoverButton
        style={toggleButtonStyle}
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        onClick={(e) => { 
          soundEffects.play('menuBasicButtonClick')
          onClickToggleWrapper(e)
        }}
        opacityMin={.7}
        children={<>&gt;</>}
      />
    </div>
  )

}

export default ToggleField