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
    // const toDiscard = this.trailQueue.queueToArray(this.softdropTrailMax)
    // this.trailQueue.clearQueue()

    return playfield
    // return this.removeTrailFromPlayfield(playfield, toDiscard)
  }

  removeTrailFromPlayfield(playfield: string[][], toDiscard: number[][][]) {
    toDiscard?.forEach((trailRow: number[][]) => {
      trailRow.forEach((coord) => {
        const [row, col] = coord
        playfield[row][col] = '[_]'
      })
    })
  }

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

  getTetrimonioCssClass(tetrimonio: tetriminoIF) {
    return `${tetrimonio.minoGraphic[1]}Tet`
  }

}

export default new Trail()