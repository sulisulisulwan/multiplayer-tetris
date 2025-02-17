import * as React from 'react'
import PlayerSlot from '../PlayerSlot'
import LobbyAction from '../LobbyAction'
import { findDataInElementOrParent } from '../../../../../../../utils/findDataInElementOrParent'
import WebsocketBrowser from '../../../../../../sockets/websocket/WebsocketBrowser'
import { OnePlayerSlotsQueueing, UserDataFromAPI, UserDataFromDB, UserId } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'
import { getPartyState } from '../../../../../../redux/reducers/party'
import { getUserState } from '../../../../../../redux/reducers/user'
import HoverButton from '../../../../sharedComponents/HoverButton'
import { soundEffects } from '../../../../../../App'

const QueueingOnePlayerLobby = () => {

  const partyState = useSelector(getPartyState)
  const userState = useSelector(getUserState)

  const slots = partyState.slots as OnePlayerSlotsQueueing
  const player = slots.player

  const mapToUserData = (userId: UserId) => {
    let userData = null
    if (!userId) return userData
    userData = userState.friends.find(friend => friend.id === userId)
    if (!userData) {
      userData = userState.id === userId ? userState : null
    }
    return userData
  }
  const playerWithData = player.users.map(mapToUserData)

  const oneVSGameModeTabData = [
    {
      metaName: '1-queueing-1v1',
      displayName: '1 VS 1',
      description: 'Play against one opponent.  Clear lines to create obstacles for your challenger while clearing the obstacles they create for you.'
    },
    {
      metaName: '1-queueing-1vAll',
      displayName: '1 VS ALL',
      description: 'Play against a coop team of up to three opponents.  Clear lines to create obstacles for the other team while clearing the obstacles they create for you.'
    },
  ]

  return (
    <>
      <div
        className="queueing-one-player-lobby"
        style={{
          minWidth: '85vw',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ul
          style={{
            listStyle: 'none', 
            padding: 0,
            margin: 0,
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'Exo',
          }}
        >
          {
            oneVSGameModeTabData.map((gameType, idx) => {
              const chosenGameType = gameType
              const isDisabled = !userState.isHost || partyState.status === 'queued' || partyState.gameType === chosenGameType.metaName

              return (
                <li
                key={gameType.metaName + idx}
                style={{ 
                  paddingLeft: '1vw',
                  paddingRight: '1vw',
                }}
                >
                <HoverButton
                  style={{
                    fontFamily: 'Exo',
                    fontSize: '1.5vw',
                    color: partyState.gameType === chosenGameType.metaName ? 'aqua' : 'white', 
                    background: 'none',
                    border: 'none',
                    opacity: isDisabled && userState.isHost && partyState.status !== 'queued' ? ''  : .6 ,
                    cursor: partyState.gameType === chosenGameType.metaName ? '' : 'pointer'
                  }}
                  disabled={isDisabled}
                  opacityMin={partyState.gameType === chosenGameType.metaName ? 1 : .5}
                  opacityMax={1}
                  onHover={() => { if (!isDisabled) soundEffects.play('menuBasicButtonHover') }}
                  onClick={() => {
                    soundEffects.play('menuBasicButtonClick')
                    WebsocketBrowser.send({ action: 'updatePartyRoomType', data: { roomId: partyState.id, gameType: chosenGameType.metaName } })
                  }}
                  children={gameType.displayName}
                />
              </li>
              )
            })
          }
        </ul>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: '1vw',
            paddingTop: '3vh',
            color: 'silver',
            width: '40vw',
          }}>
            { oneVSGameModeTabData.find((gameMode) => gameMode.metaName === partyState.gameType).description }
          </div>
        </div>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5vh',
            // marginBottom: '4vh'
          }}
        >
          <div className='player'
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '5vh',
            }}
          >
            <div>
              <PlayerSlot 
                onRightClickHandler={() => {}}
                onLeftClickHandler={() => {}}
                slotId={`player1-${0}`}
                width={'15vh'} 
                height={'30vh'} 
                margin={'1vw'}
                playerData={playerWithData[0]}
                />
            </div>
          </div>

        </div>
      </div>
      <LobbyAction userState={userState} partyState={partyState}/>
    </>
  )
}


export default QueueingOnePlayerLobby