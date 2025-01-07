import BasePhase from "../BasePhase";
import { makeCopy } from "../../../utils/utils";
import { appStateIF,sharedHandlersIF, tetriminoIF } from "../../../../types";

export default class LockExtended extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> LOCK EXTENDED PHASE')
    const newState = {} as appStateIF

    // First check that extended moves have been used up, and call for lockdown immediately if it's the case
    if (this.appState.extendedLockdownMovesRemaining <= 0) {
      this.lockDownTimeout()
      return
    }

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), set the lockdown timer
    if (!this.appState.lockTimeoutId) {

      newState.postLockMode = true
      newState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500)
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

    // Lockdown timer had already been set, extended moves still exist, and player has made a change, 
    // so check if player has positioned the tetrimino to escape lock phase
    const tetriminoCopy = makeCopy(this.appState.currentTetrimino)
    const playfieldCopy = makeCopy(this.appState.playfield)

    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    //If tetrimino can fall, cancel the lockdown timer and enter Fall phase
    if (targetCoordsClear) {
      clearTimeout(this.appState.lockTimeoutId)
      newState.currentGamePhase = 'falling'
      newState.lockTimeoutId = null
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

    // Otherwise, the lockdown timer is still ticking... Handle autorepeat player motions..
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

    if (Object.keys(newState).length === 0) {
      return
    }
    
    this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }


  lockDownTimeout() {

    // Lockdown timer has run out, so we clear the timer..
    clearTimeout(this.appState.lockTimeoutId)

    const tetriminoCopy = makeCopy(this.appState.currentTetrimino)
    const playfieldCopy = makeCopy(this.appState.playfield)
    
    const newState = {} as appStateIF
    newState.currentTetrimino = tetriminoCopy
    newState.lockTimeoutId = null
    newState.playfield = this.appState.playfield

    // Final check if tetrimino should be granted falling status before permanent lock
    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)
    
    if (targetCoordsClear) {
      // Grant falling status if there is no surface below.
      newState.currentGamePhase = 'falling',
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

    newState.currentTetrimino.status = 'locked'
    this.soundEffects.play('tetriminoLand')
    
    if (this.gameIsOver(tetriminoCopy)) {
      clearTimeout(this.appState.lockTimeoutId)
      newState.lockTimeoutId = null
      newState.currentGamePhase = 'gameOver'
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

    newState.currentGamePhase = 'pattern',
    newState.postLockMode = false
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  gameIsOver(currentTetrimino: tetriminoIF) {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
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

  continuousLeftOrRight(playerAction: string) {

    if (this.appState.autoRepeatDelayTimeoutId) { 
      return 
    }

    const { playfield, currentTetrimino } = this.appState
    const newState = {} as appStateIF

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(playerAction, playfield, currentTetrimino)
    
    if (successfulMove)  {
      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

  }

}


      