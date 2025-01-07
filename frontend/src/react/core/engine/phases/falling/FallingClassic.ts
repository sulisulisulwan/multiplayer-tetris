import { appStateIF, sharedHandlersIF } from "../../../../types";
import BasePhase from "../BasePhase";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory";
import trailHandler from "../../../tetrimino/trail/Trail";
export default class FallingClassic extends BasePhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  execute() {

    const newState = {} as appStateIF

    // Handle autorepeat player actions
    const { override } = this.appState.playerAction.autoRepeat
    if (!override) {
      const autoRepeatDirection = this.appState.playerAction.autoRepeat.left ? 'left' : 'right'
      if (this.appState.playerAction.autoRepeat[autoRepeatDirection] && this.appState[`${autoRepeatDirection}IntervalId`] === null) {
        (newState.autoRepeatDelayTimeoutId as any) = this.setAutoRepeatDelayTimeout();
        (newState[`${autoRepeatDirection}IntervalId`] as any) = this.setContinuousLeftOrRight(autoRepeatDirection)
      }

    } else if (this.appState[`${override}IntervalId` as keyof appStateIF] === null) {
      (newState.autoRepeatDelayTimeoutId as any) = this.setAutoRepeatDelayTimeout() //TODO: fix types
      const intervalId = this.setContinuousLeftOrRight(override)
      override === 'left' ? (newState.leftIntervalId as any) = intervalId : (newState.rightIntervalId as any) = intervalId //TODO: fix types
    }

    // If entering Falling phase, set intervallic fall event
    if (this.appState.fallIntervalId === null) {
      (newState.fallIntervalId as any) = this.setContinuousFallEvent() //TODO: fix types
    }

    // If state hasn't changed, don't set state.
    if (Object.keys(newState).length === 0) {
      return
    }

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

  setContinuousFallEvent(): NodeJS.Timer {
    return setInterval(this.continuousFallEvent.bind(this), this.appState.fallSpeed)
  }

  continuousFallEvent(): void {
    
    const newState = {} as appStateIF

    const { playfield, currentTetrimino, fallIntervalId } = this.appState

    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)

        // If the Tetrimino can move down one row, update state with its new position
    if (successfulMove)  {

      // Handle softdrop scoring
      if (this.appState.playerAction.softdrop) {
        newPlayfield = trailHandler.addToSoftdropTrail(newTetrimino, newPlayfield)
        const scoreItem = this.scoreItemFactory.getItem('softdrop', this.appState, null)
        newState.totalScore = this.scoringHandler.updateScore(this.appState.totalScore, scoreItem)
      }

      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      newState.performedTSpin = false 
      newState.performedTSpinMini = false
      newState.postLockMode = false

      // If new Tetrimino location has reached a surface, trigger lock phase
      const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', newPlayfield, newTetrimino)
      const tetriminoWillHaveReachedSurface = !successfulMove

      if (tetriminoWillHaveReachedSurface) {

        if (this.appState.playerAction.softdrop) {
          // newPlayfield = trailHandler.clearSoftdropTrail(newTetrimino, newPlayfield)
          newPlayfield = trailHandler.clearSoftdropTrail(newPlayfield)
          newState.playfield = newPlayfield
        }
        clearInterval(fallIntervalId)
        newState.fallIntervalId = null
        newState.currentGamePhase = 'lock'
      }

      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }

  continuousLeftOrRight(playerAction: string): void {

    if (this.appState.autoRepeatDelayTimeoutId) { 
      return 
    }

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(playerAction, this.appState.playfield, this.appState.currentTetrimino)
    
    if (successfulMove)  {
      this.setAppState((prevState) => ({ 
        ...prevState, 
        currentTetrimino: newTetrimino,
        playfield: newPlayfield
      }))
      return
    }

  }
  
}