import { LocalGameState, PlayerAction, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { Action, EventData } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import ScoreItemFactory from "../../scoring/ScoreItemFactory";
import { SharedScope } from "../../SharedScope";
import { TetriminoMovementHandler } from "../../tetrimino/movement-handler/TetriminoMovementHandler";
import { makeCopy } from "../../utils/utils";
import BaseAction from './BaseAction'
import { soundEffects } from "../../../App";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";

export default class ActionFlip extends BaseAction {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  execute(gameState: AppState['gameState'], dispatch: Dispatch<any>, eventData: EventData) {

  
    const { strokeType, action } = eventData
  
    if (strokeType === 'keydown' && gameState.playerAction[action as keyof PlayerAction]) {
      return
    }
  
    const newGameState: LocalGameState = makeCopy(gameState)
    let { playfield, currentTetrimino } = newGameState
  
    if (strokeType === 'keyup') {
      (newGameState.playerAction as any)[action] = false
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
    }
    
    // Remove the ghost tetrimino if that mode is on
    if (gameState.gameOptions.ghostTetriminoOn) {
      playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield)
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
      newTetriminoBaseRowIdx <= gameState.lowestLockSurfaceRow && 
      gameState.postLockMode &&
      gameState.extendedLockdownMovesRemaining > 0
    ) {
      clearTimeout(gameState.lockTimeoutId)
      newGameState.lockTimeoutId = null
      newGameState.extendedLockdownMovesRemaining = gameState.extendedLockdownMovesRemaining - 1
    }
  
    soundEffects.play('tetriminoMove')
  
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
    
  }
}
