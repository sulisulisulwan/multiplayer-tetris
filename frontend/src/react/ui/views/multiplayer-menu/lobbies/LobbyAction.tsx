import * as React from 'react'
import { AppState } from 'multiplayer-tetris-types'
import HoverButton from '../../../sharedComponents/HoverButton'
import WebsocketBrowser from '../../../../sockets/websocket/WebsocketBrowser'
import { soundEffects } from '../../../../App'

type LobbyActionProps = {
  userState: AppState['user']
  partyState: AppState['party']
}

const LobbyAction = ({ userState, partyState }: LobbyActionProps) => {

  let isMultiMemberParty = !partyState.gameType.includes('1-queueing')
  let userIsHost = userState.isHost
  let enoughPeoplePresentToStart = isMultiMemberParty ? partyState.users.length > 1 : true
  let isQueued = partyState.status === 'queued'

  let queueingDequeueingEnabled = isQueued ? true
    : !isMultiMemberParty ? true
    : userIsHost && enoughPeoplePresentToStart

  const backgroundColor = 'rgba(54, 54, 54, 0.5)'
  const queueingButtonBackgroundColor = partyState.status === 'dequeued' ? 'rgba(86, 34, 34, 0.8)' : 'rgba(0, 0, 0, 0.3)'


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div>
        <HoverButton
          onClick={() => { console.log('practice')}}
          onHover={() => { soundEffects.play('menuBasicButtonHover') }}
          opacityMax={1}
          opacityMin={.8}
          style={{
            color: 'white',
            background: backgroundColor,
            width: '10vw',
            height: '4vh',
            fontSize: '1.8vh',
            fontFamily: 'Exo'
          }}
          children='PRACTICE'
        />
      </div>
      <div>
        <HoverButton
          disabled={!queueingDequeueingEnabled}
          onHover={() => { if (queueingDequeueingEnabled) soundEffects.play('menuBasicButtonHover') }}
          onClick={() => { 
            if (partyState.status === 'dequeued') {
              soundEffects.play('menuEnqueue')
              
              WebsocketBrowser.send({
                action: 'queueParty',
                data: {
                  partyId: partyState.id
                }
              })
            }

            if (partyState.status === 'queued') {
              soundEffects.play('menuDequeue')
              WebsocketBrowser.send({
                action: 'dequeueParty',
                data: {
                  partyId: partyState.id
                }
              })
            }
          }}
          opacityMax={1}
          opacityMin={.8}
          style={{
            color: queueingDequeueingEnabled ? (partyState.status === 'queued' ? 'rgba(173, 253, 241, 0.99)': 'white' ): 'dimgray',
            marginLeft: '5vw',
            marginRight: '5vw',
            background: queueingButtonBackgroundColor,
            width: '10vw',
            height: '6vh',
            fontWeight: 600,
            fontSize: '2.5vh',
            fontFamily: 'Exo'
          }}
          children={
            partyState.status === 'dequeued' ? 
              'START' : partyState.status === 'queued' ?
              'QUEUED' : 'ERROR' }
        />
        
      </div>
      <div>
        <HoverButton
          disabled={ partyState.users.length === 1 }
          onHover={() => { if (partyState.users.length !== 1) soundEffects.play('menuBasicButtonHover') }}
          onClick={() => { 
            soundEffects.play('menuBasicButtonClick')
            WebsocketBrowser.send({
              action: 'leaveAllPopulatedParties',
              data: {
                userId: userState.id,
                partyId: userState.partyId,
                targetGameType: '1-queueing-1v1'
              }
            })
          }}
          opacityMin={.8}
          opacityMax={1}
          style={{
            color: partyState.users.length === 1 ? 'dimgray' : 'white',
            background: backgroundColor,
            width: '10vw',
            height: '4vh',
            fontSize: '1.8vh',
            fontFamily: 'Exo'
          }}
          children='LEAVE PARTY'
        />
        
      </div>
    </div>
  )
}

export default LobbyAction