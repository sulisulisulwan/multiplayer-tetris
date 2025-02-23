import { AppState, BaseScoringHandler, EventData, OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types"
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux"
import { Dispatch } from "redux"
import BaseAction from './BaseAction.js'
import TimerManager from "../../timerManager/TimerManager.js"

export default class ActionSoftdrop extends BaseAction {

  protected handlers: Record<string, Function>
  protected scoringHandler: BaseScoringHandler
  protected timerManager: TimerManager

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler)
    this.scoringHandler = scoringHandler
    this.timerManager = timerManager
    this.handlers = {
      keyup: this.handleKeyUp.bind(this),
      keydown: this.handleKeyDown.bind(this)
    }
  }

  public execute(
    gameState: OnePlayerLocalGameState,
    dispatch: Dispatch,
    eventData: EventData, 
  ) {
    const { strokeType } = eventData
    this.handlers[strokeType](gameState, dispatch)
  }

  private handleKeyDown(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
    // Prevent softdrop keystroke action from firing if softdrop already in motion
    if (gameState.playerAction.softdrop) return


    // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
    this.timerManager.clear('fallInterval')
    const newGameState: any = {
      playerAction: {
        autoRepeat: {
          left: gameState.playerAction.autoRepeat.left,
          right: gameState.playerAction.autoRepeat.right,
          override: gameState.playerAction.autoRepeat.override,
        },
        softdrop: true,
        harddrop: gameState.playerAction.harddrop,
        flipClockwise: gameState.playerAction.flipClockwise,
        flipCounterClockwise: gameState.playerAction.flipCounterClockwise,
        hold: gameState.playerAction.hold
      }
    }
    newGameState.fallSpeed = gameState.fallSpeed * .02
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  private handleKeyUp(gameState: OnePlayerLocalGameState, dispatch: Dispatch) {
      // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
      this.timerManager.clear('fallInterval')
      const newGameState: any = {
        playerAction: {
          autoRepeat: {
            left: gameState.playerAction.autoRepeat.left,
            right: gameState.playerAction.autoRepeat.right,
            override: gameState.playerAction.autoRepeat.override,
          },
          softdrop: false,
          harddrop: gameState.playerAction.harddrop,
          flipClockwise: gameState.playerAction.flipClockwise,
          flipCounterClockwise: gameState.playerAction.flipCounterClockwise,
          hold: gameState.playerAction.hold
        }
      }
      newGameState.fallSpeed = gameState.fallSpeed / .02
      dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }
}
