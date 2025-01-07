import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../types'
import MenuOptionWrapper from '../MenuOptionWrapper'

interface multiPlayerPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

class MultiPlayer extends React.Component<multiPlayerPropsIF> {

  constructor(props: multiPlayerPropsIF) {
    super(props)
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <MenuOptionWrapper
        clsName="multiplayer-menu"
        optionTitle='MULTIPLAYER MENU'
        backToView='mainMenu'
        setAppState={setAppState}
      >
        <div>
          Options here
        </div>
      </MenuOptionWrapper>
    )
  }
}

export default MultiPlayer