import * as React from 'react'
import PlayerSlot from '../PlayerSlot'
import LobbyAction from '../LobbyAction'
import { findDataInElementOrParent } from '../../../../../../../utils/findDataInElementOrParent'
import WebsocketBrowser from '../../../../../../sockets/websocket/WebsocketBrowser'
import { CoopSlotsCustom, UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'
import { getPartyState, getUserState } from 'multiplayer-tetris-redux'
import ModalWrapper from '../../../../sharedComponents/modal/ModalWrapper'
import { useContextMenuModal } from '../../../../../hooks/useContextMenuModal'
import { soundEffects } from '../../../../../../App'

let rightClickedSlotId: string = null // TODO: come on, this is messy

const CoopLobby = () => {

  const userState = useSelector(getUserState)
  const partyState = useSelector(getPartyState)

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
          text: 'Remove from Slot',
          onClick: (e: any) => {
            const [slotType, slotIdx] = rightClickedSlotId.split('-');
            const playerId = (partyState.slots as CoopSlotsCustom)[slotType as keyof CoopSlotsCustom].users[Number(slotIdx)]
            soundEffects.play('menuPlayerSlotRemove')
            WebsocketBrowser.send({
              action: 'addPlayerToSlot',
              data: { 
                roomId: userState.partyId, 
                userId: playerId, 
                slotType: 'observers',
                slotIdx: null
              }
            })
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

  const slots = partyState.slots as CoopSlotsCustom


  let team1: string[] = slots.team1.users.slice()
  let team2: string[] = slots.team2.users.slice()
  let observers: string[] = slots.observers.users.slice()

  const team1WithData = team1.map(mapToUserData)
  const team2WithData = team2.map (mapToUserData)
  const observersWithData = observers.map(mapToUserData)

  const onLeftClickPlayerSlot = (e: any) => {
    const slotId = findDataInElementOrParent(e.target, 'slotid')
    const [slotType, slotIdx] = slotId.split('-')

    if (slotType === 'observers') {
      // only the host can click on observers and assign them to slots
      alert('not yet implemented.  This allows the host to place other players in spots')
      return
    }

    if (['team1', 'team2'].includes(slotType)) {
      soundEffects.play('menuPlayerSlotPlace')
      WebsocketBrowser.send({ 
        action: 'addPlayerToSlot', 
        data: { 
          roomId: userState.partyId, 
          userId: userState.id, 
          slotType,
          slotIdx
        }
      })
    }
  }

  const onRightClickPlayerSlot = (e: any) => {
    rightClickedSlotId = findDataInElementOrParent(e.target, 'slotid')
    setModalOpen(e)
  }

  return (
    <>
      <div
        className="custom-coop-lobby"
        style={{
          minWidth: '85vw',
          minHeight: 460,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 20,
            fontFamily: 'Exo',
            display: 'flex',
            justifyContent: 'center'
          }}
        >TEAM COOP</div>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className='team-1'>
            TEAM 1
            <div
              style={{
                display: 'flex',
                paddingTop: 20
              }}
            >
              {
                team1WithData.map((player, idx) => {
                  return (
                    <div style={{
                      paddingLeft: 10,
                      paddingRight: 10
                    }}>
                      <PlayerSlot
                        key={player?.name + player?.id + '' + idx}
                        slotId={`team1-${idx}`}
                        onRightClickHandler={(e: React.MouseEvent) =>{
                          if (player) {
                            if (player.id === userState.id || userState.isHost) {
                              onRightClickPlayerSlot(e)
                            } 
                          } 
                        }}
                        onLeftClickHandler={onLeftClickPlayerSlot}
                        width={100}
                        height={200}
                        margin={5}
                        playerData={player}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div
            style={{
              border: 'solid .5px gray',
              height: 250
            }}
          />
          <div className='team-2'>
            <div style={{ display: 'flex', justifyContent: 'right'}}>TEAM 2</div>
            <div
              style={{
                display: 'flex',
                paddingTop: 20
              }}
            >
              {
                team2WithData.map((player, idx) => {
                  return (
                    <div style={{
                      paddingLeft: 10,
                      paddingRight: 10
                    }}>
                      <PlayerSlot
                        key={player?.name + player?.id + '' + idx}
                        onRightClickHandler={(e: React.MouseEvent) => {
                          if (player) {
                            if (player.id === userState.id || userState.isHost) {
                              onRightClickPlayerSlot(e)
                            } 
                          }
                        }}
                        onLeftClickHandler={onLeftClickPlayerSlot}
                        slotId={`team2-${idx}`}
                        width={100}
                        height={200}
                        margin={5}
                        playerData={player}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className='observers'
          style={{
            marginTop: 20,
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="observers-title" style={{ display: 'flex', justifyContent: 'center' }}>OBSERVERS</div>
          <div className='observers-cards'
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {
              observersWithData.map((player, idx) => {
                return (
                  <div style={{
                    paddingLeft: 20,
                    paddingRight: 20
                  }}>
                    <PlayerSlot
                      key={player?.name + player?.id + '' + idx}
                      slotId={`observers-${idx}`}
                      onRightClickHandler={(e: React.MouseEvent) => {}}
                      onLeftClickHandler={onLeftClickPlayerSlot}
                      width={50}
                      height={100}
                      margin={5}
                      playerData={player}
                    />
                  </div>
                )
              })
            }
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
    </>

  )

}

export default CoopLobby