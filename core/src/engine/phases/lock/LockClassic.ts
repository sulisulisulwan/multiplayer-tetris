import { OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import trail from "../../../tetrimino/trail/Trail.js";
import Lock from "./Lock.js";
import TimerManager from "../../../timerManager/TimerManager.js";

export default class LockClassic extends Lock {

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler, timerManager)
  }

  public execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    this.currGameState = gameState
    let newGameState = {} as OnePlayerLocalGameState

    if (trail.trailExists(gameState.playfield as string[][])) {
      newGameState.playfieldOverlay = trail.clearSoftdropTrail(gameState.playfieldOverlay as string[][])
    }
    

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), set the lockdown timer
    if (!this.timerManager.isSet('lockTimeout')) {
      const timeoutId = setTimeout(this.lockDownTimeout.bind(this), 500, dispatch)
      this.timerManager.setTimer('lockTimeout', timeoutId)
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }

    // Lockdown timer had already been set, so check if player has positioned the tetrimino to escape lock phase
    // If tetrimino can fall, cancel the lockdown timer and enter Fall phase
    if (this.tetriminoCanFall(gameState)) return this.regressToFallingPhase(gameState, dispatch, newGameState)
    
    // Otherwise, the lockdown timer is still ticking... Handle autorepeat player motions..
    // newGameState = this.handleAutorepeatActions(gameState, dispatch, newGameState)
    Object.keys(newGameState).length === 0 ? null : dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

}


      