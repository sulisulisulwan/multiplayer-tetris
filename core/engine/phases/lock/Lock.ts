import { AppState, LocalGameState, SharedHandlersMap, Tetrimino } from "multiplayer-tetris-types/frontend";
import { makeCopy } from "../../../utils/utils";
import TetriminoActivePhase from "../TetriminoActivePhase";
import { soundEffects } from "../../../../App";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";

export default abstract class Lock extends TetriminoActivePhase {
  
  protected currGameState: AppState['gameState']

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.currGameState = null
  }

  public abstract execute(gameState: AppState['gameState'], dispatch: Dispatch): void

  lockDownTimeout(dispatch: Dispatch) {
    const gameState = this.currGameState
    // Lockdown timer has run out, so we clear the timer..
    clearTimeout(gameState.lockTimeoutId)

    const tetriminoCopy = makeCopy(gameState.currentTetrimino)
    const playfieldCopy = makeCopy(gameState.playfield)
    
    const newGameState = {} as LocalGameState
    newGameState.currentTetrimino = tetriminoCopy
    newGameState.lockTimeoutId = null
    newGameState.playfield = gameState.playfield

    // Final check if tetrimino should be granted falling status before permanent lock
    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    if (targetCoordsClear) {
      // Grant falling status if there is no surface below.
      newGameState.currentGamePhase = 'falling'
      
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
      
    }

    newGameState.currentTetrimino.status = 'locked'
    soundEffects.play('tetriminoLand')
    
    if (this.gameIsOver(tetriminoCopy)) {
      clearTimeout(gameState.lockTimeoutId)
      newGameState.lockTimeoutId = null
      newGameState.currentGamePhase = 'gameOver'
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
      
    }

    newGameState.currentGamePhase = 'pattern',
    newGameState.postLockMode = false
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  tetriminoCanFall(gameState: AppState['gameState']) {
    const tetriminoCopy = makeCopy(gameState.currentTetrimino)
    const playfieldCopy = makeCopy(gameState.playfield)

    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    return this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)
  }

  regressToFallingPhase(gameState: AppState['gameState'], dispatch: Dispatch, newGameState: LocalGameState): void {
    clearTimeout(gameState.lockTimeoutId)
    newGameState.currentGamePhase = 'falling'
    newGameState.lockTimeoutId = null
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  gameIsOver(currentTetrimino: Tetrimino): boolean {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
  }

}