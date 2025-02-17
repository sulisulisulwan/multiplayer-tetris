import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";
import { Dispatch } from "redux";

export default class Animate extends BasePhase {
  
  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }

  execute(_: AppState['gameState'], dispatch: Dispatch) {
    // console.log('>>>> ANIMATE PHASE')

    // iterate through all this.appState.patternItems and handle animation execution depending on patternItem.type 

    const newGameState = {} as LocalGameState
    newGameState.currentGamePhase = 'eliminate'
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }
}

/**
 * Here, any animation scripts are executed within the Matrix. the tetris engine 
 * moves on to the eliminate Phase once all animation scripts have been run.
 */