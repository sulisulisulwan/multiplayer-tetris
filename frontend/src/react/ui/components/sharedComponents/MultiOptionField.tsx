import * as React from 'react'
import HoverButton from './HoverButton'
import { Dispatch } from 'redux'
import { soundEffects } from '../../../App'

interface MultiOptionsProps {
  dispatch: Dispatch
  onClickMultiOptionHandler: Function
  currentValue: string
  stateField: string
  optionsArray: any[]
}


const MultiOptionField = ({ dispatch, onClickMultiOptionHandler, currentValue, stateField, optionsArray }: MultiOptionsProps) => {

  const [ currIdx, setCurrIdx ] = React.useState(0)

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
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        onClick={() => {
          soundEffects.play('menuBasicButtonClick')
          const newIdx = currIdx - 1 < 0 ? optionsArray.length - 1 : currIdx - 1
          setCurrIdx(newIdx)
          onClickMultiOptionHandler(dispatch, stateField, optionsArray, newIdx)}
        }
        opacityMin={.7}
        children={<>&lt;</>}
      />
      <span style={{ 
        fontFamily: 'Exo'
      }}>{currentValue}</span>
      <HoverButton
        style={multiOptionButtonStyle}
        onHover={() => { soundEffects.play('menuBasicButtonHover')}}
        onClick={() => {
          soundEffects.play('menuBasicButtonClick')
          const newIdx = currIdx + 1 >= optionsArray.length ? 0 : currIdx + 1
          setCurrIdx(newIdx)
          onClickMultiOptionHandler(dispatch, stateField, optionsArray, newIdx)}
        }
        opacityMin={.7}
        children={<>&gt;</>}
      />
  </div>
  )
}

export default MultiOptionField