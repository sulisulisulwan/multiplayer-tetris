import { appStateIF, sharedHandlersIF } from "../../../../types";
import ScoreItemFactory from '../../../scoring/ScoreItemFactory'
import BasePhase from "../BasePhase";
import trailHandler from "../../../tetrimino/trail/Trail";

export default class FallingInfinite extends BasePhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  execute() {
    // console.log('>>>> FALLING INFINITE PHASE')

    const newState = {} as appStateIF

    // Kickoff motion intervals
    const { override } = this.appState.playerAction.autoRepeat
    if (!override) {
      const autoRepeatDirection = this.appState.playerAction.autoRepeat.left ? 'left' : 'right'
      if (this.appState.playerAction.autoRepeat[autoRepeatDirection] && this.appState[`${autoRepeatDirection}IntervalId`] === null) {
        newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout()
        newState[`${autoRepeatDirection}IntervalId`] = this.setContinuousLeftOrRight(autoRepeatDirection)
      }

    } else if (this.appState[`${override}IntervalId` as keyof appStateIF] === null) {
      newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout()
      const intervalId = this.setContinuousLeftOrRight(override)
      override === 'left' ? newState.leftIntervalId = intervalId : newState.rightIntervalId = intervalId
      
    }

    if (this.appState.fallIntervalId === null) {
      newState.fallIntervalId = this.setContinuousFallEvent()
    }

    // If state hasn't changed, don't set state.
    if (Object.keys(newState).length === 0) {
      return
    }
    
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  setAutoRepeatDelayTimeout() {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300)
  }

  unsetAutoRepeatDelayTimeoutId() {
    const newState = {} as appStateIF
    newState.autoRepeatDelayTimeoutId = null
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  setContinuousLeftOrRight(direction: string) {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), this.appState.fallSpeed)
  }

  continuousFallEvent() {
    
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
    
    // This catches a case where the 15 move extension has depleted and the Tetrimino freezes in place during falling phase
    // TODO: DETERMINE IF THIS IS NEEDED
    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }

  continuousLeftOrRight(playerAction: string) {

    if (this.appState.autoRepeatDelayTimeoutId) { 
      return 
    }

    const { playfield, currentTetrimino } = this.appState

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(playerAction, playfield, currentTetrimino)
    
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