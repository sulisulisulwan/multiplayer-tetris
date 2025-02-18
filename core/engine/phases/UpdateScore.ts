import ScoreItemFactory from "../../scoring/ScoreItemFactory";
import { AppState, GenericObject, LocalGameState, ScoreItem, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { soundEffects } from "../../../App";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";

export default class UpdateScore extends BasePhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  public execute(gameState: AppState['gameState'], dispatch: Dispatch) {
    let newGameState = {} as LocalGameState
    const newTotalScore = this.accrueScoreAndScoreHistory(gameState)

    if (gameState.totalLinesCleared >= gameState.levelClearedLinesGoal) {
      this.promoteLevel(gameState, newGameState)
    }

    newGameState.scoreItems = []
    newGameState.totalScore = newTotalScore
    newGameState.currentGamePhase = 'animate'
    dispatch(updateMultipleGameStateFields({ ...newGameState }))

  }

  private accrueScoreAndScoreHistory(gameState: AppState['gameState']) {
    const { scoreItems, scoreHistory } = this.getScoreItemsFromPatterns(gameState)
    const newTotalScore = this.scoringHandler.handleCompletionPhaseAccrual(gameState.totalScore, scoreItems, scoreHistory)
    return newTotalScore
  }

  private getScoreItemsFromPatterns(gameState: AppState['gameState']) {
    const scoreItems = [] as ScoreItem[]
    const { patternItems } = gameState

    const scoreHistory: GenericObject = {}

    patternItems.forEach((pattern: any) => {
      const { type, data } = pattern
      scoreItems.push(this.scoreItemFactory.getItem(type, gameState, data))
      scoreHistory[type as keyof GenericObject] = true
    })

    return { scoreItems, scoreHistory}
  }

  private promoteLevel(gameState: AppState['gameState'], newGameState: LocalGameState) {
    const newLevel = gameState.currentLevel + 1
    const { 
      levelClearedLinesGoal, 
      fallSpeed 
    } = this.levelGoalsHandler.getNewLevelSpecs(newLevel, gameState.totalLinesCleared)
    
    soundEffects.play('levelUp')

    newGameState.currentLevel = newLevel
    newGameState.levelClearedLinesGoal = levelClearedLinesGoal
    newGameState.fallSpeed = fallSpeed
    newGameState.playerAction = gameState.playerAction
    newGameState.playerAction.softdrop = false // Fixes math bug for softdrop where button trigger bleeds over to generation phase through level promotion
  }

}