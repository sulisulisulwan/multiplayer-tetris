import { AppState, BaseScoringHandler, GenericObject, LevelGoals, OnePlayerLocalGameState, ScoreItem } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import BasePhase from "./BasePhase.js";
import ScoreItemFactory from "../../scoring/ScoreItemFactory.js";

export default class UpdateScore extends BasePhase {

  private scoreItemFactory: ScoreItemFactory
  protected scoringHandler: BaseScoringHandler
  protected levelGoalsHandler: LevelGoals

  constructor(scoringHandler: BaseScoringHandler, levelGoalsHandler: LevelGoals) {
    super()
    this.scoringHandler = scoringHandler
    this.levelGoalsHandler = levelGoalsHandler
    this.scoreItemFactory = new ScoreItemFactory()
  }

  public execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    let newGameState = {} as OnePlayerLocalGameState
    const newTotalScore = this.accrueScoreAndScoreHistory(gameState)

    if (gameState.totalLinesCleared >= gameState.levelClearedLinesGoal) {
      this.promoteLevel(gameState, newGameState)
    }

    newGameState.scoreItems = []
    newGameState.totalScore = newTotalScore
    newGameState.currentGamePhase = 'animate'
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))

  }

  private accrueScoreAndScoreHistory(gameState: OnePlayerLocalGameState) {
    const { scoreItems, scoreHistory } = this.getScoreItemsFromPatterns(gameState)
    const newTotalScore = this.scoringHandler.handleCompletionPhaseAccrual(gameState.totalScore, scoreItems, scoreHistory)
    return newTotalScore
  }

  private getScoreItemsFromPatterns(gameState: OnePlayerLocalGameState) {
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

  private promoteLevel(gameState: OnePlayerLocalGameState, newGameState: OnePlayerLocalGameState) {
    const newLevel = gameState.currentLevel + 1
    const { 
      levelClearedLinesGoal, 
      fallSpeed 
    } = this.levelGoalsHandler.getNewLevelSpecs(newLevel, gameState.totalLinesCleared)
    

    newGameState.currentLevel = newLevel
    newGameState.levelClearedLinesGoal = levelClearedLinesGoal
    newGameState.fallSpeed = fallSpeed
    newGameState.playerAction = {
        autoRepeat: {
          left: gameState.playerAction.autoRepeat.left,
          right: gameState.playerAction.autoRepeat.right,
          override: gameState.playerAction.autoRepeat.override
        },
        softdrop: false, // Fixes math bug for softdrop where button trigger bleeds over to generation phase through level promotion
        harddrop: gameState.playerAction.harddrop,
        flipClockwise: gameState.playerAction.flipClockwise,
        flipCounterClockwise: gameState.playerAction.flipCounterClockwise,
        hold: gameState.playerAction.hold
    }
  }

}