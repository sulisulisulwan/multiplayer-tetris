import { appStateIF, eventDataIF } from "../../../types"

export default function actionHold(eventData: eventDataIF) {

  const { strokeType } = eventData

  // If player is holding down key after initial press, negate keydown event fires
  if (strokeType === 'keydown' && this.appState.playerAction.hold) {
    return
  }

  let { swapStatus } = this.appState.holdQueue
  if (swapStatus === 'swapAvailableNextTetrimino') {
    return
  }

  const newState = {} as appStateIF
  newState.playerAction = this.appState.playerAction

  if (strokeType === 'keyup') {
    newState.playerAction.hold = false
    this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
  }
  /**
   * Two swapStatus states exist:
   *   'swapAvailableNow' (default) - Hitting swap key will trigger swap
   *   'justSwapped' - Interim state between hold event and the Generation phase it triggers
   *   'swapAvailableNextTetrimino' - State during the falling phase of the generatec tetrimino after swap occured 
   */

  if (swapStatus === 'swapAvailableNow') {

    let { heldTetrimino } = this.appState.holdQueue
    let { currentTetrimino, playfield } = this.appState

    // Remove the ghost tetrimino
    if (this.appState.ghostTetriminoOn) {
      playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(this.appState.ghostCoords, playfield)
    }

    // Remove the swapped out tetrimino from the playfield
    const currentTetriminoCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(currentTetrimino)
    newState.playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(currentTetriminoCoordsOnPlayfield, playfield)

    // Generate a new tetrimino of the current one to put in the hold queue
    newState.currentGamePhase = 'generation'
    newState.playerAction.hold = strokeType === 'keyup' ? false : true
    newState.holdQueue = {
      swapStatus: 'justSwapped',
      heldTetrimino: this.tetriminoFactory.resetTetrimino(currentTetrimino),
      available: true
    }
    newState.currentTetrimino = heldTetrimino
    
    this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
    return
  }

  // For all other cases...
  newState.playerAction.hold = false
  this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
}
