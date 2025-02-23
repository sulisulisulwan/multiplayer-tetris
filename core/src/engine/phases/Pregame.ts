import { LevelGoals, OnePlayerLocalGameState } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import BasePhase from './BasePhase.js'

export default class Pregame extends BasePhase {
  
  protected pregameCounter: number
  protected pregameIntervalId: ReturnType<typeof setInterval>
  protected levelGoalsHandler: LevelGoals

  constructor(levelGoalsHandler: LevelGoals) {
    super()
    this.levelGoalsHandler = levelGoalsHandler
    this.pregameCounter = 3
    this.pregameIntervalId = null
  }

  // TODO: This phase should load in all of the options. Take into account default options
  execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch<any>) {

    if (this.pregameIntervalId === null) {
      this.pregameCounter = gameState.pregameCounter
      const newGameState = {} as OnePlayerLocalGameState
      this.pregameIntervalId = setInterval(this.pregameIntervalEvent.bind(this), 1000, 
      dispatch)
      const { levelClearedLinesGoal, fallSpeed } = this.levelGoalsHandler.getNewLevelSpecs(gameState.currentLevel, 0)
      newGameState.levelClearedLinesGoal = levelClearedLinesGoal
      newGameState.fallSpeed = fallSpeed
      dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }
  }

  protected pregameIntervalEvent(
    dispatch: Dispatch) {
    const newGameState = {} as OnePlayerLocalGameState
    if (this.pregameCounter === 0) {

      clearInterval(this.pregameIntervalId)
      this.pregameIntervalId = null
      newGameState.currentGamePhase = 'generation' 
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }
    this.pregameCounter--
    newGameState.pregameCounter = this.pregameCounter
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

}