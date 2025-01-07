import * as React from 'react'
import { appStateIF, setAppStateIF } from '../../types'
import HoverButton from '../sharedComponents/HoverButton'
import { getDefaultGameOptions } from '../../core/options/getDefaultGameOptions'

interface mainMenuViewPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

const mainMenuViewStyles = {
  color: 'white',
  fontFamily: 'Exo'
}

const MainMenuView = ({ appState, setAppState }: mainMenuViewPropsIF) => {
  return(
    <div className="main-menu-view" style={mainMenuViewStyles}>
      <div className="main-menu-logo"
        style={{
          textAlign: 'center',
          fontFamily: 'Exo',
          fontSize: 120,
          fontWeight: '900'
        }}
      >TETRIS</div>
      <div className="main-menu-menu">
      <ul style={{
        marginTop: 100,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: '10% 35% 10% 35% 10%'
      }}>
        <li/>
        <li style={{
          textAlign: 'right'
        }}>
          <HoverButton
            onClick={() => {
              setAppState((currentState) => { 
                return { 
                  ...currentState, 
                  gameOptions: getDefaultGameOptions('singleplayer'),
                  view: 'singleplayer'
                }
              }) 
            }}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              background: 'gray',
              padding: 20,
              color: 'white',
              border: 'solid black 1px',
              fontFamily: 'Exo',
              fontSize: 20,
              minWidth: 200,
            }}
            children='SINGLE PLAYER'
          />
        </li>
        <li/>
        <li>
          <HoverButton
            onClick={() => { 
              setAppState((currentState) => { 
                return { 
                  ...currentState,
                  gameOptions: getDefaultGameOptions('multiplayer'),
                  view: 'multiplayer'
                }
              }) 
            }}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              background: 'slategray',
              padding: 20,
              color: 'white',
              border: 'solid black 1px',
              fontFamily: 'Exo',
              fontSize: 20,
              minWidth: 200,
            }}
            children='MULTIPLAYER'
          />
        </li>
        <li/>
      </ul>
    </div>
    </div>
  )
  
}

export default MainMenuView