import { LocalGameState, SharedHandlersMap, Tetrimino } from "multiplayer-tetris-types/frontend";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import ScoreItemFactory from "../../../scoring/ScoreItemFactory";
import trail from "../../../tetrimino/trail/Trail";
import FallingPhase from "./Falling";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../../redux/reducers/gameState";

export default class FallingExtended extends FallingPhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  protected continuousFallEvent(dispatch: Dispatch) {
    const gameState = this.currGameState

    let newGameState = {} as LocalGameState
    const { playfield, currentTetrimino } = gameState

    let { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    // If the Tetrimino can move down one row, update state with its new position
    successfulMove ? this.moveTetriminoDownOneRow(gameState, dispatch, newGameState, newTetrimino, newPlayfield) : this.handleExtensionDepletion(gameState, dispatch, newGameState)  
  }

  protected moveTetriminoDownOneRow(gameState: AppState['gameState'], dispatch: Dispatch, newGameState: LocalGameState, newTetrimino: Tetrimino, newPlayfield: string[][]) {
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
    
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }

  protected handleSoftDropScoring(gameState: AppState['gameState'], newGameState: LocalGameState): LocalGameState {
    if (gameState.playerAction.softdrop) {
      const scoreItem = this.scoreItemFactory.getItem('softdrop', gameState, null)
      newGameState.totalScore = this.scoringHandler.updateScore(gameState.totalScore, scoreItem)
    }
    return newGameState
  }

  // If new tetrimino row is the newest low, update the newest low and reset the extended move count
  protected checkForLockExtensionReset(gameState: AppState['gameState'], newGameState: LocalGameState, newTetrimino: Tetrimino) {
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
    if (newTetriminoBaseRowIdx > gameState.lowestLockSurfaceRow) {
      newGameState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
      newGameState.extendedLockdownMovesRemaining = 15
    }
    return newGameState
  }

  // If new Tetrimino location has reached a surface, trigger lock phase
  protected checkForLockTrigger(gameState: AppState['gameState'], newGameState: LocalGameState, newTetrimino: Tetrimino, newPlayfield: string[][]): LocalGameState {
    const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', newPlayfield, newTetrimino)
    const tetriminoWillHaveReachedSurface = !successfulMove

    if (tetriminoWillHaveReachedSurface) {
      if (gameState.playerAction.softdrop) {
        newGameState.playfield = newPlayfield
      } 

      clearInterval(gameState.fallIntervalId)
      newGameState.fallIntervalId = null
      newGameState.currentGamePhase = 'lock'
    }

    return newGameState
  }




  // This catches a case where the 15 move extension has depleted and the Tetrimino freezes in place during falling phase
  protected handleExtensionDepletion(gameState: AppState['gameState'], dispatch: Dispatch, newGameState: LocalGameState) {
    clearInterval(gameState.fallIntervalId)
    newGameState.fallIntervalId = null
    newGameState.currentGamePhase = 'lock'
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }



}