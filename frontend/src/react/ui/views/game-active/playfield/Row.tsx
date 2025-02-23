import * as React from 'react'
import Square from './Square'

interface RowProps {
  rowData: string[]
}

const Row = (props: RowProps) =>  {
  const { rowData } = props
  return <div className="playfield-row" style={{
    display: 'flex',
    flexDirection: 'row',
  }}>{ rowData.map((squareData, i) => <Square key={`square-${i}`} squareData={squareData}/>) }</div>
}

export default Row;