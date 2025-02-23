import * as React from "react";
import TetriminoTile from '../TetriminoTile'
import { levelColors } from '../levelColors'
import { tetriminoGraphics } from "../tetriminoGraphics"; 
import { TetriminoGraphicsMap } from "multiplayer-tetris-types";

interface NextQueueDisplayProps {
  nextQueueData: string[]
  currentLevel: number
}


const NextQueueDisplay = ({ nextQueueData, currentLevel }: NextQueueDisplayProps) => {

  const fontSize = '3vw'
  const fontWeight = 500
  const padding = '3vw'
  const height = '81vh'
  const width = '8vw'
  const backgroundColor = 'rgba(0,0,0,.5)'
  const color = 'white'
  const marginBottom = '5vh'

  if (nextQueueData === null) {
    return <div className="nextqueue-wrapper" style={{
      color: 'white',
      marginLeft: 40,
      padding,
      height,
      width,
      textAlign: 'center',
      backgroundColor,
      fontSize,
      fontWeight,
      fontFamily: 'Exo',
      alignContent: 'center',
      boxShadow: '3px 3px 20px white'
    }}><div className="text-next">NEXT</div></div>
  }  

  

  return(
    <div className="nextqueue-wrapper" style={{
      marginLeft: 40,
      padding,
      height,
      width,
      textAlign: 'center',
      backgroundColor,
      fontSize,
      fontWeight,
      fontFamily: 'Exo',
      color: 'white',
      alignContent: 'center',
      boxShadow: '3px 3px 20px white'
    }}>
      <div className="text-next">NEXT</div>
      {nextQueueData.map((tetriminoName, i)=> {
        const graphicGrid = tetriminoGraphics[`${tetriminoName}Graphic` as keyof TetriminoGraphicsMap]
        return <TetriminoTile key={`${tetriminoName}-${i}`} graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'next'}/>
        
      })}
    </div>
  )

}

export default NextQueueDisplay