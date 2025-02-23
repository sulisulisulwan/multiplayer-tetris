import { PlayerAction, EventData, TetriminoMovementHandler, OnePlayerLocalGameState } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import ScoreItemFactory from "../../scoring/ScoreItemFactory.js";
import { makeCopy } from "../../utils/utils.js";
import BaseAction from './BaseAction.js'
import TimerManager from "../../timerManager/TimerManager.js";

export default class ActionFlip extends BaseAction {

  private scoreItemFactory: ScoreItemFactory
  private timerManager: TimerManager

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler)
    this.scoreItemFactory = new ScoreItemFactory()
    this.timerManager = timerManager
  }

  execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch<any>, eventData: EventData) {

  
    const { strokeType, action } = eventData
  
    if (strokeType === 'keydown' && gameState.playerAction[action as keyof PlayerAction]) {
      return
    }
  
    const newGameState: OnePlayerLocalGameState = makeCopy(gameState)
    let { playfield, currentTetrimino } = newGameState
  
    if (strokeType === 'keyup') {
      (newGameState.playerAction as any)[action] = false
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }
    
    // Remove the ghost tetrimino if that mode is on
    if (gameState.gameOptions.ghostTetriminoOn) {
      playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield as string[][])
    }
  
    const { 
      newPlayfield, 
      newTetrimino,
      performedTSpin,
      performedTSpinMini 
    } = (this.tetriminoMovementHandler as any)[action as keyof TetriminoMovementHandler](playfield, currentTetrimino)
  
    if (performedTSpin) {
      const scoreItem = this.scoreItemFactory.getItem('tSpinNoLineClear', gameState)
      newGameState.scoreItems.push(scoreItem)
    }
  
    if (performedTSpinMini) {
      const scoreItem = this.scoreItemFactory.getItem('tSpinNoLineClear', gameState)
      newGameState.scoreItems.push(scoreItem)
    }
  
  
    newGameState.performedTSpinMini = performedTSpinMini
    newGameState.performedTSpin = performedTSpin;
    (newGameState.playerAction as any)[action] = true
    newGameState.currentTetrimino = newTetrimino
  
    if (gameState.gameOptions.ghostTetriminoOn) {
      const newGhostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
      newGameState.ghostCoords = newGhostCoords
      newGameState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(newGhostCoords, newPlayfield, '[g]')
    } else {
      newGameState.playfield = newPlayfield
    }
  
    //TODO: This should account for movements that occur only after lockdown, not before.  This current logic will mistake pre lockdown scenarios as post lockdown
    // Think, at every point in time, the newTetriminoBaseRowIdx will === appState.lowestLockSurfaceRow
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
    if (
      newTetriminoBaseRowIdx <= (gameState.lowestLockSurfaceRow as number) && 
      gameState.postLockMode &&
      gameState.extendedLockdownMovesRemaining > 0
    ) {
      this.timerManager.clear('lockTimeout')
      newGameState.extendedLockdownMovesRemaining = gameState.extendedLockdownMovesRemaining - 1
    }
  
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    
  }
}
