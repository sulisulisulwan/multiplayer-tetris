import * as React from 'react'
import HoverButton from './HoverButton'
import { appStateIF, setAppStateIF } from '../../types'

interface rangeFieldPropsIF {
  currentValue: number
  onClickRangeHandler: Function
  options: rangeFieldOptionsIF
  appState: appStateIF
  setAppState: setAppStateIF
}

interface rangeFieldOptionsIF {
  min: number
  max: number
  context: string
  stateField: string
}

const RangeField = ({ onClickRangeHandler, currentValue, options, appState, setAppState }: rangeFieldPropsIF) => {

  const rangeHandlerWrapper = (e: any) => {
    options.context = e.target.innerHTML
    onClickRangeHandler(appState, setAppState, options)
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
        style={buttonStyle}
        onClick={rangeHandlerWrapper}
        opacityMin={.7}
        children='-'
      />
      <span style={{ 
        fontFamily: 'Exo'
      }}>{currentValue}</span>
      <HoverButton
        style={buttonStyle}
        onClick={rangeHandlerWrapper}
        opacityMin={.7}
        children='+'
      />
      
    </div>
  )
  

}

export default RangeField