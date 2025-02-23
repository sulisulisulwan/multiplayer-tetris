
import { AppState, BaseScoringHandler, OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import trail from "../../../tetrimino/trail/Trail.js";
import TetriminoActivePhase from "../TetriminoActivePhase.js";
import TimerManager from "../../../timerManager/TimerManager.js";

export default abstract class FallingPhase extends TetriminoActivePhase {

  protected currGameState: OnePlayerLocalGameState
  protected fallIntervalId: ReturnType<typeof setInterval>
  protected scoringHandler: BaseScoringHandler

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler, timerManager)
    this.scoringHandler = scoringHandler
    this.currGameState = null
    this.fallIntervalId = null
  }

  /**
   * Will re-trigger when:
   * - Player makes any kind of move 
   * - Continuous fall event set, triggered, or unset
   * -  
   */

  public execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch): void {
    this.currGameState = gameState
    let newGameState = {} as OnePlayerLocalGameState

    // If entering Falling phase, set intervallic fall event
    if (!this.timerManager.isSet('fallInterval')) {
      if (!gameState.playerAction.softdrop) {
        newGameState.playfieldOverlay = trail.clearSoftdropTrail(gameState.playfieldOverlay)
      }
      const fallIntervalId = this.setContinuousFallEvent(gameState, dispatch) 
      this.timerManager.setTimer('fallInterval', fallIntervalId)
    }

    // Handle autorepeat player actions //TODO: does this really need to happen here???
    // newGameState = this.handleAutorepeatActions(gameState, dispatch, newGameState)

    // If state hasn't changed, don't set state.

    if (Object.keys(newGameState).length === 0) return
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  setContinuousFallEvent(gameState: OnePlayerLocalGameState, dispatch: Dispatch): number {
    return setInterval(this.continuousFallEvent.bind(this), gameState.fallSpeed, dispatch)
  }

  protected abstract continuousFallEvent(dispatch: Dispatch): void
}

