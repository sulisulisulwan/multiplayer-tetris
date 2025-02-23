import * as React from 'react'

import PlayfieldGrid from './playfield/PlayfieldGrid'
import NextQueueDisplay from './next-queue/NextQueueDisplay'
import ScoreDisplay from './score-display/ScoreDisplay'

import HoldQueueDisplay from './hold-queue/HoldQueueDisplay'

import PlayfieldGridOverlay from './playfield/PlayfieldGridOverlay'
import { useSelector } from 'react-redux'
import { getGameState } from 'multiplayer-tetris-redux'

const SingleplayerPlayView = () => {

  const gameState = useSelector(getGameState)
  console.log(gameState)
  const pregameCounter = gameState.currentGamePhase === 'pregame' ? (
    <div style={{
      color: 'white',
      fontFamily: 'Exo',
      fontSize: 100,
      textAlign: 'center',
      position: 'absolute',
      left: '47%',
      top: '38%',
      fontWeight: 500,
      animation: 'fadeOutAndMinimize 1 1s ease-in'
    }}>{gameState.pregameCounter + 1}</div> 
  ) : null

  return (
    <div className="game-app-wrapper" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      { pregameCounter }
      <div className="game-screen" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
          marginTop: 20,
          height: '100%'
      }}>
        <div className='game-screen-left' style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: '3vw'
        }}>
          <HoldQueueDisplay 
            holdQueue={gameState.holdQueue} 
            currentLevel={gameState.currentLevel}
          />
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              paddingTop: '2vh',
              paddingBottom: '2vh',
              height: '4vh',
              textAlign: 'center',
              textTransform: 'uppercase',
              marginBottom: '5vh',
              fontSize: '2.5vh',
              fontFamily: 'Exo',
              fontWeight: 300,
              color: 'white',
              boxShadow: '3px 3px 20px white'
            }}
          >{gameState.gameMode}</div>
          <ScoreDisplay 
            totalScore={gameState.totalScore} 
            currentLevel={gameState.currentLevel} 
            linesCleared={gameState.totalLinesCleared}
          />
        </div>
        <div className='game-screen-center-overlay'>
          <PlayfieldGridOverlay 
            currentGamePhase={gameState.currentGamePhase}
            playfieldData={gameState.playfieldOverlay.slice(20)}
            currentLevel={gameState.currentLevel}  
          />
        </div>
        <div className='game-screen-center'>
          <PlayfieldGrid 
            currentGamePhase={gameState.currentGamePhase}
            playfieldData={gameState.playfield.slice(20)}
            currentLevel={gameState.currentLevel}  
          />
        </div>
        <div className='game-screen-right' style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <NextQueueDisplay 
            nextQueueData={gameState.nextQueue}
            currentLevel={gameState.currentLevel} 
          />
        </div>
      </div>
    </div>
  )
}

export default SingleplayerPlayView