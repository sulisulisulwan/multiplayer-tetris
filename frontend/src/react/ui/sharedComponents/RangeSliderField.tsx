import * as React from 'react'
import HoverButton from './HoverButton'
import { appStateIF, setAppStateIF } from '../../types'

type rangeSliderFieldPropsType = {
  appState: appStateIF
  setAppState: setAppStateIF
  onChangeRangeHandler: Function
  currValue: any
  stateField: string
  min: number
  max: number
}


const RangeSliderField = ({ appState, setAppState, onChangeRangeHandler, currValue, stateField, min, max }: rangeSliderFieldPropsType) => {

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
        onClick={() => { onChangeRangeHandler({
          stateField,
          newValue: Number(currValue) - 1,
          min,
          max,
          appState, 
          volumeField: stateField,
          setAppState, 
        }) }}
        opacityMin={.7}
        children='-'
      />
      <input 
        type="range" 
        min={min}
        max={max}
        onChange={(e: any) => { onChangeRangeHandler({
          stateField, 
          newValue: Number(e.target.value),
          min,
          max,
          volumeField: stateField,
          appState, 
          setAppState
        }) }}
        value={currValue}
      />
      <HoverButton
        style={buttonStyle}
        onClick={() => { onChangeRangeHandler({
          stateField, 
          newValue: Number(currValue) + 1,
          min,
          max,
          volumeField: stateField,
          appState, 
          setAppState
        }) }}
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