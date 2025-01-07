import * as React from 'react'
import HoverButton from './HoverButton'
import { appStateIF, setAppStateIF } from '../../types'

interface toggleFieldPropsIF {
  onClickToggleHandler: Function
  currentValue: boolean
  options: toggleFieldOptionsIF
  appState: appStateIF 
  setAppState: setAppStateIF
}

interface toggleFieldOptionsIF {
  stateField: string
}

const ToggleField = ({ onClickToggleHandler, currentValue, appState, setAppState, options }: toggleFieldPropsIF) => {


  const onClickToggleWrapper = (e: any) => {
    onClickToggleHandler(appState, setAppState, options)
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
        onClick={onClickToggleWrapper}
        opacityMin={.7}
        children={<>&lt;</>}
      />
      <span style={{ 
        fontFamily: 'Exo'
      }}>{currentValue ? 'ON' : 'OFF'}</span>
      <HoverButton
        style={toggleButtonStyle}
        onClick={onClickToggleWrapper}
        opacityMin={.7}
        children={<>&gt;</>}
      />
    </div>
  )

}

export default ToggleField