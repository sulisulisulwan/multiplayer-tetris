import { eventDataIF } from '../../../types'
import { makeCopy } from '../../utils/utils'

export default function actionFlip(eventData: eventDataIF) {
  
  const { strokeType, action } = eventData

  if (strokeType === 'keydown' && this.appState.playerAction[action]) {
    return
  }

  const newState = makeCopy(this.appState)
  let { playfield, currentTetrimino } = newState

  if (strokeType === 'keyup') {
    newState.playerAction[action] = false
    this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
    return
  }
  
  // Remove the ghost tetrimino if that mode is on
  if (this.appState.ghostTetriminoOn) {
    playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(this.appState.ghostCoords, playfield)
  }

  const { 
    newPlayfield, 
    newTetrimino,
    performedTSpin,
    performedTSpinMini 
  } = this.tetriminoMovementHandler[action](playfield, currentTetrimino)

  newState.scoringItemsForCompletion = this.appState.scoringItemsForCompletion

  if (performedTSpin) {
    const scoreItem = this.scoreItemFactory.getItem('tSpinNoLineClear', this.appState)
    newState.scoreItems.push(scoreItem)
  }

  if (performedTSpinMini) {
    const scoreItem = this.scoreItemFactory.getItem('tSpinNoLineClear', this.appState)
    newState.scoreItems.push(scoreItem)
  }


  newState.performedTSpinMini = performedTSpinMini
  newState.performedTSpin = performedTSpin
  newState.playerAction[action] = true
  newState.currentTetrimino = newTetrimino

  if (this.appState.ghostTetriminoOn) {
    const newGhostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
    newState.ghostCoords = newGhostCoords
    newState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(newGhostCoords, newPlayfield, '[g]')
  } else {
    newState.playfield = newPlayfield
  }

  //TODO: This should account for movements that occur only after lockdown, not before.  This current logic will mistake pre lockdown scenarios as post lockdown
  // Think, at every point in time, the newTetriminoBaseRowIdx will === this.appState.lowestLockSurfaceRow
  const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
  if (
    newTetriminoBaseRowIdx <= this.appState.lowestLockSurfaceRow && 
    this.appState.postLockMode &&
    this.appState.extendedLockdownMovesRemaining > 0
    ) {
    clearTimeout(this.appState.lockTimeoutId)
    newState.lockTimeoutId = null
    newState.extendedLockdownMovesRemaining = this.appState.extendedLockdownMovesRemaining - 1
  }

  this.soundEffects.play('tetriminoMove')

  this.setAppState((prevState: any) => ({ ...prevState, ...newState}))

}


