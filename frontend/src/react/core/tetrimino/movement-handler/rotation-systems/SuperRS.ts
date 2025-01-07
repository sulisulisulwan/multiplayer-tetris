import { makeCopy } from "../../../utils/utils"
import { coordinates, orientationsIF, rotationPointsIF, tetriminoIF } from "../../../../types"
import { ClassicRotationSystem } from "./ClassicRS"
import { TSpinCalculator } from "./TSpinCalculator"
export class SuperRotationSystem extends ClassicRotationSystem {

  constructor() {
    super()
  }

  flip(tetrimino: tetriminoIF, playerInput: string, playfield: string[][]) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)

    const targetCoordsOffOrigin = tetrimino.orientations[targetOrientation as keyof orientationsIF].coordsOffOrigin

    const oldRotationPoints = tetrimino.orientations[currentOrientation as keyof orientationsIF].rotationPoints
    const targetRotationPoints = tetrimino.orientations[targetOrientation as keyof orientationsIF].rotationPoints

    const oldCoordsOnPlayfield = this.getPlayfieldCoords(tetrimino)

    
    let playfieldCopy = makeCopy(playfield)
    let flipPoint = 1
    
    while (flipPoint <= 5) {
      const startPoint: coordinates = oldRotationPoints[flipPoint.toString() as keyof rotationPointsIF]
      const endPoint: coordinates = targetRotationPoints[flipPoint.toString() as keyof rotationPointsIF]
      const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
      const targetCoordsOnPlayfield = this.getFlippedPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
       
      const playfieldNoTetrimino = this.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)

      if (!this.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)) {
        playfieldCopy = this.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldCopy, tetrimino.minoGraphic)
        flipPoint += 1
        continue
      }

      // Determine if a t spin or mini t spin was performed
      let performedTSpin = null
      let performedTSpinMini = null
      if (tetrimino.name === 'TTetrimino') {
        const tSpinTypes = TSpinCalculator.getTSpinType(targetOrientation, targetCoordsOnPlayfield, playfieldNoTetrimino)
        performedTSpin = tSpinTypes.performedTSpin
        performedTSpinMini = tSpinTypes.performedTSpinMini
      }

      return {
        newPlayfield: this.addTetriminoToPlayfield(targetCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
        newTetrimino: this.updateTetrimino(tetrimino, playerInput, offset, targetOrientation) ,
        successfulMove: true,
        performedTSpin,
        performedTSpinMini
      }
    }

    return {
      newPlayfield: playfieldCopy, 
      newTetrimino: tetrimino,
      successfulMove: false,
      performedTSpin: false,
      performedTSpinMini: false
    }
  }



}