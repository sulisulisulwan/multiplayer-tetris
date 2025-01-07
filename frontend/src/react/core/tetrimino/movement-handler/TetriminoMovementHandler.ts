import { makeCopy } from '../../utils/utils'
import { tetriminoIF, coordinates, orientationsIF, directionsIF } from '../../../types'

export class TetriminoMovementHandler {

  private findCoordsAtTrajectory: directionsIF

  constructor() {
    this.findCoordsAtTrajectory = {
      right: this.right,
      left: this.left,
      down: this.down,
      inPlace: this.inPlace
    }
  }

  /**
   * Passing in null for direction will return the current coords of the Tetrimino on the playfield
   */
  public getPlayfieldCoords(tetrimino: tetriminoIF, direction?: string) {
    const offLocalOriginCoords = tetrimino.orientations[tetrimino.currentOrientation as keyof orientationsIF].coordsOffOrigin
    const offPlayfieldOriginCoords = tetrimino.currentOriginOnPlayfield
    const offsetDirection = direction || 'inPlace'
    
    return offLocalOriginCoords.map((localCoord: coordinates) => this.findCoordsAtTrajectory[offsetDirection as keyof directionsIF](localCoord, offPlayfieldOriginCoords))
  }

  public gridCoordsAreClear(targetCoordsOnPlayfield: coordinates[], playfieldNoTetrimino: string[][]) {
    return targetCoordsOnPlayfield.every(coord => {
      return (
        playfieldNoTetrimino[coord[0]] 
        && playfieldNoTetrimino[coord[0]][coord[1]] // This square exists in the playable space
        && ['[_]', '[g]'].includes(playfieldNoTetrimino[coord[0]][coord[1]]) // This square is not yet occupied
      )
    }) 
  }

  public moveOne(targetDirection: string, playfield: string[][], tetrimino: tetriminoIF) {
    const oldCoordsOnPlayfield = this.getPlayfieldCoords(tetrimino)
    const targetCoordsOnPlayfield = this.getPlayfieldCoords(tetrimino, targetDirection)
    
    const playfieldCopy = makeCopy(playfield)
    const playfieldNoTetrimino = this.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    if (targetCoordsClear) {
      return {
        newPlayfield: this.addTetriminoToPlayfield(targetCoordsOnPlayfield, playfieldCopy, tetrimino.minoGraphic),
        newTetrimino: this.updateTetrimino(makeCopy(tetrimino), targetDirection),
        successfulMove: true
      }
    }
    
    return {
      newPlayfield: this.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
      newTetrimino: tetrimino,
      successfulMove: false
    }

  }

  public getLowestPlayfieldRowOfTetrimino(tetrimino: tetriminoIF) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const { lowestRowOffOrigin } = tetrimino.orientations[currentOrientation as keyof orientationsIF]
    return currentOriginOnPlayfield[0] + lowestRowOffOrigin
  }

  public updateTetrimino(tetrimino: tetriminoIF, direction: string, offset?: coordinates, targetOrientation?: string, playfield?: string[][]) {
    const [oldVertical, oldHorizontal] = tetrimino.currentOriginOnPlayfield
    const newTetrimino = makeCopy(tetrimino)
    if (direction === 'left') {
      newTetrimino.currentOriginOnPlayfield = [oldVertical, oldHorizontal - 1]
    } else if (direction === 'right') {
      newTetrimino.currentOriginOnPlayfield = [oldVertical, oldHorizontal + 1]
    } else if (direction === 'down') {
      const newOne = [oldVertical + 1, oldHorizontal]
      newTetrimino.currentOriginOnPlayfield = newOne 
    } else if (direction === 'flipClockwise' || direction === 'flipCounterClockwise') {
      newTetrimino.currentOriginOnPlayfield = [oldVertical + offset[0], oldHorizontal + offset[1]]
      newTetrimino.currentOrientation = targetOrientation
    }

    return newTetrimino
  }

  // TODO: MUTATES PLAYFIELD
  public removeTetriminoFromPlayfield(tetriminoCoords: coordinates[], playfield: string[][]) {
    tetriminoCoords.forEach((coord: coordinates) => {
      playfield[coord[0]][coord[1]] = '[_]'
    })
    return playfield
  }
  
  // TODO: MUTATES PLAYFIELD
  public addTetriminoToPlayfield(tetriminoCoords: coordinates[], playfield: string[][], minoGraphic: string) {
    tetriminoCoords.forEach(coord => {
      if (['[_]', '[g]'].includes(playfield[coord[0]][coord[1]])) {
        playfield[coord[0]][coord[1]] = minoGraphic
      }
    })
    return playfield
  }

  public getProjectedLandedTetrimino(playfield: string[][], tetrimino: tetriminoIF) {

    let keepDropping = true

    let playfieldCopy = makeCopy(playfield)
    let tetriminoCopy = makeCopy(tetrimino)

    while(keepDropping) {

      const { 
        newPlayfield,
        newTetrimino,
        successfulMove
      } = this.moveOne('down', playfieldCopy, tetriminoCopy)
      
      if (!successfulMove) {
        break
      }
      
      playfieldCopy = newPlayfield
      tetriminoCopy = newTetrimino
    }

    const projectedTetrimino = tetriminoCopy
    
    return tetriminoCopy
  }

  public getPlayfieldWithGhostTetrimino(playfield: string[][], tetrimino: tetriminoIF): string[][] {
    const projectedVals = this.getProjectedLandedTetrimino(playfield, tetrimino)
    const ghostTetrimino = projectedVals.newTetrimino
    const ghostTetriminoCoords = this.getPlayfieldCoords(ghostTetrimino)
    const playfieldWithGhostTetrimino = this.addTetriminoToPlayfield(ghostTetriminoCoords, playfield, '[g]')
    return playfieldWithGhostTetrimino
  }

  public moveTetriminoOnPlayfield(oldCoords: coordinates[], targetCoords: coordinates[], playfield: string[][], minoGraphic: string) {
    const playfieldWithoutTetrimino = this.removeTetriminoFromPlayfield(oldCoords, playfield)
    const playfieldWithNewTetrimino = this.addTetriminoToPlayfield(targetCoords, playfieldWithoutTetrimino, minoGraphic)
    return playfieldWithNewTetrimino
  }

  public getGhostCoords(tetrimino: tetriminoIF, playfield: string[][]) {
    const ghostTetrimino = this.getProjectedLandedTetrimino(playfield, tetrimino)
    const ghostCoords = this.getPlayfieldCoords(ghostTetrimino)
    return ghostCoords
  }

  private right(localOrigin: coordinates, playfieldOrigin: coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0], 
      localOrigin[1] + playfieldOrigin[1] + 1
    ]
    return targetCoordOnPlayfield
  }

  private left(localOrigin: coordinates, playfieldOrigin: coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0], 
      localOrigin[1] + playfieldOrigin[1] - 1
    ]
    return targetCoordOnPlayfield
  }
  
  private down(localOrigin: coordinates, playfieldOrigin: coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0] + 1, 
      localOrigin[1] + playfieldOrigin[1]
    ]
    return targetCoordOnPlayfield
  }

  private inPlace(localOrigin: coordinates, playfieldOrigin: coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0],
      localOrigin[1] + playfieldOrigin[1]
    ]
    return targetCoordOnPlayfield
  }


}