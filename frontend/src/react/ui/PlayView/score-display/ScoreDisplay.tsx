import * as React from 'react'
import { levelColors } from '../levelColors'

interface scoreDisplayPropsIF { 
  currentLevel: number
  linesCleared: number
  totalScore: number
}

const ScoreDisplay = (props: scoreDisplayPropsIF) => {

  const { currentLevel, linesCleared, totalScore } = props

  return (
    <div className="score-display">
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