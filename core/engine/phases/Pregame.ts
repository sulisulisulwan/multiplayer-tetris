import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";
import { backgroundMusic } from "../../../App";

export default class Pregame extends BasePhase {
  
  protected pregameCounter: number
  protected pregameIntervalId: any

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.pregameCounter = null
    this.pregameIntervalId = null
  }

  // TODO: This phase should load in all of the options. Take into account default options
  execute(gameState: AppState['gameState'], dispatch: Dispatch<any>) {
    
    if (gameState.pregameIntervalId === null) {
      this.pregameCounter = gameState.pregameCounter
      const newGameState = {} as LocalGameState
      backgroundMusic.play()
      this.pregameIntervalId = setInterval(this.pregameIntervalEvent.bind(this), 1000, 
      dispatch)
      
      const { levelClearedLinesGoal, fallSpeed } = this.levelGoalsHandler.getNewLevelSpecs(gameState.currentLevel, 0)
      newGameState.levelClearedLinesGoal = levelClearedLinesGoal
      newGameState.fallSpeed = fallSpeed
      newGameState.pregameIntervalId = this.pregameIntervalId
      dispatch(updateMultipleGameStateFields({ ...newGameState }))
    }
  }

  protected pregameIntervalEvent(
    dispatch: Dispatch) {
    const newGameState = {} as LocalGameState
    if (this.pregameCounter === 0) {
      clearInterval(this.pregameIntervalId)
      newGameState.pregameIntervalId = null
      newGameState.currentGamePhase = 'generation' 
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
    }
    this.pregameCounter--
    newGameState.pregameCounter = this.pregameCounter
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

}