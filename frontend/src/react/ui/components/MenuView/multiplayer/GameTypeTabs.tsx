import * as React from 'react'
import ModalWrapper from '../../sharedComponents/modal/ModalWrapper'
import WebsocketBrowser from '../../../../sockets/websocket/WebsocketBrowser'
import HoverButton from '../../sharedComponents/HoverButton'
import { useSelector } from 'react-redux'
import { getUserState, getPartyState } from 'multiplayer-tetris-redux'
import { soundEffects } from '../../../../App'

type MultiplayerGameTypeTab = {
  displayName: 'CUSTOM 1 VS 1' | 'CUSTOM COOP' | 'CUSTOM 1 VS ALL' | '1 PLAYER' | 'COOP'
  metaName: string
}

const GameTypeTabs = () => {
  const userState = useSelector(getUserState)
  const partyState = useSelector(getPartyState)

  const [ bootAllFriendsModalOpen, setBootAllFriendsModalOpen ] = React.useState({
    targetGameType: null,
    isOpen: false
  })
  const gameTypes: MultiplayerGameTypeTab[] = [
    {
      displayName: '1 PLAYER',
      metaName: '1-queueing'
    },
    {
      displayName: 'COOP',
      metaName: 'coop-queueing'
    },
    {
      displayName: 'CUSTOM 1 VS 1',
      metaName: '1v1-custom'
    },
    {
      displayName: 'CUSTOM 1 VS ALL',
      metaName: '1vAll-custom'
    },
    {
      displayName: 'CUSTOM COOP',
      metaName: 'coop-custom',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <ul 
        style={{ 
          listStyle: 'none', 
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          width: '80%',
          paddingBottom: '1vh',
          borderBottom: '.1vh gray solid'
        }}>
        { gameTypes.map((gameType, idx) => {
          const isDisabled = 
            !userState.isHost || 
            partyState.gameType === gameType.metaName || 
            partyState.gameType.includes(gameType.metaName) ||
            partyState.status === 'queued'
          return (
            <li
              key={gameType.metaName + idx}
              style={{ 
                paddingLeft: '2vw',
                paddingRight: '2vw',
              }}
              >
              <HoverButton
                disabled={isDisabled}
                style={{
                  fontFamily: 'Exo',
                  fontSize: '1vw',
                  color: partyState.gameType.includes(gameType.metaName) ? 'aqua' : 'white', 
                  background: 'none',
                  border: 'none',
                  opacity: isDisabled && userState.isHost && partyState.status !== 'queued' ? ''  : .6 ,
                  cursor: partyState.gameType.includes(gameType.metaName) ? '' : 'pointer'
                }}
                opacityMin={partyState.gameType.includes(gameType.metaName) ? 1 : .5}
                opacityMax={1}
                onHover={() => { if (!isDisabled) soundEffects.play('menuBasicButtonHover') }}
                onClick={() => {
                  soundEffects.play('menuBasicButtonClick')
                  const selectedGameType = gameType
                  if (selectedGameType.metaName === '1-queueing') {
                    if (partyState.users.length > 1) {
                      if (partyState.gameType.includes('coop-queueing') || partyState.gameType.includes('custom')) {
                        return setBootAllFriendsModalOpen({
                          targetGameType: selectedGameType.metaName,
                          isOpen: true
                        })
                      }
                      const completeGameType =  selectedGameType.metaName + '-1v1'
                      WebsocketBrowser.send({ action: 'deleteRoom', data: { roomType: 'party', roomId: partyState.id } })
                      WebsocketBrowser.send({ action: 'createPartyRoom', data: { userId: userState.id, gameType: completeGameType }})
                    }
                  } else if (selectedGameType.metaName === 'coop-queueing') {
                    if (partyState.users.length > 3) {
                      if (partyState.gameType.includes('custom')) {
                        return setBootAllFriendsModalOpen({
                          targetGameType: selectedGameType.metaName,
                          isOpen: true
                        })
                      }
                    }
                  }
                  const completeGameType = selectedGameType.metaName === 'coop-queueing' ? 
                    selectedGameType.metaName + '-coop' : selectedGameType.metaName === '1-queueing' ?
                    selectedGameType.metaName + '-1v1' :
                    selectedGameType.metaName
                  WebsocketBrowser.send({ action: 'updatePartyRoomType', data: { roomId: partyState.id, gameType: completeGameType } })
                }}
                children={gameType.displayName}
              />
              <ModalWrapper
                modalName='warningBeforeContinue'
                isOpen={bootAllFriendsModalOpen.isOpen}
                fadeDuration={.2}
                setModalClosed={() => setBootAllFriendsModalOpen({
                  targetGameType: null,
                  isOpen: false
                })}
                childModalContext={{
                  type: 'warningBeforeContinue',
                  props: {
                    setModalClosed: () => setBootAllFriendsModalOpen({
                      targetGameType: null,
                      isOpen: false
                    }),
                    title: 'WARNING:',
                    text: 'Switching to 1 VS 1 will remove all party members.  Are you sure you want to proceed?',
                    onClickConfirm: () => {
                      WebsocketBrowser.send({
                        action: 'leaveAllPopulatedParties',
                        data: {
                          userId: userState.id,
                          partyId: userState.partyId,
                          targetGameType: bootAllFriendsModalOpen.targetGameType
                        }
                      })
                      setBootAllFriendsModalOpen({
                        targetGameType: null,
                        isOpen: false
                      })
                    }
                  }
                }}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default GameTypeTabs