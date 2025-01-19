import { SharedScope } from "../SharedScope"
import { actionLeftAndRight, actionFlip, actionSoftdrop, actionHarddrop, actionHold, actionPauseGame } from "./actions"
import { appStateIF, eventDataIF, playerActionHandlersIF, sharedHandlersIF } from "../../types"
import ScoreItemFactory from "../scoring/ScoreItemFactory"

export class PlayerControl extends SharedScope {

  private keystrokeMap: Map<string, string>
  protected scoreItemFactory: ScoreItemFactory
  private playerActions: playerActionHandlersIF
  private currKeystrokes: Set<string>

  constructor(sharedHandlers: sharedHandlersIF) {

    super(sharedHandlers)
    this.keystrokeMap = new Map([
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
      left: actionLeftAndRight.bind(this),
      right: actionLeftAndRight.bind(this),
      flipClockwise: actionFlip.bind(this),
      flipCounterClockwise: actionFlip.bind(this),
      softdrop: actionSoftdrop.bind(this),
      harddrop: actionHarddrop.bind(this),
      hold: actionHold.bind(this),
      pauseGame: actionPauseGame.bind(this)
    }

    this.currKeystrokes = new Set()
    this.scoreItemFactory = new ScoreItemFactory()

  }

  public keystrokeHandler(appState: appStateIF, e: React.KeyboardEvent) {

    this.syncToReactAppState(appState)
    

    if (!['falling', 'lock'].includes(this.appState.currentGamePhase)) {
      return 
    }

    const eventData: eventDataIF = {
      key: e.key,
      strokeType: e.type,
      action: this.keystrokeMap.get(e.key) || null,
      currKeystrokes: null
    }



    if (eventData.action === 'left' 
      || eventData.action === 'right'
      || eventData.action === 'flipClockwise'
      || eventData.action === 'flipCounterClockwise'
    ) {


      // If there are no more extended moves left, and the Tetrimino has touched down on a surface, any keydown actions will be ignored forcing lockdown
      if (this.appState.extendedLockdownMovesRemaining <= 0 && eventData.strokeType === 'keydown') {
        const { playfield, currentTetrimino } = this.appState
        const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
        const tetriminoOnSurface = !successfulMove
        if (tetriminoOnSurface)
        return
      }
    }

    if (eventData.action === null || this.appState.currentTetrimino.status === 'locked') {
      return
    }

    if (eventData.strokeType === 'keydown') {
      this.currKeystrokes.add(eventData.action)
    }
    if (eventData.strokeType === 'keyup') {
      this.currKeystrokes.delete(eventData.action)
    }

    eventData.currKeystrokes = this.currKeystrokes

    // Execute the player's action
    const playerActionHandler = this.playerActions[eventData.action as keyof playerActionHandlersIF]
    playerActionHandler(eventData)
  }

  left(eventData: eventDataIF) {
    actionLeftAndRight(eventData)
  }

  right(eventData: eventDataIF) {
    actionLeftAndRight(eventData)
  }

  flipCounterClockwise(eventData: eventDataIF) {
    actionFlip(eventData)
  }
  
  flipClockwise(eventData: eventDataIF) {
    actionFlip(eventData)
  }

  softdrop(eventData: eventDataIF) {
    actionSoftdrop(eventData)
  }
  
  harddrop(eventData: eventDataIF) {
    actionHarddrop(eventData)
  }

  hold(eventData: eventDataIF) {
    actionHold(eventData)
  }

  pauseGame(eventData: eventDataIF) {
    actionPauseGame(eventData)
  }

}