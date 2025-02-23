import { AppState, Action as ActionAbstract, EventData, TetriminoMovementHandler, OnePlayerLocalGameState} from "multiplayer-tetris-types";
import * as Redux from 'redux'


export default class Action implements ActionAbstract {
  
  protected tetriminoMovementHandler: TetriminoMovementHandler

  constructor(tetriminoMovementHandler: TetriminoMovementHandler) {
    this.tetriminoMovementHandler = tetriminoMovementHandler
  }

  public execute(gameState: OnePlayerLocalGameState, dispatch: Redux.Dispatch<any>, eventData: EventData, ): void {
      
  }

}