import * as React from 'react'
import HoverButton from '../HoverButton'
import WebsocketBrowser from '../../../sockets/websocket/WebsocketBrowser'
import { UserDataFromAPI } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'
import { getPartyState, getUserState } from 'multiplayer-tetris-redux'

type InviteModalProps = {
  setModalClosed: React.MouseEventHandler<HTMLButtonElement>,
  playersList: UserDataFromAPI[]
}

const InviteModal = ({ setModalClosed, playersList }: InviteModalProps) => {

  const userState = useSelector(getUserState)
  const partyState = useSelector(getPartyState)

  return (
    <div
      style={{
        borderTop: 'solid white 1px',
        borderBottom: 'solid darkgray 1px',
        minHeight: 500,
        minWidth: 500,
        background: '#202020'
      }}
    >
      <HoverButton
        onClick={setModalClosed}
        style={{
          position: 'absolute',
          background: 'none',
          border: 'none',
          right: '1%',
          height: 60,
          width: 60,
          fontSize: 55
        }}
        opacityMax={1}
        opacityMin={.5}
        children={
          <img 
            style={{
              position: 'relative',
              width: 50,
              height: 50
            }}
            src={'assets/images/icons8-close-400.png'}
          />
        }
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 50,
          paddingTop: 20,
          fontSize: 40,
          fontFamily: 'Exo',
          color: 'white'
        }}
      >
        INVITE
      </div>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          height: 50,
          paddingTop: 20,
          paddingBottom: 20
      }}>
        <input 
          style={{
            width: 300,
            outline: 'none',
            color: 'white',
            fontSize: 15,
            background: 'rgb(60, 60, 60)'
          }}
          placeholder='Search'
        />
        <HoverButton
          onClick={() => {
            console.log('inviting via search bar....')
          }}
          style={{}}
          opacityMax={1}
          opacityMin={.5}
          children='INVITE'
        />
      </div>
      <div>
        {
          playersList.map((player: UserDataFromAPI, idx: number) => { 
            if (player.status === 'Offline') return null
            return (
              <HoverButton
                key={player.name + player.id + idx} 
                onClick={() => { 
                  WebsocketBrowser.send({
                    action: 'inviteToParty',
                    data: {
                      inviterId: userState.id,
                      inviteeId: player.id,
                      partyId: partyState.id
                    }
                  })  
                  setModalClosed(null)
                }}
                style={{
                  width: '100%',
                  height: 50
                }}
                opacityMax={1}
                opacityMin={.5}
                children={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      verticalAlign: 'center'
                    }}
                  >
                    <div>
                      <img style={{ height: 20, width: 20 }} src={player.avatarSrc}/>
                      <span style={{ paddingLeft: 10 }}>{player.name}</span>
                    </div>
                    <span>Invite</span>
                  </div>
                }
              />
            
            

            )
          })
        }
      </div>
    </div>
  )
}

export default InviteModal