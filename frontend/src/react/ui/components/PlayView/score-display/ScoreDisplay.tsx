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
        backgroundColor: 'black',
        paddingTop: 20,
        height: 200,
        opacity: .5
      }}
    >
      <div>LEVEL: </div>
      <div><strong>{currentLevel}</strong></div>
      <div>LINES:</div>
      <div><strong>{linesCleared}</strong></div>
      <div>SCORE:</div>
      <div><strong>{totalScore}</strong></div>      
    </div>
  )
}

export default ScoreDisplay