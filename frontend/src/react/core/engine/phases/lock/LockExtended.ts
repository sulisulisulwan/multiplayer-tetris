import { AppState, LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import trail from "../../../tetrimino/trail/Trail";
import Lock from "./Lock";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";

export default class LockExtended extends Lock {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }

  public execute(gameState: AppState['gameState'], dispatch: Dispatch) {
    this.currGameState = gameState
    let newGameState = {} as LocalGameState
    if (trail.trailExists(gameState.playfieldOverlay)) {
      newGameState.playfieldOverlay = trail.clearSoftdropTrail(gameState.playfieldOverlay)
    }

    // First check that extended moves have been used up, and call for lockdown immediately if it's the case
    if (gameState.extendedLockdownMovesRemaining <= 0) return this.lockDownTimeout(dispatch)

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), set the lockdown timer
    if (!gameState.lockTimeoutId) {
      newGameState.postLockMode = true
      newGameState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500, dispatch)
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
    }

    // Lockdown timer had already been set
    // Check if player has positioned the tetrimino so it can fall
    if (this.tetriminoCanFall(gameState)) return this.regressToFallingPhase(gameState, dispatch, newGameState)

    // Otherwise, the lockdown timer is still ticking... Handle autorepeat player motions..
    newGameState = this.handleAutorepeatActions(gameState, dispatch, newGameState)
    Object.keys(newGameState).length === 0 ? null : dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

}


      