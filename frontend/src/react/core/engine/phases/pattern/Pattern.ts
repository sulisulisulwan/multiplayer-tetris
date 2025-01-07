import { actionItemIF, appStateIF, genericObjectIF, patternScannersIF, patternItemIF, possibleActivePatternsIF, scoreItemIF, sharedHandlersIF } from "../../../../types";
import BasePhase from "../BasePhase";
import lineClear from './scanners/lineClear'

export default class Pattern extends BasePhase {

  private patternsToMatch: string[]
  private patternScanners: patternScannersIF
  constructor(
    sharedHandlers: sharedHandlersIF, 
    possibleActivePatterns: possibleActivePatternsIF
  ) {
    super(sharedHandlers)
    this.patternsToMatch = this.loadPatternsToMatch(possibleActivePatterns)
    this.patternScanners = {
      lineClear: lineClear.bind(this)
    }
  }

  execute() {
    // console.log('>>>> PATTERN PHASE')
    const foundPatterns = this.runPatternScanners() 
    const newState = this.deriveNewStatePropsFromPatterns(foundPatterns) as appStateIF
    newState.patternItems = foundPatterns
    newState.currentGamePhase = newState.patternItems.length ? 'updateScore' : 'completion' // If there are no patterns to process through elimination, animation, and iteration, skip to completion.
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  private deriveNewStatePropsFromPatterns(foundPatterns: patternItemIF[]) {
    const newState: genericObjectIF = {}
    foundPatterns.forEach(patternItem => {
      const { stateUpdate } = patternItem
      if (stateUpdate) {
        stateUpdate.forEach(update => {
          const { field, value } = update
          newState[field as keyof genericObjectIF] = value
        })
      }
    })
    return newState
  }

  private runPatternScanners() {
    const patternsToMatch = this.patternsToMatch
    const foundPatterns: patternItemIF[] = []

    patternsToMatch.forEach(pattern => {
      const scanner = this.patternScanners[pattern as keyof patternScannersIF]
      const foundPattern = scanner()
      if (foundPattern) { 
        foundPatterns.push(foundPattern)
      }
    })

    return foundPatterns
  }

  private loadPatternsToMatch(possibleActivePatterns: possibleActivePatternsIF): string[] {
    const patternsToLoad = []

    for (const pattern in possibleActivePatterns) {
      const currPatternActive = possibleActivePatterns[pattern as keyof possibleActivePatternsIF]
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