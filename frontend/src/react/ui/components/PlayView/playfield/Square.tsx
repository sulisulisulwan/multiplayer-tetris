import * as React from 'react'

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

interface SquareProps {
  squareData: string
}

const Square = (props: SquareProps) => {
  const { squareData } = props

  const computedClass = squareClasses.get(squareData)
  if (computedClass.includes('trail')) {
    // console.log(squareData)
  }
  return (
    <div className="playfield-square">
      <div className={computedClass}/>
    </div>
  )

}

export default Square