import BasePhase from "./BasePhase";
import { NextQueue } from '../../next-queue/NextQueue'
import { sharedHandlersIF, coordinates } from "../../../types";

export default class Generation extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>> GENERATION PHASE')

    const newTetrimino = this.determineIfNewTetriminoSwappedIn()
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)

    const nextQueueData = this.nextQueueHandler.queueToArray(this.appState.gameOptions.nextQueueSize)
    
    const targetStartingCoords = this.tetriminoMovementHandler.getPlayfieldCoords(newTetrimino)

    const playfield = this.appState.playfield
    const newState = this.appState

    if (this.gameIsOver(targetStartingCoords, playfield)) {
      newState.currentGamePhase = 'gameOver'
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }
    
    // Place dequeued tetrimino in playfield
    let newPlayfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(targetStartingCoords, playfield, newTetrimino.minoGraphic)

    if (this.appState.gameOptions.ghostTetriminoOn) {
      const ghostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
      newState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(ghostCoords, playfield, '[g]')
      newState.ghostCoords = ghostCoords
    } else {
      newState.playfield = newPlayfield
    }

    // Update swap status in case hold queue has been used
    let { swapStatus } = this.appState.holdQueue
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }

    // Update state
    newState.nextQueue = nextQueueData
    
    newState.currentTetrimino = newTetrimino,
    newState.currentGamePhase = 'falling',
    newState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
    newState.holdQueue.swapStatus = swapStatus
    newState.extendedLockdownMovesRemaining = 15
    
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  gameIsOver(startingOrientationCoords: coordinates[], playfield: string[][]) {
    // Block out - newly-generated tetrimino blocked due to existing block in matrix
    const gridCoordsAreClear = this.tetriminoMovementHandler.gridCoordsAreClear(startingOrientationCoords, playfield)
    const gameIsOver = gridCoordsAreClear ? false : true
    return gameIsOver
  }

  determineIfNewTetriminoSwappedIn() {
    let newTetrimino 

    // if the game just started OR player held for the first time
    if (this.appState.currentTetrimino === null) {
      // Dequeue a new tetrimino and instantiate it.
      newTetrimino = this.nextQueueHandler.dequeue()
    } else if (this.appState.holdQueue.swapStatus === 'justSwapped') {
      newTetrimino = this.appState.currentTetrimino
    }
    return newTetrimino
  }
}