import { appStateIF, sharedHandlersIF } from "../../../types";
import BasePhase from "./BasePhase";

export default class Iterate extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  execute() {
    // console.log('>>>> ITERATE PHASE')
    const newState = {} as appStateIF

    const todoCondition: undefined = undefined
    newState.currentGamePhase = todoCondition ? 'pattern' : 'completion'/**TODO: This will be replaced with a condition where the game mode requires pattern scans after eliminations */ 

    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

}

/**
 * In this phase, the engine is given a chance to scan through all cells in 
 * the Matrix and evaluate or manipulate them according to an editor-defined 
 * iteration script. this phase consumes no apparent game time. note: this
 * phase is included in the engine to allow for more complicated variants in 
 * the future, and has thus far not been used.
 */