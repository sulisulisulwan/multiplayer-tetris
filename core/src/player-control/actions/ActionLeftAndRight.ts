import { AppState, EventData, Tetrimino, AutoRepeat, TetriminoMovementHandler, OnePlayerLocalGameState } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import BaseAction from './BaseAction.js'
import TimerManager from "../../timerManager/TimerManager.js";

type SetIntervalId = ReturnType<typeof setInterval>
type SetTimeoutId = ReturnType<typeof setTimeout>

export default class ActionLeftAndRight extends BaseAction {
  protected currGameState: any
  protected timerManager: TimerManager

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler)
    this.currGameState = null
    this.timerManager = timerManager
  }

  public execute(
    gameState: OnePlayerLocalGameState,
    dispatch: Dispatch,
    eventData: EventData, 
  ) {

    this.currGameState = gameState
    let { playerAction, playfield, currentTetrimino } = gameState
    const { autoRepeat } = playerAction
    let { override } = autoRepeat
    const { strokeType, action } = eventData
    
    const newGameState: any = {
      playerAction: {
        autoRepeat: {
          left: gameState.playerAction.autoRepeat.left,
          right: gameState.playerAction.autoRepeat.right,
          override: gameState.playerAction.autoRepeat.override,
        },
        softdrop: gameState.playerAction.softdrop,
        harddrop: gameState.playerAction.harddrop,
        flipClockwise: gameState.playerAction.flipClockwise,
        flipCounterClockwise: gameState.playerAction.flipCounterClockwise,
        hold: gameState.playerAction.hold
      }
    }
  
    if (strokeType === 'keyup') {
      this.timerManager.clear(`${action as 'left' | 'right'}Interval`)
      if (this.timerManager.isSet('autoRepeatDelayTimeout')) {
        this.timerManager.clear('autoRepeatDelayTimeout')
      }
      newGameState.playerAction.autoRepeat.override = null
      action === 'left' ? newGameState.playerAction.autoRepeat.left = false : newGameState.playerAction.autoRepeat.right = false  
    }
  
  
    // Determine what action will be taken.  Override always determines this.
    if (strokeType === 'keydown') {

      //The key has already been held down.  Let the interval function do its work
      if (gameState.playerAction.autoRepeat[action as keyof AutoRepeat] && override === action) {
        return
      }
  
      const oppositeAction = action === 'left' ? 'right' : 'left'
  
      // If there is a preexisting action in motion and override will switch to opposite action
      if (this.timerManager.isSet(`${oppositeAction}Interval`)) {
        this.timerManager.clear(`${oppositeAction}Interval`)
      }
  
      if (action === 'left') {
        newGameState.playerAction.autoRepeat.left = true  
      } else if (action === 'right') {
        newGameState.playerAction.autoRepeat.right = true
      }
      newGameState.playerAction.autoRepeat.override = newGameState.playerAction.autoRepeat[oppositeAction] ? action : null
    } 
  
    // Execute the action if there is an action to be executed
    if (newGameState.playerAction.autoRepeat.override 
      || newGameState.playerAction.autoRepeat.left 
      || newGameState.playerAction.autoRepeat.right
    ) {
  
      const { override, left } = newGameState.playerAction.autoRepeat
      let direction = override ? override : (left ? 'left' : 'right')
  
      if (gameState.gameOptions.ghostTetriminoOn) {
        playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield as string[][])
      }
  
      const { 
        newPlayfield, 
        newTetrimino, 
        successfulMove
      } = this.tetriminoMovementHandler.moveOne(direction, playfield as string[][], currentTetrimino as Tetrimino)
    
      if (successfulMove)  {
        newGameState.currentTetrimino = newTetrimino
  
        if (gameState.gameOptions.ghostTetriminoOn) {
          const newGhostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
          newGameState.ghostCoords = newGhostCoords
          newGameState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(newGhostCoords, newPlayfield, '[g]')
        } else {
          newGameState.playfield = newPlayfield
        }
  
        //TODO: This should account for movements that occur only after lockdown, not before.  This current logic will mistake pre lockdown scenarios as post lockdown
        // Think, at every point in time, the newTetriminoBaseRowIdx will === appState.lowestLockSurfaceRow
        const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
        if (
          newTetriminoBaseRowIdx <= (gameState.lowestLockSurfaceRow as number) && 
          gameState.postLockMode &&
          gameState.extendedLockdownMovesRemaining > 0
        ) {
          this.timerManager.clear('lockTimeout')
          newGameState.extendedLockdownMovesRemaining = gameState.extendedLockdownMovesRemaining - 1
        }
      }
    
    }
  
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    this.handleAutorepeatActions
  }

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

  protected setAutoRepeatDelayTimeout(): SetTimeoutId {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300) as unknown as number
  }

  protected unsetAutoRepeatDelayTimeoutId(): void {
    this.timerManager.clear('autoRepeatDelayTimeout')
  }

  protected setContinuousLeftOrRight(dispatch: Dispatch, direction: string): SetIntervalId {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, dispatch, direction) as unknown as number
  }

  protected continuousLeftOrRight(dispatch: Dispatch, playerAction: string): void {

    if (this.timerManager.isSet('autoRepeatDelayTimeout')) return 
    
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