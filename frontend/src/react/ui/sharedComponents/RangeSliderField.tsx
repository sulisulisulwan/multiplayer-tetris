import * as React from 'react'
import HoverButton from './HoverButton'
import { Dispatch } from 'redux'
import { soundEffects } from '../../App'

type RangeSliderFieldProps = {
  dispatch: Dispatch
  onChangeRangeHandler: Function
  currValue: any
  stateField: string
  min: number
  max: number
}


const RangeSliderField = ({ dispatch, onChangeRangeHandler, currValue, stateField, min, max }: RangeSliderFieldProps) => {

  const buttonStyle = {
    color: 'white',
    fontFamily: 'Exo',
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <>
      <HoverButton
        style={buttonStyle}
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        onClick={() => { 
          soundEffects.play('menuBasicButtonClick')
          onChangeRangeHandler(
            dispatch,
            stateField,
            Number(currValue) - 1,
            min,
            max,
          ) 
        }}
        opacityMin={.7}
        children='-'
      />
      <input 
        type="range" 
        min={min}
        max={max}
        onChange={(e: any) => { 
          onChangeRangeHandler(
            dispatch,
            stateField, 
            Number(e.target.value),
            min,
            max,
          ) 
        }}
        value={currValue}
      />
      <HoverButton
        style={buttonStyle}
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        onClick={() => { 
          soundEffects.play('menuBasicButtonClick')
          onChangeRangeHandler(
            dispatch,
            stateField, 
            Number(currValue) + 1,
            min,
            max,
          ) 
        }}
        opacityMin={.7}
        children='+'
      />
      <div>
        <span style={{ fontFamily: 'Exo' }}>{currValue}</span>
      </div>
    </>
  )
}
export default RangeSliderField