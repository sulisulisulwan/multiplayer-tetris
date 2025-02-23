import { AppState, BaseScoringHandler, EventData, OnePlayerLocalGameState, PlayerActionHandlersMap, TetriminoMovementHandler } from "multiplayer-tetris-types"
import { Dispatch } from "redux"
import ScoreItemFactory from "../scoring/ScoreItemFactory.js"
import { ActionFlip, ActionHarddrop, ActionHold, ActionLeftAndRight, ActionPauseGame, ActionSoftdrop } from "./actions/index.js"
import TimerManager from "../timerManager/TimerManager.js"

export class InGamePlayerControl {

  private keystrokeMap: Map<string, string>
  protected scoreItemFactory: ScoreItemFactory
  private tetriminoMovementHandler: TetriminoMovementHandler
  private playerActions: PlayerActionHandlersMap

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {

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

    this.tetriminoMovementHandler = tetriminoMovementHandler
    this.playerActions = {
      left: new ActionLeftAndRight(tetriminoMovementHandler, timerManager), //TODO: is it a problem that two different objects are instantiated for these actinos?  they both hold curr game state
      right: new ActionLeftAndRight(tetriminoMovementHandler, timerManager),
      flipClockwise: new ActionFlip(tetriminoMovementHandler, timerManager),
      flipCounterClockwise: new ActionFlip(tetriminoMovementHandler, timerManager),
      softdrop: new ActionSoftdrop(tetriminoMovementHandler, scoringHandler, timerManager),
      harddrop: new ActionHarddrop(tetriminoMovementHandler, scoringHandler, timerManager),
      hold: new ActionHold(tetriminoMovementHandler),
      pauseGame: new ActionPauseGame(tetriminoMovementHandler),
    }

    this.scoreItemFactory = new ScoreItemFactory()

  }

  public keystrokeHandler(e: { key: string, type: string }, gameState: OnePlayerLocalGameState, dispatch: Dispatch<any>) {
    
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

  tetriminoOnSurface(gameState: OnePlayerLocalGameState) {
    const { playfield, currentTetrimino } = gameState
    const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    return !successfulMove
  }

}