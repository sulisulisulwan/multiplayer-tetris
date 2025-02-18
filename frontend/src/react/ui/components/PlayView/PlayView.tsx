import * as React from 'react'

import PlayfieldGrid from './playfield/PlayfieldGrid'
import NextQueueDisplay from './next-queue/NextQueueDisplay'
import ScoreDisplay from './score-display/ScoreDisplay'

import HoldQueueDisplay from './hold-queue/HoldQueueDisplay'

import PlayfieldGridOverlay from './playfield/PlayfieldGridOverlay'
import { useSelector } from 'react-redux'
import { getGameState } from 'multiplayer-tetris-redux'

const PlayView = () => {

  const gameState = useSelector(getGameState)

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
      flexDirection: 'column'
    }}>
      <div className="game-title" style={{
          display: 'flex',
          fontSize: 40,
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Andale mono'
        }}
      >SULI'S TETRIS</div>
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
          marginRight: 60
        }}>
          <HoldQueueDisplay 
            holdQueue={gameState.holdQueue} 
            currentLevel={gameState.currentLevel}
          />
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
          marginLeft: 20
        }}>
          <NextQueueDisplay 
            nextQueueData={gameState.nextQueue}
            currentLevel={gameState.currentLevel} 
          />
        </div>
      </div>
      {/* <StartQuitButton currentGamePhase={appState.gameState.currentGamePhase} clickHandler={startQuitClickHandler}/> */}
    </div>
  )
}

export default PlayView