import { appStateIF, sharedHandlersIF } from "../../../../types";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory";
import FallingPhase from "./Falling";

export default class FallingClassic extends FallingPhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  continuousFallEvent(): void {
    
    const newState = {} as appStateIF
    const { playfield, currentTetrimino, fallIntervalId } = this.appState

    // Get info on where the tetrimino will be if moved one square down from curren tposition
    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)


    // If the Tetrimino can move down one row, update state with its new position
    if (successfulMove)  {

      // Handle softdrop scoring
      if (this.appState.playerAction.softdrop) {
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
          newState.playfield = newPlayfield
        }
        clearInterval(fallIntervalId)
        newState.fallIntervalId = null
        newState.currentGamePhase = 'lock'
      }

    }

    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }


}