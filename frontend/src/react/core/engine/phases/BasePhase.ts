import { AppState, SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { SharedScope } from "../../SharedScope"
import { Dispatch } from "redux"

export default abstract class BasePhase extends SharedScope {
  
  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }

  public abstract execute(gameState: AppState['gameState'], dispatcher: Dispatch<any>): void

}