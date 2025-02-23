import { BaseScoringHandler, OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory.js";
import trail from "../../../tetrimino/trail/Trail.js";
import FallingPhase from "./Falling.js";
import TimerManager from "../../../timerManager/TimerManager.js";

export default class FallingClassic extends FallingPhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler, scoringHandler, timerManager)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  continuousFallEvent(dispatch: Dispatch): void {
    const gameState = this.currGameState

    const newGameState = {} as OnePlayerLocalGameState
    const { playfield, currentTetrimino } = gameState
    // const fallInterval = this.timerManager.getId('fallInterval')

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
        this.timerManager.clear('fallInterval')
        newGameState.currentGamePhase = 'lock'
      }

    }

    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }


}