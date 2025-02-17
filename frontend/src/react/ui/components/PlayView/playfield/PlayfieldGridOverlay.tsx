import * as React from 'react'
import Row from './Row'
import { levelColors } from '../levelColors'


interface PlayfieldGridProps { 
  playfieldData: string[][]
  currentLevel: number
  currentGamePhase: string
}

const PlayfieldGridOverlay = (props: PlayfieldGridProps) => {

  const { playfieldData, currentLevel, currentGamePhase } = props

  return (
    <div className="playfield-container" style={{
      position: 'absolute',
      fontFamily: 'monospace',
      boxShadow: '3px 3px 20px white'
    }}>
      { 
        playfieldData.map((rowData, i) => 
          <div key={`row-${i}`} style={{ display: 'flex' }}>
            {/* <span style={{ width: 20 }}>{i + 20}</span> */}
            <RowOverlay key={`row-${i}`} rowData={rowData}/>
          </div>
        ) 
      }
    </div>
  )
}

const RowOverlay = (props: any) =>  {
  const { rowData } = props
  return <div className="playfield-row" style={{
    display: 'flex',
    flexDirection: 'row',
  }}>{ rowData.map((squareData: any, i: number) => <SquareOverlay key={`square-${i}`} squareData={squareData}/>) }</div>
}

const squareClasses = new Map([
  ['[i]','iTet tetrimonio-square tetrimino-shimmer'],
  ['[t]','tTet tetrimonio-square tetrimino-shimmer'],
  ['[j]','jTet tetrimonio-square tetrimino-shimmer'],
  ['[o]','oTet tetrimonio-square tetrimino-shimmer'],
  ['[s]','sTet tetrimonio-square tetrimino-shimmer'],
  ['[l]','lTet tetrimonio-square tetrimino-shimmer'],
  ['[z]','zTet tetrimonio-square tetrimino-shimmer'],
  ['[_]','emptyTet'],
  ['[g]','ghostTet'],
  ['[-0]','trail-0'],
  ['[-1]','trail-1'],
  ['[-2]','trail-2'],
  ['[-3]','trail-3'],
  ['[-4]','trail-4'],
  ['[-5]','trail-5'],
])

const SquareOverlay = (props: any) => {
  const { squareData } = props 
  const computedClass = squareClasses.get(squareData)
  return (
    <div className="playfield-overlay-square">
      <div className={computedClass}/>
    </div>
  )

}

export default PlayfieldGridOverlay