import * as React from 'react'
import Row from './Row'
import { levelColors } from '../levelColors'


interface playfieldGridPropsIF { 
  playfieldData: string[][]
  currentLevel: number
  currentGamePhase: string
}

const PlayfieldGrid = (props: playfieldGridPropsIF) => {

  const { playfieldData, currentLevel, currentGamePhase } = props

  const style = {
    fontFamily: 'monospace',
  }
  
  if (currentGamePhase === 'gameOver') {
    return (
      <div className="playfield-container" style={style}>
        { playfieldData.map((rowData, i) => <Row key={`row-${i}`} rowData={rowData}/>) }
        <div style={{
          position: 'absolute' as 'absolute',
          bottom: '250px',
          left: '25%',
        }}>
          <div style={{
            color: 'white',
            fontFamily: 'Exo',
            fontSize: '60px',
            fontWeight: 'bold',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
          }}>
            <p>GAME</p><p>OVER</p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="playfield-container" style={{
      position: 'relative',
      fontFamily: 'monospace',
      boxShadow: '3px 3px 20px white'
    }}>
      { 
        playfieldData.map((rowData, i) => 
          <div key={`row-${i}`} style={{ display: 'flex' }}>
            <span style={{ width: 20 }}>{i + 20}</span>
            <Row key={`row-${i}`} rowData={rowData}/>
          </div>
        ) 
      }
    </div>
  )
}

export default PlayfieldGrid