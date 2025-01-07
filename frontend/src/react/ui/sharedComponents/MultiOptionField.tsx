import * as React from 'react'
import HoverButton from './HoverButton'
import { setAppStateIF } from '../../types'

interface multiOptionsPropsIF {
  onClickMultiOptionHandler: Function
  currentValue: string
  setAppState: setAppStateIF
  stateField: string
  optionsArray: any[]
}


const MultiOptionField = ({ onClickMultiOptionHandler, currentValue, setAppState, stateField, optionsArray }: multiOptionsPropsIF) => {

  const [ currIdx, setCurrIdx ] = React.useState(0)

  console.log(currIdx)

  const multiOptionButtonStyle = {
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
        style={multiOptionButtonStyle}
        onClick={() => {
          const newIdx = currIdx - 1 < 0 ? optionsArray.length - 1 : currIdx - 1
          setCurrIdx(newIdx)
          onClickMultiOptionHandler(setAppState, stateField, optionsArray, newIdx)}
        }
        opacityMin={.7}
        children={<>&lt;</>}
      />
      <span style={{ 
        fontFamily: 'Exo'
      }}>{currentValue}</span>
      <HoverButton
        style={multiOptionButtonStyle}
        onClick={() => {
          const newIdx = currIdx + 1 >= optionsArray.length ? 0 : currIdx + 1
          setCurrIdx(newIdx)
          onClickMultiOptionHandler(setAppState, stateField, optionsArray, newIdx)}
        }
        opacityMin={.7}
        children={<>&gt;</>}
      />
  </div>
  )
}

export default MultiOptionField