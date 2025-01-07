import { 
  coordinates, 
  flipDirections, 
  orientationsIF, 
  relativeOrientations, 
  tetriminoIF 
} from "../../../../types"
import { makeCopy } from "../../../utils/utils"
import { TetriminoMovementHandler } from "../TetriminoMovementHandler"
export class ClassicRotationSystem extends TetriminoMovementHandler{

  readonly relativeOrientations: relativeOrientations

  constructor() {
    super()
    this.relativeOrientations = {
      north: { flipCounterClockwise: 'west', flipClockwise: 'east' },
      south: { flipCounterClockwise: 'east', flipClockwise: 'west' },
      east:  { flipCounterClockwise: 'north', flipClockwise: 'south' },
      west:  { flipCounterClockwise: 'south', flipClockwise: 'north' },
    }
  }

  flipClockwise(playfield: string[][], tetrimino: tetriminoIF) {
    return this.flip(tetrimino, 'flipClockwise', playfield)
  }
  
  flipCounterClockwise(playfield: string[][], tetrimino: tetriminoIF) {
    return this.flip(tetrimino, 'flipCounterClockwise', playfield)
  }

  flip(tetrimino: tetriminoIF, playerInput: string, playfield: string[][]) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)
    const oldCoordsOffOriginAndRotationPoints = tetrimino.orientations[currentOrientation as keyof orientationsIF]
    const targetCoordsOffOriginAndRotationPoints = tetrimino.orientations[targetOrientation as keyof orientationsIF]
    const targetCoordsOffOrigin = targetCoordsOffOriginAndRotationPoints.coordsOffOrigin

    const oldCoordsOnPlayfield = oldCoordsOffOriginAndRotationPoints.coordsOffOrigin.map((oldCoordsOffOrigin: coordinates) => {
      return [tetrimino.currentOriginOnPlayfield[0] + oldCoordsOffOrigin[0], tetrimino.currentOriginOnPlayfield[1] + oldCoordsOffOrigin[1]] as coordinates
    })
    
    let playfieldCopy = makeCopy(playfield)

    const flipPoint = 1
    const startPoint = oldCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
    const endPoint = targetCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
    const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
    const targetCoordsOnPlayfield = this.getFlippedPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
      
    const playfieldNoTetrimino = this.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)

    if (!this.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)) {
      playfieldCopy = this.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldCopy, tetrimino.minoGraphic)
      return {
        newPlayfield: playfieldCopy, 
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }

    return {
      newPlayfield: this.addTetriminoToPlayfield(targetCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
      newTetrimino: this.updateTetrimino(tetrimino, playerInput, offset, targetOrientation) ,
      successfulMove: true
    }
  
  }

  getTargetOrientation(currentOrientation: string, flipDirection: string) {
    const relativeOrientation = this.relativeOrientations[currentOrientation as keyof relativeOrientations]
    const targetOrientation = relativeOrientation[flipDirection as keyof flipDirections]
    return targetOrientation
  }

  getFlippedPlayfieldCoords(targetCoordsOffOrigin: coordinates[], currentOriginOnPlayfield: coordinates, offset: coordinates): coordinates[] {
    
    const [verticalOrigin, horizontalOrigin] = currentOriginOnPlayfield
    const [verticalOffset, horizontalOffset] = offset
    return targetCoordsOffOrigin.map((pointCoords: coordinates) => [pointCoords[0] + verticalOrigin + verticalOffset, pointCoords[1] + horizontalOrigin + horizontalOffset])
  }

  calculateOffsetTowardsStartPoint(startPoint: coordinates, endPoint: coordinates): coordinates {
    const [ startX, startY ] = startPoint
    const [ endX, endY ] = endPoint
    return [ startX - endX, startY - endY]
  }

}