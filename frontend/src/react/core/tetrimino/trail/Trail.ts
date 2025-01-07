import { orientationsIF, tetriminoIF } from "../../../types"
import { QueueList } from "../../next-queue/QueueList"
import { makeCopy } from "../../utils/utils"



class Trail {

  protected currSoftdropTrailLength: number
  protected softdropTrailMax: number
  protected trailQueue: QueueList<number[][]>




  constructor() {
    this.currSoftdropTrailLength = 0
    this.softdropTrailMax = 5
    this.trailQueue = new QueueList()
    //First out is the tail end of the trail
  }

  public addToSoftdropTrail(tetrimino: tetriminoIF, playfield: string[][]) {

    const queueLength = this.trailQueue.getLength()
    let toDiscard: number[][] = null

    if (queueLength === this.softdropTrailMax) {
      toDiscard = this.trailQueue.dequeueFromList().getData()
    } 
    
    this.trailQueue.enqueueToList(this.getTetriminoTopBorderCoords(tetrimino))
    const playfieldCopy = makeCopy(playfield)
    return this.drawTrailOnPlayfieldColumn(playfieldCopy, toDiscard)
  }

  public clearSoftdropTrail(playfield: string[][]) {
    const toDiscard = this.trailQueue.queueToArray(this.softdropTrailMax)
    this.trailQueue.clearQueue()
    toDiscard?.forEach((trailRow: number[][]) => {
      trailRow.forEach((coord) => {
        const [row, col] = coord
        playfield[row][col] = '[_]'
      })
    })

    return playfield
  }

  // addToSoftdropTrail(tetrimino: tetriminoIF, playfield: string[][]) {
  //   const newTrailLength = this.currSoftdropTrailLength + 1
  //   if (newTrailLength < this.softdropTrailMax) {
  //     this.currSoftdropTrailLength = newTrailLength
  //   }

  //   const tetriminoTopBorderCoords = this.getTetriminoTopBorderCoords(tetrimino)


  //   const originCoords = tetrimino.currentOriginOnPlayfield
  //   this.drawTrailOnPlayfieldColumn(playfield, originCoords, tetriminoTopBorderCoords)
  // }

  protected getTetriminoTopBorderCoords(tetrimino: tetriminoIF): number[][] {
    const tetriminoCoords = tetrimino.orientations[tetrimino.currentOrientation as keyof orientationsIF]
    const originCoords = tetrimino.currentOriginOnPlayfield
    const [originRow, originColumn] = originCoords
    const tetriminoTopBorderPlayfieldCoords = tetriminoCoords.topBorderCoords.map((coords) => {
      return [originRow + coords[0], originColumn + coords[1]]
    })
    return tetriminoTopBorderPlayfieldCoords
  }

  protected drawTrailOnPlayfieldColumn(playfield: any[][], toDiscard: number[][]) {
    
    toDiscard?.forEach((discardCoord) => {
      const [discardRow, discardCol] = discardCoord
      playfield[discardRow][discardCol] = '[_]'
    })
    const allTrailCoords = this.trailQueue.queueToArray(this.softdropTrailMax)
    
    allTrailCoords.forEach((trailRowCoords, index) => {
      trailRowCoords.forEach((trailRowCoord) => {
        const [coordRow, coordCol] = trailRowCoord
        playfield[coordRow][coordCol] = `[-${index}]`
      })
    })

    return playfield
  }

  // drawTrailOnPlayfieldColumn(playfield: any[][], originCoords: number[], tetriminoTopBorderCoords: number[][]) {
  //   const [originRow, originColumn] = originCoords

  //   const tetriminoTopBorderPlayfieldCoords = tetriminoTopBorderCoords.map((coords) => {
  //     return [originRow + coords[0], originColumn + coords[1]]
  //   })

  //   for (let i = 0; i < tetriminoTopBorderPlayfieldCoords.length; i++) {
  //     const topBorderCoord = tetriminoTopBorderPlayfieldCoords[i]

  //     const [topBorderRow, topBorderColumn] = topBorderCoord

  //     if (this.currSoftdropTrailLength === 1) {
  //       playfield[topBorderRow][topBorderColumn] = '[-0]'
  //       playfield[topBorderRow - 1][topBorderColumn] = '[_]'
  //     }

  //     if (this.currSoftdropTrailLength === 2) {
  //       playfield[topBorderRow][topBorderColumn] = '[-1]'
  //       playfield[topBorderRow - 1][topBorderColumn] = '[-0]'
  //       playfield[topBorderRow - 2][topBorderColumn] = '[_]'
  //     }

  //     if (this.currSoftdropTrailLength === 3) {
  //       playfield[topBorderRow][topBorderColumn] = '[-2]'
  //       playfield[topBorderRow - 1][topBorderColumn] = '[-1]'
  //       playfield[topBorderRow - 2][topBorderColumn] = '[-0]'
  //       playfield[topBorderRow - 3][topBorderColumn] = '[_]'
  //     }

  //     if (this.currSoftdropTrailLength === 4) {
  //       playfield[topBorderRow][topBorderColumn] = '[-3]'
  //       playfield[topBorderRow - 1][topBorderColumn] = '[-2]'
  //       playfield[topBorderRow - 2][topBorderColumn] = '[-1]'
  //       playfield[topBorderRow - 3][topBorderColumn] = '[-0]'
  //       playfield[topBorderRow - 4][topBorderColumn] = '[_]'
  //     }

  //     if (this.currSoftdropTrailLength === 5) {
  //       playfield[topBorderRow][topBorderColumn] = '[-4]'
  //       playfield[topBorderRow - 1][topBorderColumn] = '[-3]'
  //       playfield[topBorderRow - 2][topBorderColumn] = '[-2]'
  //       playfield[topBorderRow - 3][topBorderColumn] = '[-1]'
  //       playfield[topBorderRow - 4][topBorderColumn] = '[-0]'
  //       playfield[topBorderRow - 5][topBorderColumn] = '[_]'
  //     }
  //   }
  // }


  // clearSoftdropTrail(tetrimino: tetriminoIF, playfield: string[][]) {
  //   const playfieldCopy = makeCopy(playfield)
    
  //   const originCoords = tetrimino.currentOriginOnPlayfield
  //   const tetriminoTopBorderCoords = this.getTetriminoTopBorderCoords(tetrimino)
  //   const [originRow, originColumn] = originCoords

  //   const tetriminoTopBorderPlayfieldCoords = tetriminoTopBorderCoords.map((coords) => {
  //     return [originRow + coords[0], originColumn + coords[1]]
  //   })

  //   tetriminoTopBorderPlayfieldCoords.forEach((topBorderCoord, i) => {
  //     const [topBorderRow, topBorderColumn] = topBorderCoord
  
  //     for (let j = 0; j < this.currSoftdropTrailLength; j++) {
  //       playfieldCopy[topBorderRow - j][topBorderColumn] = '[_]'
  //     }
  //   })

  //   this.currSoftdropTrailLength = 0
  //   return playfieldCopy
  // }

  getTetrimonioCssClass(tetrimonio: tetriminoIF) {
    return `${tetrimonio.minoGraphic[1]}Tet`
  }

}

export default new Trail()