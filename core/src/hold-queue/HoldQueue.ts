import { AppState, EventData, HoldQueue as HoldQueueAbstract, OnePlayerLocalGameState } from "multiplayer-tetris-types"


export class HoldQueue implements HoldQueueAbstract {

  private holdQueueState: {}

  constructor() {
    this.holdQueueState = {}
  }

  public setHoldQueueState(gameState: OnePlayerLocalGameState) {
    this.holdQueueState = gameState.holdQueue
  }

  public handleHoldQueueToggle(gameState: OnePlayerLocalGameState, eventData: EventData) {
    this.setHoldQueueState(gameState)
  }
}