import { OnePlayerLocalGameState, BasePhase } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";

export default class Iterate extends BasePhase {

  constructor() {
    super()
  }
  
  execute(_: OnePlayerLocalGameState, dispatch: Dispatch) {
    // console.log('>>>> ITERATE PHASE')
    const newGameState = {} as OnePlayerLocalGameState

    const todoCondition: undefined = undefined
    newGameState.currentGamePhase = todoCondition ? 'pattern' : 'completion'/**TODO: This will be replaced with a condition where the game mode requires pattern scans after eliminations */ 
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

}

/**
 * In this phase, the engine is given a chance to scan through all cells in 
 * the Matrix and evaluate or manipulate them according to an editor-defined 
 * iteration script. this phase consumes no apparent game time. note: this
 * phase is included in the engine to allow for more complicated variants in 
 * the future, and has thus far not been used.
 */