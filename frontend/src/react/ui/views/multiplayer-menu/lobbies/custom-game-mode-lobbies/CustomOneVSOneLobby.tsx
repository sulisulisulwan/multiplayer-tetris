import * as React from 'react'
import PlayerSlot from '../PlayerSlot'
import LobbyAction from '../LobbyAction'
import ModalWrapper from '../../../../sharedComponents/modal/ModalWrapper'
import { findDataInElementOrParent } from '../../../../../../utils/findDataInElementOrParent'
import WebsocketBrowser from '../../../../../sockets/websocket/WebsocketBrowser'
import { OneVOneSlotsCustom, PartyState, UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'
import { getPartyState, getUserState } from 'multiplayer-tetris-redux'
import { useContextMenuModal } from '../../../../hooks/useContextMenuModal'
import { soundEffects } from '../../../../../App'

let rightClickedSlotId: string = null // TODO: come on, this is messy

const OneVSOneLobby = () => {

  const partyState = useSelector<PartyState, PartyState>(getPartyState)
  const userState = useSelector<UserDataFromAPI, UserDataFromAPI>(getUserState)

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
            const playerId = (partyState.slots as OneVOneSlotsCustom)[slotType as keyof OneVOneSlotsCustom].users[Number(slotIdx)]
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

  const onLeftClickPlayerSlot = (e: any) => {

    const slotId = findDataInElementOrParent(e.target, 'slotid')
    const [slotType, slotIdx] = slotId.split('-')

    if (slotType === 'observers') {
      // only the host can click on observers and assign them to slots
      alert('not yet implemented.  This allows the host to place other players in spots')
      return
    }

    if (['player1', 'player2'].includes(slotType)) {
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

  const slots = partyState.slots as OneVOneSlotsCustom
  const player1 = slots.player1
  const player2 = slots.player2
  const observers = slots.observers

  const mapToUserData = (userId: string): UserDataFromAPI | UserDataFromDB => {
    let userData = null
    if (!userId) return userData
    userData = userState.friends.find(friend => friend.id === userId)
    if (!userData) {
      userData = userState.id === userId ? userState : null
    }
    return userData
  }
  const player1WithData = player1.users.map(mapToUserData)
  const player2WithData = player2.users.map(mapToUserData)
  const observersWithData = observers.users.map(mapToUserData)

  return (
    <>
      <div
        className="custom-one-v-one-lobby"
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
        >ONE VS ONE</div>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 50,
            marginBottom: 20
          }}
        >
          <div className='players'
            style={{
              paddingLeft: 150,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 40,
              paddingRight: 50
            }}
          >
            <div
              style={{ marginRight: 10 }}
            >
              {
                player1WithData.concat([null]).map((playerData, index) => {
                  if (index === 0) {
                    return (
                      <PlayerSlot 
                        key={playerData ? playerData.id : 'emtypysolot'}
                        onRightClickHandler={(e: React.MouseEvent) => {
                          if (playerData) {
                            if (playerData.id === userState.id || userState.isHost) {
                              onRightClickPlayerSlot(e)
                            }
                          }
                        }}
                        onLeftClickHandler={onLeftClickPlayerSlot}
                        slotId={`player1-${0}`}
                        width={150} 
                        height={300} 
                        margin={10}
                        playerData={playerData}
                      />
                    )
                  } else {
                    return <div key={'dummyAnimationDivNoDisplay'} style={{ display: 'none' }}></div>
                  }
                })
              }
            </div>
            <div
              style={{ marginLeft: 10 }}
            >
              {
                player2WithData.concat([null]).map((playerData, index) => {
                  if (index === 0) {
                    return (
                      <PlayerSlot 
                        key={playerData ? playerData.id : 'emtypysolot'}
                        onRightClickHandler={(e: React.MouseEvent) => {
                          if (playerData) {
                            if (playerData.id === userState.id || userState.isHost) {
                              onRightClickPlayerSlot(e)
                            }
                          }
                        }}
                        onLeftClickHandler={onLeftClickPlayerSlot}
                        slotId={`player2-${0}`}
                        width={150} 
                        height={300} 
                        margin={10}
                        playerData={playerData}
                      />
                    )
                  } else {
                    return <div key={'dummyAnimationDivNoDisplay'} style={{ display: 'none' }}></div>
                  }
                })
              }
            </div>
          </div>
          <div className='observers'
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              borderLeft: 'solid 1px gray',
              paddingLeft: 20
            }}  
          >
            <div>OBSERVERS</div>
            {
              observersWithData.map((player, idx) => {
                return (
                  <PlayerSlot
                    slotId={`observers-${idx}`}
                    key={player?.name + player?.id + '' + idx}
                    onRightClickHandler={onRightClickPlayerSlot}
                    onLeftClickHandler={onLeftClickPlayerSlot}
                    width={50}
                    height={100}
                    margin={10}
                    playerData={player}
                  />
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


export default OneVSOneLobby