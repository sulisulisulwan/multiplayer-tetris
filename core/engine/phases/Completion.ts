import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { BasePhase } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";

export default class Completion extends BasePhase {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }
  
  public execute(_: AppState['gameState'], dispatch: Dispatch) {
    // console.log('>>>> COMPLETION PHASE')
    let newGameState = {} as LocalGameState

    newGameState.currentTetrimino = null
    newGameState.performedTSpin = false
    newGameState.performedTSpinMini = false
    newGameState.currentGamePhase = 'generation';

    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }


  // TODO: how will this actually be implemented?  
  // In EVERY state update within the engine, (phase, player moves, anything which changes the state) we need to check if this
  // is a multiplayer game or singleplayer game.  if singleplayer, we can make updates to local state
  // otherwise, we need to send updates to the server and then receive the
  // update from the server via DGRAM 
  protected sendUpdateToServer(newState: AppState) {
    const dataPayload = { action: 'updateServerGameState', data: newState };
    (window as any).electronBridge.sendToElectron('dgram', dataPayload)
  }

}

/**
 * this is where any final updates to state are made for the next engine cycle
 */