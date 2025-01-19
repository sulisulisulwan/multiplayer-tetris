import { makeCopy } from "../../../utils/utils";
import { appStateIF, sharedHandlersIF, tetriminoIF } from "../../../../types";
import TetriminoActivePhase from "../TetriminoActivePhase";

export default class LockInfinite extends TetriminoActivePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> LOCK INFINITE PHASE')
    let newState = {} as appStateIF

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), set the lockdown timer
    if (!this.appState.lockTimeoutId) {

      newState.postLockMode = true
      newState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500)
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
      return
    }

    // Lockdown timer had already been set and player has made a change, 
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

    // Otherwise, the lockdown timer is still ticking... Handle player motions..
    newState = this.handleAutorepeatActions(newState)

    if (Object.keys(newState).length === 0) return
    
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
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

  gameIsOver(currentTetrimino: tetriminoIF) {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
  }

}


      