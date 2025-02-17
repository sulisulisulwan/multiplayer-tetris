import * as React from 'react'

const squareColors = new Map([
  ['[i]','rgb(141, 141, 141)'],
  ['[t]','#ff00ff'],
  ['[j]','plum'],
  ['[o]','rgb(119, 3, 101)'],
  ['[s]','powderblue'],
  ['[l]','cyan'],
  ['[z]','white'],
  ['[_]','']
])

interface TetriminoTileProps {
  tetriminoName: string
  graphicGrid: string[][]
  classType: string
}

const TetriminoTile = (props: TetriminoTileProps) => {

  const { tetriminoName, graphicGrid, classType } = props


  if (!tetriminoName) {
    return (
      <div className={`tetrimino-tile`}>
        <div className={`tetrimino-tile-row`}>
          <div className={`tetrimino-tile-square`} style={{
            backgroundColor: 'black',
            borderStyle: 'solid',
            // borderColor: 'black',
            fontSize: '10px',
            margin: 'auto auto',
          }}>Empty</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${classType}-tetrimino-tile`} style={{
      // backgroundColor: squareColors.get(tetriminoName),
      color: squareColors.get(tetriminoName),
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '60%',
      maxHeight: '80px',
      justifyContent: 'center',
    }}>
      {graphicGrid.map((row, i) => {
        return (
          <div className={`tetrimino-tile-row`} key={`${classType}-${tetriminoName}-${i}-row`}>{row.map((square, j) => {
            return (
              <div 
                className={`tetrimino-tile-square`} 
                key={`${classType}-${tetriminoName}-${i}-${j}-square`} 
                style={{ 
                  opacity: .8, 
                  height: 25,
                  width: 25
                }}
              >
                <div
                  style={{
                    backgroundColor: squareColors.get(square),
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderColor: 'black',
                    borderStyle: square ==='[_]' ? '' : 'solid',
                    borderRadius: square === '[_]' ? '' : '20%',
                    fontSize: '10px',
                    height: 20,
                    width: 20,
                  }}
                ></div>
              </div>
            )
      })}</div>
        )
    })}</div>
  )
}

export default TetriminoTile