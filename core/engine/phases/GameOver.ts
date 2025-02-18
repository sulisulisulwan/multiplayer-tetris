import { SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { BasePhase } from "multiplayer-tetris-types/frontend/core"
import { AppState } from "multiplayer-tetris-types/frontend/shared"
import { Dispatch } from "redux"
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState"

export default class GameOver extends BasePhase {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }
  
  execute(gameState: AppState['gameState'], dispatch: Dispatch) {
    console.log('>>>> GAME OVER')
  }

}