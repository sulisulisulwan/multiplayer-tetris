import { OnePlayerLocalGameState, Tetrimino, TetriminoMovementHandler } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import { makeCopy } from "../../../utils/utils.js";
import TetriminoActivePhase from "../TetriminoActivePhase.js";
import TimerManager from "../../../timerManager/TimerManager.js";

type SetTimeoutId = ReturnType<typeof setTimeout>

export default abstract class Lock extends TetriminoActivePhase {
  
  protected currGameState: any
  
  constructor(tetriminoMovementHandler: TetriminoMovementHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler, timerManager)
    this.currGameState = null
  }

  public abstract execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch): void

  lockDownTimeout(dispatch: Dispatch) {
    const gameState = this.currGameState
    // Lockdown timer has run out, so we clear the timer..
    this.timerManager.clear('lockTimeout')

    const tetriminoCopy = makeCopy(gameState.currentTetrimino as Tetrimino)
    const playfieldCopy = makeCopy(gameState.playfield as string[][])
    
    const newGameState = {} as OnePlayerLocalGameState
    newGameState.currentTetrimino = tetriminoCopy
    newGameState.playfield = gameState.playfield

    // Final check if tetrimino should be granted falling status before permanent lock
    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    if (targetCoordsClear) {
      // Grant falling status if there is no surface below.
      newGameState.currentGamePhase = 'falling'
      
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
      
    }

    (newGameState.currentTetrimino as Tetrimino).status = 'locked'
    
    if (this.gameIsOver(tetriminoCopy)) {
      this.timerManager.clear('lockTimeout')

      newGameState.currentGamePhase = 'gameOver'
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
      
    }

    newGameState.currentGamePhase = 'pattern',
    newGameState.postLockMode = false
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  tetriminoCanFall(gameState: OnePlayerLocalGameState) {
    const tetriminoCopy = makeCopy(gameState.currentTetrimino as Tetrimino)
    const playfieldCopy = makeCopy(gameState.playfield as string[][])

    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    return this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)
  }

  regressToFallingPhase(gameState: OnePlayerLocalGameState, dispatch: Dispatch, newGameState: OnePlayerLocalGameState): void {
    this.timerManager.clear('lockTimeout')
    newGameState.currentGamePhase = 'falling'
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  gameIsOver(currentTetrimino: Tetrimino): boolean {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
  }

}