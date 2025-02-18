
import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import trail from "../../../tetrimino/trail/Trail";
import TetriminoActivePhase from "../TetriminoActivePhase";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";

export default abstract class FallingPhase extends TetriminoActivePhase {

  protected currGameState: AppState['gameState']

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.currGameState = null
  }

  /**
   * Will re-trigger when:
   * - Player makes any kind of move 
   * - Continuous fall event set, triggered, or unset
   * -  
   */

  public execute(gameState: AppState['gameState'], dispatch: Dispatch): void {
    this.currGameState = gameState
    let newGameState = {} as LocalGameState

    // If entering Falling phase, set intervallic fall event
    if (gameState.fallIntervalId === null) {
      if (!gameState.playerAction.softdrop) {
        newGameState.playfieldOverlay = trail.clearSoftdropTrail(gameState.playfieldOverlay)
      }
      (newGameState.fallIntervalId as any) = this.setContinuousFallEvent(gameState, dispatch) 
    }

    // Handle autorepeat player actions
    newGameState = this.handleAutorepeatActions(gameState, dispatch, newGameState)

    // If state hasn't changed, don't set state.

    if (Object.keys(newGameState).length === 0) return
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  setContinuousFallEvent(gameState: AppState['gameState'], dispatch: Dispatch): NodeJS.Timer {
    return setInterval(this.continuousFallEvent.bind(this), gameState.fallSpeed, dispatch)
  }

  protected abstract continuousFallEvent(dispatch: Dispatch): void
}

