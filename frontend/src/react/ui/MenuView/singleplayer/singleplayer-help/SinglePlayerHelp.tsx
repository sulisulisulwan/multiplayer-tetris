import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../../types'
import MenuOptionWrapper from '../../MenuOptionWrapper'

interface helpPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

class Help extends React.Component<helpPropsIF> {

  constructor(props: helpPropsIF) {
    super(props)
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <MenuOptionWrapper
        clsName="help-view"
        optionTitle='HELP'
        onBackButtonClick={() => { 
          setAppState((currentState: any) => { 
            return { ...currentState, view: 'singleplayer' }
          }) 
        }}
      >
        find help here
      </MenuOptionWrapper>
    )
  }
}

export default Help