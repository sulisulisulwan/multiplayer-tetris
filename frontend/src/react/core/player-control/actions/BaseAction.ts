import { Action as ActionAbstract, EventData} from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { SharedScope } from "../../SharedScope";


export default class Action extends SharedScope implements ActionAbstract {

  public execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>, eventData: EventData, ): void {
      
  }

}