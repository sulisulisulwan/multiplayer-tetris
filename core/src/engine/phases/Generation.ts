import { Coordinates, OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from 'multiplayer-tetris-redux';
import { Dispatch } from 'redux';
import { NextQueue } from '../../next-queue/NextQueue.js'
import { makeCopy } from '../../utils/utils.js';
import BasePhase from "./BasePhase.js";

export default class Generation extends BasePhase {
  
  protected tetriminoMovementHandler: TetriminoMovementHandler
  protected nextQueueHandler: NextQueue

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, nextQueueHandler: NextQueue) {
    super()
    this.tetriminoMovementHandler = tetriminoMovementHandler
    this.nextQueueHandler = nextQueueHandler
  }

  execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    console.log('GENERATION PHASE')

    const newTetrimino = this.determineIfNewTetriminoSwappedIn(gameState)
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
    const nextQueueData = this.nextQueueHandler.queueToArray(gameState.gameOptions.nextQueueSize)
    const targetStartingCoords = this.tetriminoMovementHandler.getPlayfieldCoords(newTetrimino)
    const playfield = makeCopy(gameState.playfield as string[][])
    const newGameState: any = {}
    
    if (this.gameIsOver(targetStartingCoords, playfield)) {
      newGameState.currentGamePhase = 'gameOver'
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }
    
    // Place dequeued tetrimino in playfield
    let newPlayfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(targetStartingCoords, playfield, newTetrimino.minoGraphic)

    if (gameState.gameOptions.ghostTetriminoOn) {
      const ghostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
      newGameState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(ghostCoords, playfield, '[g]')
      newGameState.ghostCoords = ghostCoords
    } else {
      newGameState.playfield = newPlayfield
    }

    // Update swap status in case hold queue has been used
    let swapStatus = gameState.holdQueue.swapStatus
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }

    // Update state
    newGameState.nextQueue = nextQueueData
    newGameState.currentTetrimino = newTetrimino,
    newGameState.currentGamePhase = 'falling',
    newGameState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
    newGameState.holdQueue = { ...gameState.holdQueue }
    newGameState.holdQueue.swapStatus = swapStatus
    newGameState.extendedLockdownMovesRemaining = 15
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  gameIsOver(startingOrientationCoords: Coordinates[], playfield: string[][]) {
    // Block out - newly-generated tetrimino blocked due to existing block in matrix
    const gridCoordsAreClear = this.tetriminoMovementHandler.gridCoordsAreClear(startingOrientationCoords, playfield)
    const gameIsOver = gridCoordsAreClear ? false : true
    return gameIsOver
  }

  determineIfNewTetriminoSwappedIn(gameState: OnePlayerLocalGameState) {
    let newTetrimino 

    // if the game just started OR player held for the first time
    if (gameState.currentTetrimino === null) {
      // Dequeue a new tetrimino and instantiate it.
      newTetrimino = this.nextQueueHandler.dequeue()
    } else if (gameState.holdQueue.swapStatus === 'justSwapped') {
      newTetrimino = gameState.currentTetrimino
    }
    return newTetrimino
  }
}