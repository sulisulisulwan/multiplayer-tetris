import { AppState, BasePhase, OnePlayerLocalGameState } from "multiplayer-tetris-types"
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux"
import { Dispatch } from "redux"

export default class GameOver extends BasePhase {

  constructor() {
    super()
  }
  
  execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    console.log('>>>> GAME OVER')
  }

}