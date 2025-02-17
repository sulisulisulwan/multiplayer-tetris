import * as React from "react";
import TetriminoTile from '../TetriminoTile'
import { levelColors } from '../levelColors'
import { tetriminoGraphics } from "../tetriminoGraphics"; 
import { TetriminoGraphicsMap } from "../../../../../../../types/frontend";

interface NextQueueDisplayProps {
  nextQueueData: string[]
  currentLevel: number
}


const NextQueueDisplay = ({ nextQueueData, currentLevel }: NextQueueDisplayProps) => {


  if (nextQueueData === null) {
    return <div className="nextqueue-wrapper" style={{
      color: 'white',
      marginLeft: 40,
      padding: '10px',
      height: '100%',
      width: '120px',
      textAlign: 'center',
      backgroundColor: 'black',
      opacity: .5,
      fontSize: '30px',
      fontFamily: 'Exo',
      marginBottom: 20,
      alignContent: 'center',
    }}><div className="text-next">NEXT</div></div>
  }  

  

  return(
    <div className="nextqueue-wrapper" style={{
      marginLeft: 40,
      padding: '10px',
      height: '100%',
      width: '120px',
      textAlign: 'center',
      backgroundColor: 'black',
      opacity: .5,
      fontSize: '30px',
      fontFamily: 'Exo',
      color: 'white',
      marginBottom: 20,
      alignContent: 'center'
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