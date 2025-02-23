import { OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types"
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux"
import { Dispatch } from "redux"
import BasePhase from "./BasePhase.js"
import TimerManager from "../../timerManager/TimerManager.js"

type SetIntervalId = ReturnType<typeof setInterval>
type SetTimeoutId = ReturnType<typeof setTimeout>

export default abstract class TetriminoActivePhase extends BasePhase {

  protected currGameState: any
  protected tetriminoMovementHandler: TetriminoMovementHandler
  protected timerManager: TimerManager
  
  constructor(tetriminoMovementHandler: TetriminoMovementHandler, timerManager: TimerManager) {
    super()
    this.tetriminoMovementHandler = tetriminoMovementHandler
    this.timerManager = timerManager
  }
  public abstract execute(gameState: OnePlayerLocalGameState, dispatch: Dispatch): void

  handleAutorepeatActions(gameState: OnePlayerLocalGameState, dispatch: Dispatch, newGameState: OnePlayerLocalGameState) {
    const { override } = gameState.playerAction.autoRepeat
    
    if (!override) {
      const autoRepeatDirection = gameState.playerAction.autoRepeat.left ? 'left' : 'right'
      if (gameState.playerAction.autoRepeat[autoRepeatDirection] && !this.timerManager.isSet(`${autoRepeatDirection}Interval`) === null) {
        const timeoutId = this.setAutoRepeatDelayTimeout();
        const intervalId = this.setContinuousLeftOrRight(dispatch, autoRepeatDirection)
        this.timerManager.setTimer('autoRepeatDelayTimeout', timeoutId);
        this.timerManager.setTimer(`${autoRepeatDirection}Interval`, intervalId);
      }
    } else if ((!this.timerManager.isSet(`${override as 'left' | 'right'}Interval`))) {
      const timeoutId = this.setAutoRepeatDelayTimeout()
      const intervalId = this.setContinuousLeftOrRight(dispatch, override)
      this.timerManager.setTimer('autoRepeatDelayTimeout', timeoutId) 
      this.timerManager.setTimer(`${override as 'left' | 'right'}Interval`, intervalId)
    }

    return newGameState
  }

  setAutoRepeatDelayTimeout(): SetTimeoutId {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300) as unknown as number
  }

  protected unsetAutoRepeatDelayTimeoutId(): void {
    this.timerManager.clear('autoRepeatDelayTimeout')
  }

  protected setContinuousLeftOrRight(dispatch: Dispatch, direction: string): SetIntervalId {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, dispatch, direction) as unknown as number
  }

  protected continuousLeftOrRight(dispatch: Dispatch, playerAction: string): void {

    if (this.currGameState.autoRepeatDelayTimeoutId) return 
    
    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(playerAction, this.currGameState.playfield, this.currGameState.currentTetrimino)
    
    if (successfulMove)  {
      const newGameState = {
        currentTetrimino: newTetrimino,
        playfield: newPlayfield
      }
      dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }

  }
}