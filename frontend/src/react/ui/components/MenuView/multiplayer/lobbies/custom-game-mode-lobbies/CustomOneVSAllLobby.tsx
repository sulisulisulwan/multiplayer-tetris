import * as React from 'react'
import PlayerSlot from '../PlayerSlot'
import ModalWrapper from '../../../../sharedComponents/modal/ModalWrapper'
import LobbyAction from '../LobbyAction'
import { findDataInElementOrParent } from '../../../../../../../utils/findDataInElementOrParent'
import WebsocketBrowser from '../../../../../../sockets/websocket/WebsocketBrowser'
import { OneVAllSlotsCustom, UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'
import { getPartyState, getUserState } from 'multiplayer-tetris-redux'
import { useContextMenuModal } from '../../../../../hooks/useContextMenuModal'
import { soundEffects } from '../../../../../../App'

let rightClickedSlotId: string = null // TODO: come on, this is messy

const OneVSAllLobby = () => {

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
              const playerId = (partyState.slots as OneVAllSlotsCustom)[slotType as keyof OneVAllSlotsCustom].users[Number(slotIdx)]
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

  const slots = partyState.slots as OneVAllSlotsCustom
  const solo = slots.solo
  const coopTeam = slots.coopTeam
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

  const soloWithData = solo.users.map(mapToUserData)

  const coopTeamWithData = coopTeam.users.map (mapToUserData)
  const observersWithData = observers.users.map(mapToUserData)

  const onLeftClickPlayerSlot = (e: any) => {
    const slotId = findDataInElementOrParent(e.target, 'slotid')
    const [slotType, slotIdx] = slotId.split('-')
    
    if (slotType === 'observers' && userState.isHost) {
      // only the host can click on observers and assign them to slots
      alert('not yet implemented.  This allows the host to place other players in spots')
      return
    }

    
    if (['solo', 'coopTeam'].includes(slotType)) {
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
        className="custom-one-v-all-lobby"
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
        >ONE VS ALL </div>
        <div
          style={{
            display: 'flex',
            marginBottom: 40
          }}
        >
          <div className='players'
            style={{
              paddingLeft: 150,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 40
            }}
          >
            <div className='solo-challenger'
              style={{
                display: 'flex',
                justifyContent: 'left',
                paddingRight: 50
              }}
            >
              {
                soloWithData.concat([null]).map((playerData, index) => {
                  if (index === 0) {
                    return (
                      <PlayerSlot
                        key={playerData ? playerData.id : 'emtypysolot'}
                        onRightClickHandler={(e: React.MouseEvent) => {
                          if (soloWithData[0]) {
                            if (soloWithData[0].id === userState.id || userState.isHost) {
                              onRightClickPlayerSlot(e)
                            } 
                          }
                        }}
                        onLeftClickHandler={onLeftClickPlayerSlot}
                        slotId={`solo-${0}`}
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
            <div className='team-challengers'
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                height: 200
              }}
            >
              {
                coopTeamWithData.map((player, idx) => {
                  return (
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
                      slotId={`coopTeam-${idx}`}
                      width={100}
                      height={200}
                      margin={20}
                      playerData={player}
                    />
                  )
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
                    key={player?.name + player?.id + '' + idx}
                    onRightClickHandler={onRightClickPlayerSlot}
                    onLeftClickHandler={onLeftClickPlayerSlot}
                    slotId={`observers-${idx}`}
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

export default OneVSAllLobby