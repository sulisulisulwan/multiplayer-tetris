

import { AppState, BasePhase, EliminatorFn, EliminatorsMap, OnePlayerLocalGameState, PatternItem } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import lineClearEliminator from "./eliminators/lineClear.js";



export default class Eliminate extends BasePhase {
  
  private eliminators: EliminatorsMap

  constructor() {
    super()

    this.eliminators = {
      lineClear: lineClearEliminator.bind(this)
    }
  }

  public execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    // console.log('>>>> ELIMINATE PHASE')
    const newPlayfield = this.runEliminators(gameState)
    dispatch(updateMultipleGameStateFieldsSingleplayer({
      currentGamePhase: 'iterate',
      playfield: newPlayfield
    }))
  }

  private runEliminators(gameState: OnePlayerLocalGameState) {

    const patternsFound = gameState.patternItems as PatternItem[]
    let newPlayfield = gameState.playfield

    patternsFound.forEach(pattern => {
      if (pattern.action === 'eliminate') {
        const { type, data } = pattern
        const eliminator: EliminatorFn = this.eliminators[type as keyof EliminatorsMap]
        newPlayfield = eliminator(newPlayfield, data)
      }
    })

    return newPlayfield
  }

}

/**
 * Any Minos marked for removal, i.e., on the hit list, are cleared from the 
 * Matrix in this phase. If this results in one or more complete 10-cell rows
 * in the Matrix becoming unoccupied by Minos, then all Minos above that row(s) 
 * collapse, or fall by the number of complete rows cleared from the Matrix. 
 * Points are awarded to the player according to the tetris Scoring System, as
 * seen in the scoring section.  game statistics  such as the number of Singles, 
 * doubles, triples, tetrises, and t-Spins can also be tracked in the eliminate 
 * Phase. Ideally, some sort of High Score table should record the player’s name, 
 * the highest level reached, his total score, and other statistics that can be 
 * tracked in this phase.
 */