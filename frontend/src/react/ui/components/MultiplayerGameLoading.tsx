import * as React from 'react'
import { useSelector } from 'react-redux'
import { getMultiplayerGameState } from '../../redux/reducers/multiplayerGameState'
import { UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'

const MultiplayerGameLoading = () => {

  const multiplayerGameState = useSelector(getMultiplayerGameState)

  const [numOfPlayersOrMode, queueingOrCustom, gameModeQueueingOnly] = multiplayerGameState.gameType.split('-')
  const gameMode = queueingOrCustom === 'queueing' ? gameModeQueueingOnly : numOfPlayersOrMode

  multiplayerGameState.party1
  multiplayerGameState.party2

  if (gameMode === '1v1') {
    return (
      <div
        style={{
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
    <div
    style={{
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

  }

  if (gameMode === 'coop') {
    <div
    style={{
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

  }

}

export default MultiplayerGameLoading