import { OnePlayerLocalGameState } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";

import { Dispatch } from "redux";
import BasePhase from "./BasePhase.js";

export default class Animate extends BasePhase {
  
  constructor() {
    super()
  }

  execute(_: OnePlayerLocalGameState, dispatch: Dispatch) {
    // console.log('>>>> ANIMATE PHASE')

    // iterate through all this.appState.patternItems and handle animation execution depending on patternItem.type 

    const newGameState = {} as OnePlayerLocalGameState
    newGameState.currentGamePhase = 'eliminate'
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }
}

/**
 * Here, any animation scripts are executed within the Matrix. the tetris engine 
 * moves on to the eliminate Phase once all animation scripts have been run.
 */