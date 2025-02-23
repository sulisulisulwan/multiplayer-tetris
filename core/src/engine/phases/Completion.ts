import { AppState, OnePlayerLocalGameState, BasePhase } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";

export default class Completion extends BasePhase {

  constructor() {
    super()
  }
  
  public execute(_: OnePlayerLocalGameState, dispatch: Dispatch) {
    // console.log('>>>> COMPLETION PHASE')
    let newGameState = {} as OnePlayerLocalGameState

    newGameState.currentTetrimino = null
    newGameState.performedTSpin = false
    newGameState.performedTSpinMini = false
    newGameState.currentGamePhase = 'generation';

    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
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