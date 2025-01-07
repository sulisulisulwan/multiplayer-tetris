import * as React from 'react'

import PlayfieldGrid from './playfield/PlayfieldGrid'
import NextQueueDisplay from './next-queue/NextQueueDisplay'
import StartQuitButton from './StartQuitButton'
import ScoreDisplay from './score-display/ScoreDisplay'

import HoldQueueDisplay from './hold-queue/HoldQueueDisplay'

import { appStateIF, initialOptionsIF, setAppStateIF } from '../../types'

interface playViewPropsIF {
  appState: appStateIF
  startQuitClickHandler: (e: Event) => void
  playerKeystrokeHandler: React.KeyboardEventHandler<HTMLDivElement>
}

const PlayView = ({ appState, startQuitClickHandler, playerKeystrokeHandler }: playViewPropsIF ) => {

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
      }} onKeyDown={playerKeystrokeHandler}>SULI'S TETRIS</div>
      {appState.currentGamePhase === 'pregame' ? <div style={{textAlign: 'center'}}>{appState.pregameCounter + 1}</div> : <div style={{textAlign: 'center'}}> --- </div>}
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
          marginRight: 20
        }}>
          <HoldQueueDisplay 
            holdQueue={appState.holdQueue} 
            currentLevel={appState.currentLevel}
          />
          <ScoreDisplay 
            totalScore={appState.totalScore} 
            currentLevel={appState.currentLevel} 
            linesCleared={appState.totalLinesCleared}
          />
        </div>
        <div className='game-screen-center'>
          <PlayfieldGrid 
            currentGamePhase={appState.currentGamePhase}
            playfieldData={appState.playfield.slice(20)}
            currentLevel={appState.currentLevel}  
          />
        </div>
        <div className='game-screen-right' style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 20
        }}>
          <NextQueueDisplay 
            nextQueueData={appState.nextQueue}
            currentLevel={appState.currentLevel} 
          />
        </div>
      </div>
      <StartQuitButton currentGamePhase={appState.currentGamePhase} clickHandler={startQuitClickHandler}/>
    </div>
  )
}

export default PlayView