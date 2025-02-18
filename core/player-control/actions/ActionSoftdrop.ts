import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { EventData } from "multiplayer-tetris-types/frontend/core"
import { AppState } from "multiplayer-tetris-types/frontend/shared"
import { SharedScope } from "../../SharedScope"
import { Dispatch } from "redux"
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState"
import { makeCopy } from "../../utils/utils"

export default class ActionSoftdrop extends SharedScope {

  protected handlers: Record<string, Function>

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.handlers = {
      keyup: this.handleKeyUp.bind(this),
      keydown: this.handleKeyDown.bind(this)
    }
  }

  public execute(
    gameState: AppState['gameState'],
    dispatch: Dispatch,
    eventData: EventData, 
  ) {
    const { strokeType } = eventData
    this.handlers[strokeType](gameState, dispatch)
  }

  private handleKeyDown(gameState: AppState['gameState'], dispatch: Dispatch) {
    // Prevent softdrop keystroke action from firing if softdrop already in motion
    if (gameState.playerAction.softdrop) return


    // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
    clearInterval(gameState.fallIntervalId)
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
    newGameState.fallIntervalId = null
    newGameState.fallSpeed = gameState.fallSpeed * .02
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  private handleKeyUp(gameState: AppState['gameState'], dispatch: Dispatch) {
      // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
      clearInterval(gameState.fallIntervalId)
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
      newGameState.fallIntervalId = null
      newGameState.fallSpeed = gameState.fallSpeed / .02
      dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }
}
