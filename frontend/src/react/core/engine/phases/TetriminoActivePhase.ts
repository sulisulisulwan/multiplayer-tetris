import { appStateIF, sharedHandlersIF } from "../../../types"
import BasePhase from "./BasePhase"

export default abstract class TetriminoActivePhase extends BasePhase {

  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  public abstract execute(): void

  handleAutorepeatActions(newState: appStateIF) {
    const { override } = this.appState.playerAction.autoRepeat
    if (!override) {
      const autoRepeatDirection = this.appState.playerAction.autoRepeat.left ? 'left' : 'right'
      if (this.appState.playerAction.autoRepeat[autoRepeatDirection] && this.appState[`${autoRepeatDirection}IntervalId`] === null) {
        (newState.autoRepeatDelayTimeoutId as any) = this.setAutoRepeatDelayTimeout();
        (newState[`${autoRepeatDirection}IntervalId`] as any) = this.setContinuousLeftOrRight(autoRepeatDirection)
      }
    } else if (this.appState[`${override}IntervalId` as keyof appStateIF] === null) {
      (newState.fallIntervalId as any) = this.setAutoRepeatDelayTimeout()
      const intervalId = this.setContinuousLeftOrRight(override)
      override === 'left' ? (newState.leftIntervalId as any) = intervalId : (newState.rightIntervalId as any) = intervalId //TODO: fix types
    }

    return newState
  }

  setAutoRepeatDelayTimeout(): NodeJS.Timer {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300)
  }

  unsetAutoRepeatDelayTimeoutId(): void {
    const newState = { autoRepeatDelayTimeoutId: null } as appStateIF
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  setContinuousLeftOrRight(direction: string): NodeJS.Timer {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  continuousLeftOrRight(playerAction: string): void {

    if (this.appState.autoRepeatDelayTimeoutId) return 
    
    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(playerAction, this.appState.playfield, this.appState.currentTetrimino)
    
    if (successfulMove)  {
      return this.setAppState((prevState) => ({ 
        ...prevState, // THIS STATE IS OUT OF DATE FOR SOME REASON. TODO: fix this hack
        fallIntervalId: this.appState.fallIntervalId, // THIS IS A HACK
        currentTetrimino: newTetrimino,
        playfield: newPlayfield
      }))
    }

  }
}