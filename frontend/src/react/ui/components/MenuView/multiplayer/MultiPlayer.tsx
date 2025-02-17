import * as React from 'react'

import MenuOptionWrapper from '../MenuOptionWrapper'
import ParticipantList from './social-sidebar/ParticipantList'
import SocialList from './social-sidebar/SocialList'
import CustomOneVSAllLobby from './lobbies/custom-game-mode-lobbies/CustomOneVSAllLobby'
import CustomOneVSOneLobby from './lobbies/custom-game-mode-lobbies/CustomOneVSOneLobby'
import CustomCoopLobby from './lobbies/custom-game-mode-lobbies/CustomCoopLobby'
import QueuingOnePlayerLobby from './lobbies/queuing-game-mode-lobbies/QueuingOnePlayerLobby'
import QueuingCoopLobby from './lobbies/queuing-game-mode-lobbies/QueuingCoopLobby'
import GameTypeTabs from './GameTypeTabs'
import { getPartyState } from '../../../../redux/reducers/party'
import { useSelector } from 'react-redux'
import { setViewToMainMenu } from '../../../../redux/reducers/view'
import { useDispatch } from 'react-redux'
import { MultiplayerGameTypes } from 'multiplayer-tetris-types'


const MultiPlayer = () => {

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



export default MultiPlayer