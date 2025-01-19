import { appStateIF, autoRepeatIF, eventDataIF } from "../../../types"

export default function actionLeftAndRight(eventData: eventDataIF) {
  let { playerAction, playfield, currentTetrimino } = this.appState
  const { autoRepeat } = playerAction
  let { override } = autoRepeat
  const { strokeType, action, currKeystrokes } = eventData
  
  const newState = {} as appStateIF

  newState.playerAction = this.appState.playerAction

  if (strokeType === 'keyup') {
    clearInterval(this.appState[`${action}IntervalId`])
    if (this.appState.autoRepeatDelayTimeoutId) {
      clearTimeout(this.appState.autoRepeatDelayTimeoutId)
    }

    newState.playerAction.autoRepeat.override = null

    action === 'left' ? newState.leftIntervalId = null : newState.rightIntervalId = null
    action === 'left' ? newState.playerAction.autoRepeat.left = false : newState.playerAction.autoRepeat.right = false  
  }


  // Determine what action will be taken.  Override always determines this.
  if (strokeType === 'keydown') {

    // console.log(currKeystrokes.has('softdrop'))

    if (this.appState.playerAction.autoRepeat[action] && override === action) {
      return
    }

    const oppositeAction = action === 'left' ? 'right' : 'left'

    // If there is a preexisting action in motion and override will switch to opposite action
    if (this.appState[`${oppositeAction}IntervalId`]) {
      clearInterval(this.appState[`${oppositeAction}IntervalId`])
      newState[`${oppositeAction}IntervalId`] = null
    }

    if (action === 'left') {
      newState.playerAction.autoRepeat.left = true  
    } else if (action === 'right') {
      newState.playerAction.autoRepeat.right = true
    }
    newState.playerAction.autoRepeat.override = newState.playerAction.autoRepeat[oppositeAction] ? action : null
  } 

  // Execute the action if there is an action to be executed
  if (newState.playerAction.autoRepeat.override 
    || newState.playerAction.autoRepeat.left 
    || newState.playerAction.autoRepeat.right
  ) {

    const { override, left } = newState.playerAction.autoRepeat
    let direction = override ? override : (left ? 'left' : 'right')

    if (this.appState.ghostTetriminoOn) {
      playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(this.appState.ghostCoords, playfield)
    }

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(direction, playfield, currentTetrimino)
  
    if (successfulMove)  {
      this.soundEffects.play('tetriminoMove')
      
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
    }
  
  }

  this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
}
