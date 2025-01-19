import { appStateIF, sharedHandlersIF } from "../../../../types";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory";
import FallingPhase from "./Falling";

export default class FallingExtended extends FallingPhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
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
        /* TODO: 
        The reason for the trail bug is this:

        A mysterious phantom tetrimino pops up when we log the playfield to console.
        tap the softhold button intermittently, and at the point at which the lagging trail
        appears, a phantom tetrimino pops up on the log of the playfield in a position.
        Additionally, two trail row removals and additions go unlogged

        */

        const scoreItem = this.scoreItemFactory.getItem('softdrop', this.appState, null)
        newState.totalScore = this.scoringHandler.updateScore(this.appState.totalScore, scoreItem)
      }

      // If new tetrimino row is the newest low, update the newest low and reset the extended move count
      const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
      if (newTetriminoBaseRowIdx > this.appState.lowestLockSurfaceRow) {
        newState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
        newState.extendedLockdownMovesRemaining = 15
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
          newState.playfield = newPlayfield
        } 

        clearInterval(fallIntervalId)
        newState.fallIntervalId = null
        newState.currentGamePhase = 'lock'
      }

      this.setAppState((prevState) => {
        return { 
          ...this.appState, 
          ...newState
        }
      })
      return
    }


    // This catches a case where the 15 move extension has depleted and the Tetrimino freezes in place during falling phase
    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }


}