import { SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { EventData } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { SharedScope } from "../../SharedScope";
import { Dispatch } from "redux";

export default class ActionPauseGame extends SharedScope {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }

  execute(
    gameState: AppState['gameState'],
    dispatch: Dispatch,
    eventData: EventData, 
  ) {
        // if game phase is in fall or lock, calculate elapsed time in timeout or interval.  give the rest of the time back
  // otherwise, let the phase start at Animate
  }
}
