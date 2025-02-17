import * as React from 'react'
import HoverButton from './HoverButton'
import { Dispatch } from 'redux'
import { soundEffects } from '../../../App'

interface RangeFieldProps {
  dispatch: Dispatch
  currentValue: number
  onClickRangeHandler: Function
  options: RangeFieldOptions
}

interface RangeFieldOptions {
  min: number
  max: number
  stateField: string
}

const RangeField = ({ dispatch, onClickRangeHandler, currentValue, options }: RangeFieldProps) => {

  const rangeHandlerWrapper = (e: any) => {
    let actionSymbol = e.target.innerHTML
    const { min, max, stateField } = options
    onClickRangeHandler(dispatch, min, max, actionSymbol, stateField)
  }

  const buttonStyle = {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  }
  

  return  (
    <div>
      <HoverButton
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        style={buttonStyle}
        onClick={(e) => { 
          soundEffects.play('menuBasicButtonClick')
          rangeHandlerWrapper(e)
        }}
        opacityMin={.7}
        children='-'
      />
      <span style={{ 
        fontFamily: 'Exo'
      }}>{currentValue}</span>
      <HoverButton
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        style={buttonStyle}
        onClick={(e) => { 
          soundEffects.play('menuBasicButtonClick')
          rangeHandlerWrapper(e)
        }}
        opacityMin={.7}
        children='+'
      />
      
    </div>
  )
  

}

export default RangeField