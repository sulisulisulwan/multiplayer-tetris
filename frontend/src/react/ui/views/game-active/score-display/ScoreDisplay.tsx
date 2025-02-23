import * as React from 'react'
import { levelColors } from '../levelColors'

interface ScoreDisplayProps { 
  currentLevel: number
  linesCleared: number
  totalScore: number
}

const ScoreDisplay = (props: ScoreDisplayProps) => {

  const { currentLevel, linesCleared, totalScore } = props


  return (
    <div className="score-display"
      style={{
        fontFamily: 'Exo',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: '2vh',
        paddingBottom: '6vh',
        height: '35vh',
        boxShadow: '3px 3px 20px white'
      }}
    >
      <div style={{ paddingBottom: '1.5vh', fontSize: '3vh', fontWeight: 500 }}>LEVEL: </div>
      <div style={{ paddingBottom: '3vh', fontSize: '3vh' }}><strong>{currentLevel}</strong></div>
      <div style={{ paddingBottom: '1.5vh', fontSize: '3vh', fontWeight: 500 }}>LINES:</div>
      <div style={{ paddingBottom: '3vh', fontSize: '3vh' }}><strong>{linesCleared}</strong></div>
      <div style={{ paddingBottom: '1.5vh', fontSize: '3vh', fontWeight: 500 }}>SCORE:</div>
      <div style={{ paddingBottom: '3vh', fontSize: '3vh' }}><strong>{totalScore}</strong></div>      
    </div>
  )
}

export default ScoreDisplay