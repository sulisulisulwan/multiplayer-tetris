import { useSelector } from "react-redux"
import { UserDataFromDB } from "../../../../../../../../types/shared"
import WebsocketBrowser from "../../../../../sockets/websocket/WebsocketBrowser"
import HoverButton from "../../../sharedComponents/HoverButton"
import PlayerSocialCard from "./PlayerSocialCard"
import * as React from 'react'
import { getUserState, getPartyState } from "multiplayer-tetris-redux"

const SocialList = () => {

  const userState = useSelector(getUserState)
  const partyState = useSelector(getPartyState)

  const offline: UserDataFromDB[] = []
  const online: UserDataFromDB[] = []

  userState.friends.forEach(friend => {
    friend.status === 'Offline' ? offline.push(friend) : online.push(friend)
  })

  
  const friendsWhoInvitedMe = online.filter((friendData) => Object
    .keys(friendData.pendingInvites)
    .filter(invitedUserId => invitedUserId === userState.id)
    .length
  )

  const friendsWhoRequestedToJoinMe = online.filter((friendData) => userState.pendingRequestsToJoin[friendData.id] === true) 

  return (
    <div style={{
      background: '#0C2340',
      opacity: .8,
      height: '100%',
      minWidth: '15vw'
    }}>
      <div 
        style={{
          margin: 0,
          fontSize: '2vh',
          fontWeight: 600,
          paddingTop: '1.5vh', 
          paddingLeft: '1.5vw'
        }}
      >SOCIAL</div>
      <div style={{ 
        borderBottom: '.2vh gray solid'
      }}>
        <PlayerSocialCard playerData={userState}/>
        {
          friendsWhoInvitedMe.map((friendWhoInvitedMe, index) => {
            return (
              <div
                key={friendWhoInvitedMe.id + index}
                style={{
                  paddingLeft: '10%',
                  paddingTop: '5%',
                  paddingBottom: '5%'
                }}
              >
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '1.5vh',
                  height: '100%',
                  width: '100%'
                }}>
                  <div 
                    className='avatar-img'
                    style={{ 
                      height: '4vh', 
                      width: '4vh', 
                      marginRight: '1vw',
                      background: `url(${friendWhoInvitedMe.avatarSrc}) no-repeat center`,
                      backgroundSize: '100% 100%',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '.8vw', height: '50%', width: '100%' }}>{friendWhoInvitedMe.name}</div>
                    <div style={{ fontSize: '.8vw', height: '50%', width: '100%'  }}>INVITED YOU TO JOIN</div>
                  </div>
                </div>
                <div style={{ display: 'flex'}}>
                  <HoverButton
                    style={{
                      height: '5vh',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0)',
                      border: 'white .1vw solid',
                      fontFamily: 'Exo',
                      fontSize: '1vw',
                      width: '70%',
                      marginRight: '5%'
                    }}
                    onClick={() => {
                      WebsocketBrowser.send({
                        action: 'acceptInvitation',
                        data: {
                          inviterId: friendWhoInvitedMe.id,
                          inviteeId: userState.id,
                          partyId: friendWhoInvitedMe.pendingInvites[userState.id],
                          inviteeOldPartyId: partyState.id
                        }
                      })
                    }}
                    children='JOIN PARTY'
                  />
                  <HoverButton
                    style={{ background: 'none', padding: 0, border: 0 }}
                    onClick={() => {
                      WebsocketBrowser.send({
                        action: 'declineInvitation',
                        data: {
                          inviterId: friendWhoInvitedMe.id,
                          inviteeId: userState.id,
                          invitationToPartyId: friendWhoInvitedMe.pendingInvites[userState.id]
                        }
                      })
                    }}
                    children={<img style={{ height: '4vh', width: '4vh' }} src='assets/images/icons8-close-100.png'/>}
                  />
                </div>
              </div>
            )
          })
        }
        {
          friendsWhoRequestedToJoinMe.map((friendWhoRequestedToJoin, index) => {
            return (
              <div
                key={friendWhoRequestedToJoin.id + index}
                style={{
                  paddingLeft: '10%',
                  paddingTop: '5%',
                  paddingBottom: '5%'
                }}
              >
                <div style={{ display: 'flex'}}>
                  <div 
                    className='avatar-img'
                    style={{ 
                      height: '4vh', 
                      width: '4vh', 
                      marginRight: '1vw',
                      background: `url(${friendWhoRequestedToJoin.avatarSrc}) no-repeat center`,
                      backgroundSize: '100% 100%',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '.6vw', height: '50%', width: '100%' }}>{friendWhoRequestedToJoin.name}</div>
                    <div style={{ fontSize: '.6vw', height: '50%', width: '100%' }}>REQUESTED TO JOIN YOUR PARTY</div>
                  </div>
                </div>
                <div style={{ display: 'flex'}}>
                  <HoverButton
                    style={{
                      height: '5vh',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0)',
                      border: 'white .1vw solid',
                      fontFamily: 'Exo',
                      fontSize: '1vw',
                      width: '70%',
                      marginRight: '5%'
                    }}
                    onClick={() => {
                      WebsocketBrowser.send({
                        action: 'acceptRequestToJoinParty',
                        data: {
                          requesterId: friendWhoRequestedToJoin.id,
                          requesteeId: userState.id,
                          partyId: partyState.id,
                        }
                      })
                    }}
                    children='ACCEPT REQUEST'
                  />
                  <HoverButton
                    style={{ background: 'none', padding: 0, border: 0 }}
                    onClick={() => {
                      WebsocketBrowser.send({
                        action: 'declineRequestToJoinParty',
                        data: {
                          requesterId: friendWhoRequestedToJoin.id,
                          requesteeId: userState.id,
                        }
                      })
                    }}
                    children={<img style={{ height: '4vh', width: '4vh' }} src='assets/images/icons8-close-100.png' alt="decline-invitation"/>}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
      <SocialAccordion playerList={online} title={'FRIENDS'}/>
      <SocialAccordion playerList={offline} title={'OFFLINE'}/>
    </div>
  )
}

type SocialAccordionProps = {
  playerList: UserDataFromDB[]
  title: string
}

const SocialAccordion = ({ playerList, title }: SocialAccordionProps) => {
  const [ isOpen, setIsOpen ] = React.useState(true)
  
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          background: '#1F305E',
          fontSize: '1vw',
          paddingTop: '1vh',
          paddingBottom: '1vh',
          border: 'black  .1vh solid',
          display: 'flex',
          justifyContent: 'space-between'
        }}
        >
          <div>
            <span
              style={{
                paddingLeft: '1vw',
                paddingRight: '1vw'
              }}
              >{playerList.length}</span>
            <span
              style={{
                width: '100%'
              }}
            >{title}</span>
          </div>
          <div style={{ paddingRight: '1vw' }}>
            { isOpen ? <>&#9650;</> : <>&#9660;</>}
          </div>
      </div>
      <ul 
        style={{ 
          margin: 0,
          listStyle: 'none', 
          padding: 0
        }}
      >
        {
          isOpen ? playerList.map((player) => {
            return (
              <PlayerSocialCard key={player.name} playerData={player}/>
            )
          }) : null
        }
      </ul>
    </>
    
  )
}

export default SocialList