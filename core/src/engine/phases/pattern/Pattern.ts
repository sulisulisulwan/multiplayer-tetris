import { GenericObject, OnePlayerLocalGameState, PatternItem, PatternScanners, PossibleActivePatternsMap } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import lineClear from './scanners/lineClear.js'
import BasePhase from "../BasePhase.js";

export default class Pattern extends BasePhase {

  private patternsToMatch: string[]
  private patternScanners: PatternScanners
  constructor(
    possibleActivePatterns: PossibleActivePatternsMap
  ) {
    super()
    this.patternsToMatch = this.loadPatternsToMatch(possibleActivePatterns)
    this.patternScanners = {
      lineClear: lineClear.bind(this)
    }
  }

  execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    const foundPatterns = this.runPatternScanners(gameState) 
    const newGameState = this.deriveNewStatePropsFromPatterns(foundPatterns) as OnePlayerLocalGameState
    newGameState.patternItems = foundPatterns
    newGameState.currentGamePhase = newGameState.patternItems.length ? 'updateScore' : 'completion' // If there are no patterns to process through elimination, animation, and iteration, skip to completion.
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  private deriveNewStatePropsFromPatterns(foundPatterns: PatternItem[]) {
    const newGameState: GenericObject = {}
    foundPatterns.forEach(patternItem => {
      const { stateUpdate } = patternItem
      if (stateUpdate) {
        stateUpdate.forEach(update => {
          const { field, value } = update
          newGameState[field as keyof GenericObject] = value
        })
      }
    })
    return newGameState
  }

  private runPatternScanners(gameState: OnePlayerLocalGameState) {
    const patternsToMatch = this.patternsToMatch
    const foundPatterns: PatternItem[] = []

    patternsToMatch.forEach(pattern => {
      const scanner = this.patternScanners[pattern as keyof PatternScanners]
      const foundPattern = scanner(gameState)
      if (foundPattern) { 
        foundPatterns.push(foundPattern)
      }
    })

    return foundPatterns
  }

  private loadPatternsToMatch(possibleActivePatterns: PossibleActivePatternsMap): string[] {
    const patternsToLoad: string[] = []

    for (const pattern in possibleActivePatterns) {
      const currPatternActive = possibleActivePatterns[pattern as keyof PossibleActivePatternsMap]
      if (currPatternActive) {
        patternsToLoad.push(pattern)
      }
    }

    return patternsToLoad
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