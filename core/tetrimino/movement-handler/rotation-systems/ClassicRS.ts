import { Coordinates, FlipDirectionsMap, OrientationsMap, RelativeOrientationsMap, Tetrimino } from "multiplayer-tetris-types/frontend"
import { makeCopy } from "../../../utils/utils"
import { TetriminoMovementHandler } from "../TetriminoMovementHandler"
export class ClassicRotationSystem extends TetriminoMovementHandler{

  readonly relativeOrientations: RelativeOrientationsMap

  constructor() {
    super()
    this.relativeOrientations = {
      north: { flipCounterClockwise: 'west', flipClockwise: 'east' },
      south: { flipCounterClockwise: 'east', flipClockwise: 'west' },
      east:  { flipCounterClockwise: 'north', flipClockwise: 'south' },
      west:  { flipCounterClockwise: 'south', flipClockwise: 'north' },
    }
  }

  flipClockwise(playfield: string[][], tetrimino: Tetrimino) {
    return this.flip(tetrimino, 'flipClockwise', playfield)
  }
  
  flipCounterClockwise(playfield: string[][], tetrimino: Tetrimino) {
    return this.flip(tetrimino, 'flipCounterClockwise', playfield)
  }

  flip(tetrimino: Tetrimino, playerInput: string, playfield: string[][]) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)
    const oldCoordsOffOriginAndRotationPoints = tetrimino.orientations[currentOrientation as keyof OrientationsMap]
    const targetCoordsOffOriginAndRotationPoints = tetrimino.orientations[targetOrientation as keyof OrientationsMap]
    const targetCoordsOffOrigin = targetCoordsOffOriginAndRotationPoints.coordsOffOrigin

    const oldCoordsOnPlayfield = oldCoordsOffOriginAndRotationPoints.coordsOffOrigin.map((oldCoordsOffOrigin: Coordinates) => {
      return [tetrimino.currentOriginOnPlayfield[0] + oldCoordsOffOrigin[0], tetrimino.currentOriginOnPlayfield[1] + oldCoordsOffOrigin[1]] as Coordinates
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
    const relativeOrientation = this.relativeOrientations[currentOrientation as keyof RelativeOrientationsMap]
    const targetOrientation = relativeOrientation[flipDirection as keyof FlipDirectionsMap]
    return targetOrientation
  }

  getFlippedPlayfieldCoords(targetCoordsOffOrigin: Coordinates[], currentOriginOnPlayfield: Coordinates, offset: Coordinates): Coordinates[] {
    
    const [verticalOrigin, horizontalOrigin] = currentOriginOnPlayfield
    const [verticalOffset, horizontalOffset] = offset
    return targetCoordsOffOrigin.map((pointCoords: Coordinates) => [pointCoords[0] + verticalOrigin + verticalOffset, pointCoords[1] + horizontalOrigin + horizontalOffset])
  }

  calculateOffsetTowardsStartPoint(startPoint: Coordinates, endPoint: Coordinates): Coordinates {
    const [ startX, startY ] = startPoint
    const [ endX, endY ] = endPoint
    return [ startX - endX, startY - endY]
  }

}