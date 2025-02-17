import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";

export default class Iterate extends BasePhase {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }
  
  execute(_: AppState['gameState'], dispatch: Dispatch) {
    // console.log('>>>> ITERATE PHASE')
    const newGameState = {} as LocalGameState

    const todoCondition: undefined = undefined
    newGameState.currentGamePhase = todoCondition ? 'pattern' : 'completion'/**TODO: This will be replaced with a condition where the game mode requires pattern scans after eliminations */ 
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

}

/**
 * In this phase, the engine is given a chance to scan through all cells in 
 * the Matrix and evaluate or manipulate them according to an editor-defined 
 * iteration script. this phase consumes no apparent game time. note: this
 * phase is included in the engine to allow for more complicated variants in 
 * the future, and has thus far not been used.
 */