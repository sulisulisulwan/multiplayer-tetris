import * as React from 'react'
import PlayerSlot from '../PlayerSlot'
import LobbyAction from '../LobbyAction'
import { findDataInElementOrParent } from '../../../../../../utils/findDataInElementOrParent'
import WebsocketBrowser from '../../../../../sockets/websocket/WebsocketBrowser'
import { CoopSlotsQueueing, PartyState, UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'
import { getPartyState, getUserState } from 'multiplayer-tetris-redux'
import ModalWrapper from '../../../../sharedComponents/modal/ModalWrapper'
import { useContextMenuModal } from '../../../../hooks/useContextMenuModal'
import HoverButton from '../../../../sharedComponents/HoverButton'
import { soundEffects } from '../../../../../App'

let rightClickedSlotId: string = null // TODO: come on, this is messy

const QueueingCoopLobby = () => {

  const userState = useSelector<UserDataFromAPI, UserDataFromAPI>(getUserState)
  const partyState = useSelector<PartyState, PartyState>(getPartyState)

  const coopGameModeTabData = [
    {
      metaName: 'coop-queueing-coop',
      displayName: 'COOP',
      description: 'Play against another coop team.  Clear lines to create obstacles for the other team while clearing the obstacles they create for you.'
    },
    {
      metaName: 'coop-queueing-1vAll',
      displayName: '1 VS ALL',
      description: 'Play as a team against a single opponent.  Clear lines to create obstacles for the challenger while clearing the obstacles they create for you.'
    },
  ]
  



  const [ inviteModalOpen, setInviteModalOpen ] = React.useState(false)

  const optionHeight = 30
  const {
    isOpen,
    setModalOpen,
    setModalClosed,
    innerWindowStyle,
    modalBackgroundStyle,
    optionGroups
  } = useContextMenuModal([
    {
      type: '',
      options: [
        {
          imgSrc: '',
          text: 'Kick From Party',
          onClick: (e: any) => {
            const [slotType, slotIdx] = rightClickedSlotId.split('-');
            const playerId = (partyState.slots as CoopSlotsQueueing)[slotType as keyof CoopSlotsQueueing].users[Number(slotIdx)]
            // WebsocketBrowser.send({
            //   action: 'addPlayerToSlot',
            //   data: { 
            //     roomId: userState.partyId, 
            //     userId: playerId, 
            //     slotType: 'observers',
            //     slotIdx: null
            //   }
            // })
            setModalClosed()
          }
        }
      ]
    }
  ], optionHeight)

  const mapToUserData = (userId: string): UserDataFromAPI | UserDataFromDB => {
    let userData = null
    if (!userId) return userData
    userData = userState.friends.find(friend => friend.id === userId)
    if (!userData) {
      userData = userState.id === userId ? userState : null
    }
    return userData
  }

  const slots = partyState.slots as CoopSlotsQueueing


  let coopTeam: string[] = slots.coopTeam.users.slice()

  const coopTeamWithData = coopTeam.map(mapToUserData)

  const onLeftClickPlayerSlot = (e: any) => {
    const slotId = findDataInElementOrParent(e.target, 'slotid')
    const [slotType, slotIdx] = slotId.split('-')

    if ((partyState.slots as CoopSlotsQueueing).coopTeam.users[Number(slotIdx)] !== null) {
      //Do nothing if the slot is taken
      return
    }
    setInviteModalOpen(true)
  }

  const onRightClickPlayerSlot = (e: any) => {
    // this should allow the host to kick out people unless it is themselves where it should say Leave Party
    rightClickedSlotId = findDataInElementOrParent(e.target, 'slotid')
    setModalOpen(e)
  }

  return (
    <>
      <div
        className="queueing-coop-lobby"
        style={{
          minWidth: '85vw',
          minHeight: 460,
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
            coopGameModeTabData.map((gameType, idx) => {
              const chosenGameType = gameType
              const isDisabled = !userState.isHost || partyState.status === 'queued' || partyState.gameType === chosenGameType.metaName
              return (
                <li
                key={gameType.metaName + idx}
                style={{ 
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
                >
                <HoverButton
                  style={{
                    fontFamily: 'Exo',
                    fontSize: 20,
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
            fontSize: 13,
            paddingTop: 20,
            color: 'silver',
            width: 600,
          }}>
            { coopGameModeTabData.find((gameMode) => gameMode.metaName === partyState.gameType).description }
          </div>
        </div>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 50,
            marginBottom: 20
          }}
        >
          <div className='coopTeam'
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex'
              }}
            >
              {
                coopTeamWithData.map((player, idx) => {
                  return (
                    <div 
                      key={'coopTeamWithData' + idx}
                      style={{ marginRight: idx !== coopTeamWithData.length - 1 ? 20 : 0}}
                    >
                      <PlayerSlot
                        key={player?.name + player?.id + '' + idx}
                        slotId={`coopTeam-${idx}`}
                        onRightClickHandler={(e: React.MouseEvent) =>{
                          if (player) {
                            if (player.id === userState.id || userState.isHost) {
                              onRightClickPlayerSlot(e)
                            } 
                          } 
                        }}
                        onLeftClickHandler={onLeftClickPlayerSlot}
                        width={120} 
                        height={240} 
                        margin={10}
                        playerData={player}
                      />
                    </div>

                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <LobbyAction userState={userState} partyState={partyState}/>
      <ModalWrapper
        modalName='contextMenu'
        isOpen={isOpen}
        fadeAnimator={false}
        setModalClosed={setModalClosed}
        outsideAlerter={true}
        childModalContext={{
          type: 'contextMenu',
          props: {
            optionHeight: optionHeight,
            optionGroups: optionGroups
          }
        }}
        modalBackgroundStyle={modalBackgroundStyle}
        innerWindowStyle={innerWindowStyle}
      />
      <ModalWrapper 
        fadeDuration={.2}
        modalName='invite' 
        isOpen={inviteModalOpen} 
        setModalClosed={() => { setInviteModalOpen(false) }} 
        childModalContext={{ 
          type: 'invite', 
          props: {
            setModalClosed: () => setInviteModalOpen(false),
            playersList: userState.friends,
          }
        }}
      />
    </>
    
  )

}

export default QueueingCoopLobby