import { AppState, BaseScoringHandler, OnePlayerLocalGameState, Tetrimino, TetriminoMovementHandler } from "multiplayer-tetris-types";
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux";
import { Dispatch } from "redux";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory.js";
import trail from "../../../tetrimino/trail/Trail.js";
import FallingPhase from "./Falling.js";
import TimerManager from "../../../timerManager/TimerManager.js";

export default class FallingExtended extends FallingPhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler, scoringHandler, timerManager)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  protected continuousFallEvent(dispatch: Dispatch) {
    const gameState = this.currGameState

    let newGameState = {} as OnePlayerLocalGameState
    const { playfield, currentTetrimino } = gameState

    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    // If the Tetrimino can move down one row, update state with its new position
    successfulMove ? this.moveTetriminoDownOneRow(gameState, dispatch, newGameState, newTetrimino, newPlayfield) : this.handleExtensionDepletion(gameState, dispatch, newGameState)  
  }

  protected moveTetriminoDownOneRow(gameState: OnePlayerLocalGameState, dispatch: Dispatch, newGameState: OnePlayerLocalGameState, newTetrimino: Tetrimino, newPlayfield: string[][]) {
    newGameState.currentTetrimino = newTetrimino
    newGameState.playfield = newPlayfield
    newGameState.performedTSpin = false 
    newGameState.performedTSpinMini = false
    newGameState.postLockMode = false

    if (gameState.playerAction.softdrop) {
      newGameState.playfieldOverlay = trail.addToSoftdropTrail(newTetrimino, gameState.playfieldOverlay)
    }

    newGameState = this.handleSoftDropScoring(gameState, newGameState)
    newGameState = this.checkForLockExtensionReset(gameState, newGameState, newTetrimino)
    newGameState = this.checkForLockTrigger(gameState, newGameState, newTetrimino, newPlayfield)
    
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }

  protected handleSoftDropScoring(gameState: OnePlayerLocalGameState, newGameState: OnePlayerLocalGameState): OnePlayerLocalGameState {
    if (gameState.playerAction.softdrop) {
      const scoreItem = this.scoreItemFactory.getItem('softdrop', gameState, null)
      newGameState.totalScore = this.scoringHandler.updateScore(gameState.totalScore, scoreItem)
    }
    return newGameState
  }

  // If new tetrimino row is the newest low, update the newest low and reset the extended move count
  protected checkForLockExtensionReset(gameState: OnePlayerLocalGameState, newGameState: OnePlayerLocalGameState, newTetrimino: Tetrimino) {
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
    if (newTetriminoBaseRowIdx > gameState.lowestLockSurfaceRow) {
      newGameState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
      newGameState.extendedLockdownMovesRemaining = 15
    }
    return newGameState
  }

  // If new Tetrimino location has reached a surface, trigger lock phase
  protected checkForLockTrigger(gameState: OnePlayerLocalGameState, newGameState: OnePlayerLocalGameState, newTetrimino: Tetrimino, newPlayfield: string[][]): OnePlayerLocalGameState {
    const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', newPlayfield, newTetrimino)
    const tetriminoWillHaveReachedSurface = !successfulMove

    if (tetriminoWillHaveReachedSurface) {
      if (gameState.playerAction.softdrop) {
        newGameState.playfield = newPlayfield
      } 

      this.timerManager.clear('fallInterval')
      newGameState.currentGamePhase = 'lock'
    }
    
    return newGameState
  }
  
  
  
  
  // This catches a case where the 15 move extension has depleted and the Tetrimino freezes in place during falling phase
  protected handleExtensionDepletion(gameState: OnePlayerLocalGameState, dispatch: Dispatch, newGameState: OnePlayerLocalGameState) {
    this.timerManager.clear('fallInterval')
    newGameState.currentGamePhase = 'lock'
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }



}