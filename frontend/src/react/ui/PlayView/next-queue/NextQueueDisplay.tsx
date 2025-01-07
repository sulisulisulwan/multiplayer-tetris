import * as React from "react";
import TetriminoTile from '../TetriminoTile'
import { levelColors } from '../levelColors'
import { tetriminoGraphics } from "../tetriminoGraphics"; 
import { tetriminoGraphicsIF } from "../../../types";

interface nextQueueDisplayPropsIF {
  nextQueueData: string[]
  currentLevel: number
}


const NextQueueDisplay = ({ nextQueueData, currentLevel }: nextQueueDisplayPropsIF) => {

  const styles: React.CSSProperties = {
    padding: '10px',
    height: '100%',
    width: '120px',
    textAlign: 'center',
  }
  
  if (nextQueueData === null) {
    return <div className="nextqueue-wrapper" style={styles}><div className="text-next">NEXT</div></div>
  }  

  

  return(
    <div className="nextqueue-wrapper" style={styles}>
      <div className="text-next">NEXT</div>
      {nextQueueData.map((tetriminoName, i)=> {
        const graphicGrid = tetriminoGraphics[`${tetriminoName}Graphic` as keyof tetriminoGraphicsIF]
        return <TetriminoTile key={`${tetriminoName}-${i}`} graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'next'}/>
        
      })}
    </div>
  )

}

export default NextQueueDisplay