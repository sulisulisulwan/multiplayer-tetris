import { 
  appStateIF, 
  sharedHandlersIF, 
  eliminatorsIF, 
  eliminator, 
  patternItemIF,
} from "../../../../types";

import lineClearEliminator from "./eliminators/lineClear";
import BasePhase from "../BasePhase";



export default class Eliminate extends BasePhase {
  
  private eliminators: eliminatorsIF

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)

    this.eliminators = {
      lineClear: lineClearEliminator.bind(this)
    }
  }

  public execute() {
    // console.log('>>>> ELIMINATE PHASE')
    const newState = {} as appStateIF
    const newPlayfield = this.runEliminators()
    
    newState.currentGamePhase = 'iterate',
    newState.playfield = newPlayfield

    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  private runEliminators() {

    const patternsFound = this.appState.patternItems as patternItemIF[]
    let newPlayfield = this.appState.playfield

    patternsFound.forEach(pattern => {
      if (pattern.action === 'eliminate') {
        const { type, data } = pattern
        const eliminator: eliminator = this.eliminators[type as keyof eliminatorsIF]
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