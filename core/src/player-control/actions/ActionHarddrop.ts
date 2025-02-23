import { AppState, BaseScoringHandler, EventData, OnePlayerLocalGameState, TetriminoMovementHandler } from "multiplayer-tetris-types"
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux"
import { Dispatch } from "redux"
import ScoreItemFactory from "../../scoring/ScoreItemFactory.js"
import { makeCopy } from "../../utils/utils.js"
import BaseAction from './BaseAction.js'
import TimerManager from "../../timerManager/TimerManager.js"

export default class ActionHarddrop extends BaseAction {

  private scoreItemFactory: ScoreItemFactory
  private scoringHandler: BaseScoringHandler
  private timerManager: TimerManager

  constructor(tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {
    super(tetriminoMovementHandler)
    this.scoreItemFactory = new ScoreItemFactory()
    this.scoringHandler = scoringHandler
    this.timerManager = timerManager
  }

  execute(
    gameState: OnePlayerLocalGameState,
    dispatch: Dispatch,
    eventData: EventData
  ) {
    const { strokeType } = eventData

    if (strokeType === 'keydown' && gameState.playerAction.harddrop) {
      return
    }
    const newGameState = makeCopy(gameState)
  
    if (strokeType === 'keyup') {
      newGameState.playerAction.harddrop = false
      return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
    }
  
    let { playfield, currentTetrimino } = newGameState
  
    //Remove the ghost tetrimino
    if (gameState.gameOptions.ghostTetriminoOn) {
      playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield)
    }
  
    const harddroppedTetrimino = this.tetriminoMovementHandler.getProjectedLandedTetrimino(playfield, currentTetrimino)
    const harddroppedTetriminoCoords = this.tetriminoMovementHandler.getPlayfieldCoords(harddroppedTetrimino)
    const currentTetriminoCoords = this.tetriminoMovementHandler.getPlayfieldCoords(currentTetrimino)
  
    const linesDropped = harddroppedTetriminoCoords[0][0] - currentTetriminoCoords[0][0]
  
    const scoreItem = this.scoreItemFactory.getItem('harddrop', gameState, { linesDropped })
    newGameState.totalScore = this.scoringHandler.updateScore(gameState.totalScore, scoreItem)
  
    this.timerManager.clear('fallInterval')
    newGameState.playerAction.harddrop = true
    newGameState.currentGamePhase = 'pattern'
    newGameState.playfield = this.tetriminoMovementHandler.moveTetriminoOnPlayfield(currentTetriminoCoords, harddroppedTetriminoCoords, playfield, currentTetrimino.minoGraphic)
    newGameState.currentTetrimino = harddroppedTetrimino
  
    dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }
}
