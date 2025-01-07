import { appStateIF, eventDataIF } from "../../types"

export class HoldQueue {

  private holdQueueState: {}

  constructor() {
    this.holdQueueState = {}
  }

  setHoldQueueState(state: appStateIF) {
    this.holdQueueState = state.holdQueue
  }

  handleHoldQueueToggle(appState: appStateIF, eventData: eventDataIF) {
    this.setHoldQueueState(appState)
    console.log('this runss')
    

  }
}