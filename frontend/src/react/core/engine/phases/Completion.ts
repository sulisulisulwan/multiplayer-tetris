import { appStateIF, sharedHandlersIF } from "../../../types/index";
import BasePhase from "./BasePhase";

export default class Completion extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  public execute() {
    // console.log('>>>> COMPLETION PHASE')
    let newState = {} as appStateIF

    newState.currentTetrimino = null
    newState.performedTSpin = false
    newState.performedTSpinMini = false
    newState.currentGamePhase = 'generation';

    
    
    this.setAppState((prevState) => {
      const updatedState = { ...prevState, ...newState}
      this.sendUpdateToServer(updatedState)
      return updatedState
    })
  }

  protected sendUpdateToServer(newState: appStateIF) {
    const dataPayload = { action: 'updateServerGameState', data: newState };
    (window as any).electronBridge.sendToElectron('dgram', dataPayload)
  }

}

/**
 * this is where any final updates to state are made for the next engine cycle
 */