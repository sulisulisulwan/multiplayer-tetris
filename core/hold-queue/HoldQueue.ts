import { EventData, HoldQueue as HoldQueueAbstract } from "multiplayer-tetris-types/frontend/core"
import { AppState } from "multiplayer-tetris-types/frontend/shared"


export class HoldQueue implements HoldQueueAbstract {

  private holdQueueState: {}

  constructor() {
    this.holdQueueState = {}
  }

  public setHoldQueueState(gameState: AppState['gameState']) {
    this.holdQueueState = gameState.holdQueue
  }

  public handleHoldQueueToggle(gameState: AppState['gameState'], eventData: EventData) {
    this.setHoldQueueState(gameState)
  }
}