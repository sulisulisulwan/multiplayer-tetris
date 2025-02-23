import { EventData, AppState, TetriminoMovementHandler, OnePlayerLocalGameState } from "multiplayer-tetris-types";
import { Dispatch } from "redux";
import BaseAction from './BaseAction.js'

export default class ActionPauseGame extends BaseAction {

  constructor(tetriminoMovementHandler: TetriminoMovementHandler) {
    super(tetriminoMovementHandler)
  }

  execute(
    gameState: OnePlayerLocalGameState,
    dispatch: Dispatch,
    eventData: EventData, 
  ) {
        // if game phase is in fall or lock, calculate elapsed time in timeout or interval.  give the rest of the time back
  // otherwise, let the phase start at Animate
  }
}
