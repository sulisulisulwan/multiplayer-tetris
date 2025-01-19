
import { appStateIF, sharedHandlersIF } from "../../../../types";
import TetriminoActivePhase from "../TetriminoActivePhase";

export default abstract class FallingPhase extends TetriminoActivePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }


  /**
   * Will re-trigger when:
   * - Player makes any kind of move 
   * - Continuous fall event set, triggered, or unset
   * -  
   */

  public execute(): void {
    // console.log('>>>> FALLING PHASE')
    let newState = {} as appStateIF

    // If entering Falling phase, set intervallic fall event
    if (this.appState.fallIntervalId === null) {
      (newState.fallIntervalId as any) = this.setContinuousFallEvent() //TODO: fix types
    }

    // Handle autorepeat player actions
    newState = this.handleAutorepeatActions(newState)

    // If state hasn't changed, don't set state.
    if (Object.keys(newState).length === 0) return
  
    this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }

  setContinuousFallEvent(): NodeJS.Timer {
    return setInterval(this.continuousFallEvent.bind(this), this.appState.fallSpeed)
  }

  protected abstract continuousFallEvent(): void
}

