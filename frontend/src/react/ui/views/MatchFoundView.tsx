import * as React from 'react'
import { soundEffects } from '../../App'
import { useDispatch } from 'react-redux'
import { setView, getGameState } from 'multiplayer-tetris-redux'
import { UserDataFromDB } from 'multiplayer-tetris-types'
import { useSelector } from 'react-redux'

const MatchFoundView = () => {

const dispatch = useDispatch()
  React.useEffect(() => {
    setTimeout(() => {
      dispatch(setView('multiplayerGameLoading'))
    }, 4000)
    soundEffects.play('matchFound')
  }, [])


  const multiplayerGameState = useSelector(getGameState)

  console.log('multiplayerGameState', multiplayerGameState)
  const [numOfPlayersOrMode, queueingOrCustom, gameModeQueueingOnly] = multiplayerGameState.gameType.split('-')
  const gameMode = queueingOrCustom === 'queueing' ? gameModeQueueingOnly : numOfPlayersOrMode

  multiplayerGameState.party1
  multiplayerGameState.party2

  let vsGraphic = null

  if (gameMode === '1v1') {
    vsGraphic = (
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          display: 'flex',
          alignContent: 'center',
          height: '60%'
        }}>
          <div style ={{
            height: '100%'
            
          }}>
            { multiplayerGameState.party1.users.map((userData: UserDataFromDB) => 
              <div
                key={userData.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  paddingRight: '15%'
                }}
              >
                <img 
                  style={{height: '100%'}}
                  src={userData.avatarSrc}
                />
                <div>{userData.name}</div>
              </div>
            ) }
  
          </div>
          <div style={{
            height: '100%'
          }}>
            { multiplayerGameState.party2.users.map((userData: UserDataFromDB) => 
              <div 
                key={userData.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  paddingLeft: '15%'
                }}
              >
                <img 
                  src={userData.avatarSrc}
                  style={{
                    height: '100%'
                  }}
                />
                <div>{userData.name}</div>
              </div>
            ) }
          </div>
        </div>
      </div>
  
    )
  }

  if (gameMode === '1vAll') {
    vsGraphic = (
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          display: 'flex',
          alignContent: 'center'
        }}>
          <div style ={{
            height: '40%'
          }}>
            { multiplayerGameState.party1.users.map((userData: UserDataFromDB) => 
              <div
                key={userData.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <img src={userData.avatarSrc}/>
                <div>{userData.name}</div>
              </div>
            ) }

          </div>
          <div style ={{
            height: '40%'
          }}>
            { multiplayerGameState.party2.users.map((userData: UserDataFromDB) => 
              <div
                key={userData.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <img src={userData.avatarSrc}/>
                <div>{userData.name}</div>
              </div>
            ) }
          </div>
        </div>
      </div>
    )
  }

  if (gameMode === 'coop') {
    vsGraphic = (
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style ={{
            height: '40%'
          }}>
            { multiplayerGameState.party1.users.map((userData: UserDataFromDB) => 
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <img src={userData.avatarSrc}/>
                <div>{userData.name}</div>
              </div>
            ) }

          </div>
          <div style ={{
            height: '40%'
          }}>
            { multiplayerGameState.party2.users.map((userData: UserDataFromDB) => 
              <div>
                <img src={userData.avatarSrc}/>
                <div>{userData.name}</div>
              </div>
            ) }
          </div>
        </div>
      </div>
    )
  }


  return (
    <div
      style={{
        height: '100%'
      }}
    >
      <div style={{
        position: 'absolute',
        height: '100%',
        fontFamily: 'Exo',
        fontWeight: '600',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '10vw',
        flexDirection: 'column',
        opacity: 1,
        animationName: 'matchFound-textzoom, matchFound-fadeOut',
        animationDuration: '.25s, 2s',
        animationDelay: '0s, 1s',
        animationFillMode: 'forwards',
        zIndex: 400,
        textShadow: '#FC0 1px 0 10px'
      }}>
        <div>MATCH</div>
        <div>FOUND</div>
      </div>
      {
        vsGraphic
      }
    </div>
  )
}

export default MatchFoundView