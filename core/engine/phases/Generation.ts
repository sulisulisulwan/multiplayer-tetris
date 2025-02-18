import { NextQueue } from '../../next-queue/NextQueue'
import { Coordinates, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from 'multiplayer-tetris-types/frontend/core';
import { AppState } from 'multiplayer-tetris-types/frontend/shared';
import { Dispatch } from 'redux';
import { updateMultipleGameStateFields } from '../../../redux/reducers/gameState';
import { makeCopy } from '../../utils/utils';

export default class Generation extends BasePhase {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }

  execute(gameState: AppState['gameState'], dispatch: Dispatch) {
    console.log('GENERATION PHASE')

    const newTetrimino = this.determineIfNewTetriminoSwappedIn(gameState)
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
    const nextQueueData = this.nextQueueHandler.queueToArray(gameState.gameOptions.nextQueueSize)
    const targetStartingCoords = this.tetriminoMovementHandler.getPlayfieldCoords(newTetrimino)
    const playfield = makeCopy(gameState.playfield)
    const newGameState: any = {}
    
    if (this.gameIsOver(targetStartingCoords, playfield)) {
      newGameState.currentGamePhase = 'gameOver'
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
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
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  gameIsOver(startingOrientationCoords: Coordinates[], playfield: string[][]) {
    // Block out - newly-generated tetrimino blocked due to existing block in matrix
    const gridCoordsAreClear = this.tetriminoMovementHandler.gridCoordsAreClear(startingOrientationCoords, playfield)
    const gameIsOver = gridCoordsAreClear ? false : true
    return gameIsOver
  }

  determineIfNewTetriminoSwappedIn(gameState: AppState['gameState']) {
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