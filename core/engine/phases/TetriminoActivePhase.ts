import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { BasePhase } from "multiplayer-tetris-types/frontend/core"
import { AppState } from "multiplayer-tetris-types/frontend/shared"
import { Dispatch } from "redux"
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState"

export default abstract class TetriminoActivePhase extends BasePhase {

  protected currGameState: AppState['gameState']
  
  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }
  public abstract execute(gameState: AppState['gameState'], dispatch: Dispatch): void

  handleAutorepeatActions(gameState: AppState['gameState'], dispatch: Dispatch, newGameState: LocalGameState) {
    const { override } = gameState.playerAction.autoRepeat
    
    if (!override) {
      const autoRepeatDirection = gameState.playerAction.autoRepeat.left ? 'left' : 'right'
      if (gameState.playerAction.autoRepeat[autoRepeatDirection] && gameState[`${autoRepeatDirection}IntervalId`] === null) {
        (newGameState.autoRepeatDelayTimeoutId as any) = this.setAutoRepeatDelayTimeout(dispatch);
        (newGameState[`${autoRepeatDirection}IntervalId`] as any) = this.setContinuousLeftOrRight(gameState, dispatch, autoRepeatDirection)
      }
    } else if (gameState[`${override}IntervalId` as keyof AppState['gameState']] === null) {
      (newGameState[`${override}IntervalId` as keyof AppState['gameState']] as any) = this.setAutoRepeatDelayTimeout(dispatch)
      const intervalId = this.setContinuousLeftOrRight(gameState, dispatch, override)
      override === 'left' ? (newGameState.leftIntervalId as any) = intervalId : (newGameState.rightIntervalId as any) = intervalId //TODO: fix types
    }

    return newGameState
  }

  setAutoRepeatDelayTimeout(dispatch: Dispatch): NodeJS.Timer {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300, dispatch)
  }

  protected unsetAutoRepeatDelayTimeoutId(dispatch: Dispatch): void {
    const newGameState = { autoRepeatDelayTimeoutId: null } as AppState['gameState']
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  protected setContinuousLeftOrRight(gameState: AppState['gameState'], dispatch: Dispatch, direction: string): NodeJS.Timer {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, dispatch, direction)
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
      dispatch(updateMultipleGameStateFields({ ...newGameState }))
    }

  }
}