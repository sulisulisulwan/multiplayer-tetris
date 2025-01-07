import { levelColors } from '../levelColors'

import * as React from 'react'

import TetriminoTile from '../TetriminoTile'
import { tetriminoGraphics } from '../tetriminoGraphics'
import { holdQueueIF, levelColorsIF, tetriminoGraphicsIF } from '../../../types'

interface holdQueueDisplayProps {
  holdQueue: holdQueueIF
  currentLevel: number
}

const HoldQueueDisplay = (props: holdQueueDisplayProps) => {

  const { holdQueue, currentLevel } = props

  if (!holdQueue) {
    return null
  }

  let tetriminoName

  if (holdQueue.heldTetrimino) {
    tetriminoName = holdQueue.heldTetrimino.name
  }

  tetriminoName = tetriminoName || 'empty'

  const graphicGrid = tetriminoGraphics[`${tetriminoName}Graphic` as keyof tetriminoGraphicsIF]
  const styles = {
    padding: '10px',
    height: '10 0%',
    width: '120px',
    textAlign: 'center' as 'center',
    color: 'white',
    fontSize: '30px',
    fontFamily: 'Exo'
  }

  if (holdQueue === null) {
    return <div className="holdqueue-wrapper" style={styles}><div className="text-hold">Hold</div></div>
  }  

  return (
    <div className="holdqueue-wrapper" style={styles}>
      <div className="text-hold">HOLD</div>
      {<TetriminoTile graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'hold'}/>}
    </div>
  )

}

export default HoldQueueDisplay