import { makeCopy } from '../../utils/utils'
import { Coordinates, DirectionsMap, OrientationsMap, Tetrimino, TetriminoMovementHandler as TetriminoMovementHandlerAbstract } from 'multiplayer-tetris-types/frontend/core'

export class TetriminoMovementHandler implements TetriminoMovementHandlerAbstract{

  private findCoordsAtTrajectory: DirectionsMap

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
  public getPlayfieldCoords(tetrimino: Tetrimino, direction?: string) {
    const offLocalOriginCoords = tetrimino.orientations[tetrimino.currentOrientation as keyof OrientationsMap].coordsOffOrigin
    const offPlayfieldOriginCoords = tetrimino.currentOriginOnPlayfield
    const offsetDirection = direction || 'inPlace'
    
    return offLocalOriginCoords.map((localCoord: Coordinates) => this.findCoordsAtTrajectory[offsetDirection as keyof DirectionsMap](localCoord, offPlayfieldOriginCoords))
  }

  public gridCoordsAreClear(targetCoordsOnPlayfield: Coordinates[], playfieldNoTetrimino: string[][]) {
    return targetCoordsOnPlayfield.every(coord => {
      return (
        playfieldNoTetrimino[coord[0]] 
        && playfieldNoTetrimino[coord[0]][coord[1]] // This square exists in the playable space
        && ['[_]', '[g]'].includes(playfieldNoTetrimino[coord[0]][coord[1]]) // This square is not yet occupied
      )
    }) 
  }

  public moveOne(targetDirection: string, playfield: string[][], tetrimino: Tetrimino): {
    newPlayfield: string[][]
    newTetrimino: Tetrimino
    successfulMove: boolean
  } {



    const oldCoordsOnPlayfield = this.getPlayfieldCoords(tetrimino)
    const targetCoordsOnPlayfield = this.getPlayfieldCoords(tetrimino, targetDirection)
    const playfieldCopy = makeCopy(playfield)
    const playfieldNoTetrimino = this.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    if (targetCoordsClear) {
      return {
        newPlayfield: this.addTetriminoToPlayfield(targetCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
        newTetrimino: this.updateTetrimino(tetrimino, targetDirection),
        successfulMove: true
      }
    }
    
    return {
      newPlayfield: this.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
      newTetrimino: tetrimino,
      successfulMove: false
    }

  }

  public getLowestPlayfieldRowOfTetrimino(tetrimino: Tetrimino) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const { lowestRowOffOrigin } = tetrimino.orientations[currentOrientation as keyof OrientationsMap]
    return currentOriginOnPlayfield[0] + lowestRowOffOrigin
  }

  public updateTetrimino(tetrimino: Tetrimino, direction: string, offset?: Coordinates, targetOrientation?: string, playfield?: string[][]) {
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
  public removeTetriminoFromPlayfield(tetriminoCoords: Coordinates[], playfield: string[][]) {
    tetriminoCoords.forEach((coord: Coordinates) => {
      playfield[coord[0]][coord[1]] = '[_]'
    })
    return playfield
  }
  
  // TODO: MUTATES PLAYFIELD
  public addTetriminoToPlayfield(tetriminoCoords: Coordinates[], playfield: string[][], minoGraphic: string) {
    tetriminoCoords.forEach(coord => {
      if (['[_]', '[g]'].includes(playfield[coord[0]][coord[1]])) {
        playfield[coord[0]][coord[1]] = minoGraphic
      }
    })
    return playfield
  }

  public getProjectedLandedTetrimino(playfield: string[][], tetrimino: Tetrimino) {

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
    return projectedTetrimino
  }

  public getPlayfieldWithGhostTetrimino(playfield: string[][], tetrimino: Tetrimino): string[][] {
    const projectedVals = this.getProjectedLandedTetrimino(playfield, tetrimino)
    const ghostTetrimino = projectedVals.newTetrimino
    const ghostTetriminoCoords = this.getPlayfieldCoords(ghostTetrimino)
    const playfieldWithGhostTetrimino = this.addTetriminoToPlayfield(ghostTetriminoCoords, playfield, '[g]')
    return playfieldWithGhostTetrimino
  }

  public moveTetriminoOnPlayfield(oldCoords: Coordinates[], targetCoords: Coordinates[], playfield: string[][], minoGraphic: string) {
    const playfieldWithoutTetrimino = this.removeTetriminoFromPlayfield(oldCoords, playfield)
    const playfieldWithNewTetrimino = this.addTetriminoToPlayfield(targetCoords, playfieldWithoutTetrimino, minoGraphic)
    return playfieldWithNewTetrimino
  }

  public getGhostCoords(tetrimino: Tetrimino, playfield: string[][]) {
    const ghostTetrimino = this.getProjectedLandedTetrimino(playfield, tetrimino)
    const ghostCoords = this.getPlayfieldCoords(ghostTetrimino)
    return ghostCoords
  }

  private right(localOrigin: Coordinates, playfieldOrigin: Coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0], 
      localOrigin[1] + playfieldOrigin[1] + 1
    ]
    return targetCoordOnPlayfield
  }

  private left(localOrigin: Coordinates, playfieldOrigin: Coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0], 
      localOrigin[1] + playfieldOrigin[1] - 1
    ]
    return targetCoordOnPlayfield
  }
  
  private down(localOrigin: Coordinates, playfieldOrigin: Coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0] + 1, 
      localOrigin[1] + playfieldOrigin[1]
    ]
    return targetCoordOnPlayfield
  }

  private inPlace(localOrigin: Coordinates, playfieldOrigin: Coordinates) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0],
      localOrigin[1] + playfieldOrigin[1]
    ]
    return targetCoordOnPlayfield
  }


}