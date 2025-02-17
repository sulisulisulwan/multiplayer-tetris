import { levelColors } from '../levelColors'

import * as React from 'react'

import TetriminoTile from '../TetriminoTile'
import { tetriminoGraphics } from '../tetriminoGraphics'
import { HoldQueueState, TetriminoGraphicsMap } from '../../../../../../../types/frontend'

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

  if (holdQueue === null) {
    return <div className="holdqueue-wrapper" style={{
      padding: '10px',
      height: '10 0%',
      width: '120px',
      textAlign: 'center' as 'center',
      color: 'white',
      fontSize: '30px',
      fontFamily: 'Exo',
      backgroundColor: 'black',
      opacity: .5
    }}><div className="text-hold">Hold</div></div>
  }  

  return (
    <div className="holdqueue-wrapper" style={{
      padding: '10px',
      height: '10 0%',
      width: '120px',
      textAlign: 'center' as 'center',
      color: 'white',
      fontSize: '30px',
      fontFamily: 'Exo',
      backgroundColor: 'black',
      opacity: .5
    }}>
      <div className="text-hold">HOLD</div>
      {<TetriminoTile graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'hold'}/>}
    </div>
  )

}

export default HoldQueueDisplay