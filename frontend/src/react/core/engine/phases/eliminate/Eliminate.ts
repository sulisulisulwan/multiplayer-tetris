

import lineClearEliminator from "./eliminators/lineClear";
import { EliminatorFn, EliminatorsMap, PatternItem, SharedHandlersMap, SingleplayerLocalGameState } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";



export default class Eliminate extends BasePhase {
  
  private eliminators: EliminatorsMap

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)

    this.eliminators = {
      lineClear: lineClearEliminator.bind(this)
    }
  }

  public execute(gameState: AppState['gameState'], dispatch: Dispatch) {
    // console.log('>>>> ELIMINATE PHASE')
    const newPlayfield = this.runEliminators(gameState)
    dispatch(updateMultipleGameStateFields({
      currentGamePhase: 'iterate',
      playfield: newPlayfield
    }))
  }

  private runEliminators(gameState: AppState['gameState']) {

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