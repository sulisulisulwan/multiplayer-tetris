import { OnePlayerLocalGameState } from "multiplayer-tetris-types"
import { Dispatch } from "redux"

export default abstract class BasePhase {
  
  public abstract execute(gameState: OnePlayerLocalGameState, dispatcher: Dispatch<any>): void

}