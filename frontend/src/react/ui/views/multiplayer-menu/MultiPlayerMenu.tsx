import * as React from 'react'

import MenuOptionWrapper from '../../sharedComponents/MenuOptionWrapper'
import ParticipantList from './social-sidebar/ParticipantList'
import SocialList from './social-sidebar/SocialList'
import CustomOneVSAllLobby from './lobbies/custom-game-mode-lobbies/CustomOneVSAllLobby'
import CustomOneVSOneLobby from './lobbies/custom-game-mode-lobbies/CustomOneVSOneLobby'
import CustomCoopLobby from './lobbies/custom-game-mode-lobbies/CustomCoopLobby'
import QueuingOnePlayerLobby from './lobbies/queuing-game-mode-lobbies/QueuingOnePlayerLobby'
import QueuingCoopLobby from './lobbies/queuing-game-mode-lobbies/QueuingCoopLobby'
import GameTypeTabs from './GameTypeTabs'
import { getPartyState, setViewToMainMenu } from 'multiplayer-tetris-redux'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { MultiplayerGameTypes } from 'multiplayer-tetris-types'


const MultiPlayerMenu = () => {

  const dispatch = useDispatch()
  const partyState = useSelector(getPartyState)

  const getLobby = (type: MultiplayerGameTypes) => {
    if (type === '1v1-custom') return <CustomOneVSOneLobby/>
    if (type === '1vAll-custom') return <CustomOneVSAllLobby/>
    if (type === 'coop-custom') return <CustomCoopLobby/>
    if (type.includes('1-queueing')) return <QueuingOnePlayerLobby/>
    if (type.includes('coop-queueing')) return <QueuingCoopLobby/>
    return null
  }

  return(
    <MenuOptionWrapper
      clsName="multiplayer-menu"
      optionTitle=''
      onBackButtonClick={() => { 
        dispatch(setViewToMainMenu())
      }}
    >
      {
        partyState ? (
          <div 
            style={{
              color: 'white',
              fontFamily: 'Exo',
              display: 'grid',
              gridTemplateColumns: '85% 15%',
              height: '100%'
            }}
          >
            <div 
              className="game-room"
              style={{ 
                height: '100%'
              }}
            >
              <div>
                <div style={{ 
                  paddingTop: '3.5vw',
                  textAlign: 'center',
                  fontSize: '3vw',
                }}>MULTIPLAYER MENU</div>
                <div></div>
                {/* { partyState?.id } */}
                <GameTypeTabs/>
                { 
                  getLobby(partyState.gameType) ? getLobby(partyState.gameType) : null
                }
              </div>
              <ParticipantList/>
            </div>
            <div 
              className="social-sidebar"
              style={{
                height: '100%'
              }}
            >
              <SocialList/>
            </div>
          </div>
        ) : null
      }
    </MenuOptionWrapper>
  )
} 



export default MultiPlayerMenu