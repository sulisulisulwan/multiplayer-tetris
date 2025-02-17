import * as React from 'react'
import HoverButton from '../../../sharedComponents/HoverButton'
import WebsocketBrowser from '../../../../../sockets/websocket/WebsocketBrowser'
import { UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'
import ModalWrapper from '../../../sharedComponents/modal/ModalWrapper'
import { useSelector } from 'react-redux'
import { getPartyState } from '../../../../../redux/reducers/party'
import { getUserState } from '../../../../../redux/reducers/user'
import { useContextMenuModal } from '../../../../hooks/useContextMenuModal'



type PlayerSocialCardProps = {
  playerData: UserDataFromDB | UserDataFromAPI,
}

const PlayerSocialCard = ({ playerData }: PlayerSocialCardProps) => {

  const partyState = useSelector(getPartyState)
  const userState = useSelector(getUserState)

  const [ removeFriendModalOpen, setRemoveFriendModalOpen ] = React.useState(false)

  const optionHeight = 30
  const {
    isOpen,
    setModalOpen,
    setModalClosed,
    innerWindowStyle,
    modalBackgroundStyle,
    optionGroups
  } = useContextMenuModal(
    [
      {
        type: '',
        options: [
          {
            imgSrc: './assets/images/send-message-48.png',
            text: 'Send Message',
            onClick: () => {
              alert('TODO: implement send message')
            }
          },
          {
            imgSrc: './assets/images/view-career-48.png',
            text: 'View Career',
            onClick: () => {
              alert('TODO: implement view career')
            }
          },
          {
            imgSrc: './assets/images/send-invite-48.png',
            text: 'Invite',
            onClick: () => {
              WebsocketBrowser.send({
                action: 'inviteToParty',
                data: {
                  inviterId: userState.id,
                  inviteeId: playerData.id,
                  partyId: partyState.id
                }
              })  
              setModalClosed()
            }
          },
          {
            imgSrc: './assets/images/request-to-join-48.png',
            text: 'Request to Join',
            onClick: () => {
              WebsocketBrowser.send({
                action: 'requestToJoinParty',
                data: {
                  requesteeId: playerData.id,
                  requesterId: userState.id,
                }
              })  
              setModalClosed()
            }
          },
        ]
      },
      {
        type: '',
        options: [
          {
            imgSrc: './assets/images/edit-note-48.png',
            text: 'Edit Friend Note',
            onClick: () => {
              alert('TODO: implement edit friend note')
            }
          },
          {
            imgSrc: './assets/images/remove-friend-48.png',
            text: 'Remove Friend',
            onClick: () => {
              setRemoveFriendModalOpen(true)
              setModalClosed()
            }
          }
        ]
      },
      {
        type: '',
        options: [
          {
            imgSrc: './assets/images/block-player-48.png',
            text: 'Block Player',
            onClick: () => {
              alert('TODO: implement block player')
            }
          },
        ]
      }
    ],
    optionHeight
  )

  
  return (
    <li
      onContextMenu={setModalOpen}
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        height: '5vh',
      }}
    >
      <HoverButton
        key={playerData.id}
        onClick={() => {}}
        style={{
          color: 'white',
          background: '#0C2340',
          width: '100%',
          height: '100%',
          padding: 0,
          borderTop: 'white solid .5',
          borderLeft: 0,
          borderWidth: .5
        }}
        children={
          <div 
            className="player-card-info"
            style={{ 
              display: 'flex',
              height: '100%',
              width: '100%'
            }}
          >
      
            <div
              style={{
                height: '100%', 
                aspectRatio: '1/1',
                background: '#5072A7'
              }}
            >
              <div 
                className='avatar-img'
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  background: `url(${playerData.avatarSrc}) no-repeat center`,
                  backgroundSize: '80% 80%',
                }}
              />
      
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                paddingTop: '.7vh',
                width: '100%',
                backgroundColor: '#002D62'
              }}
            >
              <div 
                style={{ 
                  fontFamily: 'Exo',
                  paddingLeft: '1vh',
                  fontSize: '1.5vh',
                  fontWeight: 700,
                  textAlign: 'left',
                }}
              >{playerData.name}</div>
              <div
                style={{
                  color: getStatusColor(playerData.status, partyState?.gameType || ''),
                  paddingLeft: '1vh',
                  fontSize: '1.2vh',
                  textAlign: 'left',
                  lineHeight: '.1vh'
                }}
              >
                <div className="status-circle"
                  style={{
                    position: 'relative',
                    minHeight: '.7vh',
                    left: '-1.5vh',
                    top: '.5vh',
                    maxWidth: '.7vh',
                    border: '1px solid white',
                    borderRadius: 34,
                    backgroundColor: getStatusColor(playerData.status, playerData.partyPublic?.gameType || '')
                  }}
                ></div>
                <span>{getStatusActivity(playerData.status, playerData.partyPublic?.gameType || '')}</span>
              </div>
            </div>
          </div>

        }
        opacityMax={1}
        opacityMin={.8}
      />  
      <ModalWrapper
        modalName='warningBeforeContinue'
        isOpen={removeFriendModalOpen}
        fadeDuration={.2}
        setModalClosed={() => setRemoveFriendModalOpen(false)}
        childModalContext={{
          type: 'warningBeforeContinue',
          props: {
            setModalClosed: () => setRemoveFriendModalOpen(false),
            title: 'REMOVE FRIEND',
            text: playerData.name,
            onClickConfirm: () => {
              WebsocketBrowser.send({
                action: 'removeFriend',
                data: {
                  userId: userState.id,
                  friendId: playerData.id
                }
              })
              setRemoveFriendModalOpen(false)
            },
          }
        }}
      />
      {
        playerData.id === userState.id ? null 
        :
        <ModalWrapper
          modalName='contextMenu'
          isOpen={isOpen}
          fadeAnimator={false}
          setModalClosed={setModalClosed}
          outsideAlerter={true}
          childModalContext={{
            type: 'contextMenu',
            props: {
              optionHeight,
              optionGroups
            }
          }}
          modalBackgroundStyle={modalBackgroundStyle}
          innerWindowStyle={innerWindowStyle}
        />
      }
    </li>
  )
}


const getStatusColor = (status: string, roomType: string) => {
  if (status === 'Offline') return 'lightgray'
  if (status === 'Away') return 'yellow'
  if (status === 'Online') {
    if (roomType === null) return 'aquamarine'
    return '#89CFF0'
  }
}

const getStatusActivity = (status: string, roomType: string) => {
  if (status === 'Online') {
    // if (roomType === null) return 'Available'
    if (roomType === null) return 'Online'
    return roomType
  }
  return status
}

export default PlayerSocialCard