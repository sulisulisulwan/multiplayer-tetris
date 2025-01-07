import * as React from 'react'

const squareColors = new Map([
  ['[i]','rgb(141, 141, 141)'],
  ['[t]','#ff00ff'],
  ['[j]','plum'],
  ['[o]','rgb(119, 3, 101)'],
  ['[s]','powderblue'],
  ['[l]','cyan'],
  ['[z]','white'],
  ['[_]','black']
])

interface tetriminoTilePropsIF {
  tetriminoName: string
  graphicGrid: string[][]
  classType: string
}

const TetriminoTile = (props: tetriminoTilePropsIF) => {

  const { tetriminoName, graphicGrid, classType } = props

  if (!tetriminoName) {
    const style = {
      backgroundColor: squareColors.get(tetriminoName),
      color: squareColors.get(tetriminoName),
      borderStyle: 'solid',
      borderColor: 'black',
      fontSize: '10px',
      margin: 'auto auto',
      justifyContent: 'center',
    }
    return (
      <div className={`tetrimino-tile`}>
        <div className={`tetrimino-tile-row`}>
          <div className={`tetrimino-tile-square`} style={style}>Empty</div>
        </div>
      </div>
    )
  }

  const tileStyle = {
    backgroundColor: squareColors.get(tetriminoName),
    color: squareColors.get(tetriminoName),
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '60%',
    maxHeight: '80px',
    justifyContent: 'center',
  }

  return (
    <div className={`${classType}-tetrimino-tile`} style={tileStyle}>
      {graphicGrid.map((row, i) => {
        return (
          <div className={`tetrimino-tile-row`} key={`${classType}-${tetriminoName}-${i}-row`}>{row.map((square, j) => {
            const emptySquareStyle = {
              backgroundColor: squareColors.get(square),
              color: squareColors.get(square),
              borderStyle: 'solid',
              fontSize: '10px',
              height: 16,
              opacity: .4
            }

            const minoStyle = {
              backgroundColor: squareColors.get(square),
              color: squareColors.get(square),
              borderStyle: 'solid',
              borderColor: 'black',
              fontSize: '10px',
              borderRadius: '20%',
              height: 16,
              overflow: 'hidden',
            }
            return (
              <div 
                className={`tetrimino-tile-square`} 
                key={`${classType}-${tetriminoName}-${i}-${j}-square`} 
                style={square ==='[_]' ? emptySquareStyle : minoStyle}
              >
                {square}
              </div>
            )
      })}</div>
        )
    })}</div>
  )
}

export default TetriminoTile