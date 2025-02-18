import { GenericObject, LocalGameState, PatternItem, PatternScanners, PossibleActivePatternsMap, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import lineClear from './scanners/lineClear'
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";

export default class Pattern extends BasePhase {

  private patternsToMatch: string[]
  private patternScanners: PatternScanners
  constructor(
    sharedHandlers: SharedHandlersMap, 
    possibleActivePatterns: PossibleActivePatternsMap
  ) {
    super(sharedHandlers)
    this.patternsToMatch = this.loadPatternsToMatch(possibleActivePatterns)
    this.patternScanners = {
      lineClear: lineClear.bind(this)
    }
  }

  execute(gameState: AppState['gameState'], dispatch: Dispatch) {
    const foundPatterns = this.runPatternScanners(gameState) 
    const newGameState = this.deriveNewStatePropsFromPatterns(foundPatterns) as LocalGameState
    newGameState.patternItems = foundPatterns
    newGameState.currentGamePhase = newGameState.patternItems.length ? 'updateScore' : 'completion' // If there are no patterns to process through elimination, animation, and iteration, skip to completion.
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
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

  private runPatternScanners(gameState: AppState['gameState']) {
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
    const patternsToLoad = []

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