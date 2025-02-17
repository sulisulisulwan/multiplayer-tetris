import { SharedScope } from "../SharedScope"
import ScoreItemFactory from "../scoring/ScoreItemFactory"
import { ActionFlip, ActionHarddrop, ActionHold, ActionLeftAndRight, ActionPauseGame, ActionSoftdrop } from "./actions"
import { PlayerActionHandlersMap, SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { AppState } from "multiplayer-tetris-types/frontend/shared"
import { EventData } from "multiplayer-tetris-types/frontend/core"
import { Dispatch } from "redux"

export class InGamePlayerControl extends SharedScope {

  private keystrokeMap: Map<string, string>
  protected scoreItemFactory: ScoreItemFactory
  private playerActions: PlayerActionHandlersMap

  constructor(sharedHandlers: SharedHandlersMap) {

    super(sharedHandlers)
    this.keystrokeMap = new Map([
      // ['Enter','activateChat'],
      ['ArrowLeft','left'],
      ['num4','left'],
      ['ArrowRight','right'],
      ['num6','right'],
      ['ArrowDown','softdrop'],
      [' ','harddrop'],
      ['num8','harddrop'],
      ['ArrowUp','flipClockwise'],
      ['x','flipClockwise'],
      ['num1','flipClockwise'],
      ['num5','flipClockwise'],
      ['num9','flipClockwise'],
      ['Control','flipCounterClockwise'],
      ['z','flipCounterClockwise'],
      ['num3','flipCounterClockwise'],
      ['num7','flipCounterClockwise'],
      ['Shift','hold'],
      ['c','hold'],
      ['num0','hold'],
      ['F1','pauseGame'],
      ['Escape','pauseGame'],
    ])

    
    this.playerActions = {
      left: new ActionLeftAndRight(sharedHandlers),
      right: new ActionLeftAndRight(sharedHandlers),
      flipClockwise: new ActionFlip(sharedHandlers),
      flipCounterClockwise: new ActionFlip(sharedHandlers),
      softdrop: new ActionSoftdrop(sharedHandlers),
      harddrop: new ActionHarddrop(sharedHandlers),
      hold: new ActionHold(sharedHandlers),
      pauseGame: new ActionPauseGame(sharedHandlers),
    }

    this.scoreItemFactory = new ScoreItemFactory()

  }

  public keystrokeHandler(gameState: AppState['gameState'], dispatch: Dispatch<any>, e: React.KeyboardEvent) {
    // this.syncToReactAppState(gameState)
    
    if (!['falling', 'lock'].includes(gameState.currentGamePhase)) {
      return 
    }

    const eventData: EventData = {
      key: e.key,
      strokeType: e.type,
      action: this.keystrokeMap.get(e.key) || null,
    }

    // If there are no more extended moves left, and the Tetrimino has touched down on a surface, any keydown actions will be ignored forcing lockdown
    if (
      ['left', 'right', 'flipClockwise', 'flipCounterClockwise'].includes(eventData.action) &&
      gameState.extendedLockdownMovesRemaining <= 0 && 
      eventData.strokeType === 'keydown' &&
      this.tetriminoOnSurface(gameState)
    ) return
    

    if (eventData.action === null || gameState.currentTetrimino.status === 'locked') return

    // Execute the player's action
    const playerActionHandler = this.playerActions[eventData.action as keyof PlayerActionHandlersMap]
    playerActionHandler.execute(gameState, dispatch, eventData)
  }

  tetriminoOnSurface(gameState: AppState['gameState']) {
    const { playfield, currentTetrimino } = gameState
    const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    return !successfulMove
  }

}