import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory";
import trail from "../../../tetrimino/trail/Trail";
import FallingPhase from "./Falling";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";

export default class FallingClassic extends FallingPhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  continuousFallEvent(dispatch: Dispatch): void {
    const gameState = this.currGameState

    const newGameState = {} as LocalGameState
    const { playfield, currentTetrimino, fallIntervalId } = gameState

    // Get info on where the tetrimino will be if moved one square down from curren tposition
    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)


    // If the Tetrimino can move down one row, update state with its new position
    if (successfulMove)  {

      // Handle softdrop scoring
      if (gameState.playerAction.softdrop) {
        const scoreItem = this.scoreItemFactory.getItem('softdrop', gameState, null)
        newGameState.totalScore = this.scoringHandler.updateScore(gameState.totalScore, scoreItem)
      }

      newGameState.currentTetrimino = newTetrimino
      newGameState.playfield = newPlayfield
      newGameState.performedTSpin = false 
      newGameState.performedTSpinMini = false
      newGameState.postLockMode = false

      if (gameState.playerAction.softdrop) {
        newGameState.playfieldOverlay = trail.addToSoftdropTrail(newTetrimino, gameState.playfieldOverlay)
      }

      // If new Tetrimino location has reached a surface, trigger lock phase
      const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', newPlayfield, newTetrimino)
      const tetriminoWillHaveReachedSurface = !successfulMove

      if (tetriminoWillHaveReachedSurface) {

        if (gameState.playerAction.softdrop) {
          newGameState.playfield = newPlayfield
        }
        clearInterval(fallIntervalId)
        newGameState.fallIntervalId = null
        newGameState.currentGamePhase = 'lock'
      }

    }

    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }


}