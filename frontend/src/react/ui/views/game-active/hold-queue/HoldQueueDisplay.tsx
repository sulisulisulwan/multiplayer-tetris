import { levelColors } from '../levelColors'

import * as React from 'react'

import TetriminoTile from '../TetriminoTile'
import { tetriminoGraphics } from '../tetriminoGraphics'
import { HoldQueueState, TetriminoGraphicsMap } from 'multiplayer-tetris-types'

interface HoldQueueDisplayProps {
  holdQueue: HoldQueueState
  currentLevel: number
}

const HoldQueueDisplay = (props: HoldQueueDisplayProps) => {

  const { holdQueue, currentLevel } = props

  if (!holdQueue) {
    return null
  }

  let tetriminoName

  if (holdQueue.heldTetrimino) {
    tetriminoName = holdQueue.heldTetrimino.name
  }

  tetriminoName = tetriminoName || 'empty'

  const graphicGrid = tetriminoGraphics[`${tetriminoName}Graphic` as keyof TetriminoGraphicsMap]

  const fontSize = '3vw'
  const fontWeight = 500
  const padding = '3vw'
  const height = '20%'
  const width = '8vw'
  const color = 'white'
  const marginBottom = '5vh'
  const boxShadow = '3px 3px 20px white'

  if (holdQueue === null) {
    return <div className="holdqueue-wrapper" style={{
      padding,
      height,
      width,
      fontWeight,
      marginBottom,
      textAlign: 'center' as 'center',
      color,
      fontSize,
      fontFamily: 'Exo',
      backgroundColor: 'rgba(0,0,0,0.5)',
      boxShadow
    }}><div className="text-hold">Hold</div></div>
  }  

  return (
    <div className="holdqueue-wrapper" style={{
      padding,
      height,
      width,
      fontWeight,
      marginBottom,
      textAlign: 'center' as 'center',
      color,
      fontSize,
      fontFamily: 'Exo',
      backgroundColor: 'rgba(0,0,0,0.5)',
      boxShadow
    }}>
      <div className="text-hold">HOLD</div>
      {<TetriminoTile graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'hold'}/>}
    </div>
  )

}

export default HoldQueueDisplay