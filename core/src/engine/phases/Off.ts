import { BasePhase, OnePlayerLocalGameState } from "multiplayer-tetris-types";
import { Dispatch } from "redux";

export default class Off extends BasePhase {

  constructor() {
    super()
  }


  execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    // console.log('>>>> OFF PHASE')
    

  }

}

/**
 * In this phase, the engine looks for patterns made from Locked down Blocks in the Matrix. 
 * once a pattern has been matched, it can trigger any number of tetris variant-related effects.
 * the classic pattern is the Line Clear pattern. this pattern is matched when one or more rows 
 * of 10 horizontally aligned Matrix cells are occupied by Blocks. the matching Blocks are then 
 * marked for removal on a hit list. Blocks on the hit list are cleared from the Matrix at a later  
 * time in the eliminate Phase.
 */