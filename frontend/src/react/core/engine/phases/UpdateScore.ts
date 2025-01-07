import { appStateIF, genericObjectIF, scoreItemIF, sharedHandlersIF } from "../../../types";
import BasePhase from "./BasePhase";
import ScoreItemFactory from "../../scoring/ScoreItemFactory";

export default class UpdateScore extends BasePhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  public execute() {
    let newState = {} as appStateIF
    const newTotalScore = this.accrueScoreAndScoreHistory()

    if (this.appState.totalLinesCleared >= this.appState.levelClearedLinesGoal) {
      this.promoteLevel(newState)
    }

    newState.scoreItems = []
    newState.totalScore = newTotalScore
    newState.currentGamePhase = 'animate'
    this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }

  private accrueScoreAndScoreHistory() {
    const { scoreItems, scoreHistory } = this.getScoreItemsFromPatterns()
    const newTotalScore = this.scoringHandler.handleCompletionPhaseAccrual(this.appState.totalScore, scoreItems, scoreHistory)
    return newTotalScore
  }

  private getScoreItemsFromPatterns() {
    const scoreItems = [] as scoreItemIF[]
    const { patternItems } = this.appState

    const scoreHistory: genericObjectIF = {}

    patternItems.forEach(pattern => {
      const { type, data } = pattern
      scoreItems.push(this.scoreItemFactory.getItem(type, this.appState, data))
      scoreHistory[type as keyof genericObjectIF] = true
    })

    return { scoreItems, scoreHistory}
  }

  private promoteLevel(newState: appStateIF) {
    const newLevel = this.appState.currentLevel + 1
    const { 
      levelClearedLinesGoal, 
      fallSpeed 
    } = this.levelGoalsHandler.getNewLevelSpecs(newLevel, this.appState.totalLinesCleared)
    
    this.soundEffects.play('levelUp')

    newState.currentLevel = newLevel
    newState.levelClearedLinesGoal = levelClearedLinesGoal
    newState.fallSpeed = fallSpeed
    newState.playerAction = this.appState.playerAction
    newState.playerAction.softdrop = false // Fixes math bug for softdrop where button trigger bleeds over to generation phase through level promotion
  }

}