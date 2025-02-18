import { SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { EventData } from "multiplayer-tetris-types/frontend/core"
import { AppState } from "multiplayer-tetris-types/frontend/shared"
import ScoreItemFactory from "../../scoring/ScoreItemFactory"
import { SharedScope } from "../../SharedScope"
import { makeCopy } from "../../utils/utils"
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState"
import { Dispatch } from "redux"

export default class ActionHarddrop extends SharedScope {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory()
  }

  execute(
    gameState: AppState['gameState'],
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
      return dispatch(updateMultipleGameStateFields({ ...newGameState }))
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
  
    clearTimeout(gameState.fallIntervalId)
    newGameState.fallIntervalId = null
    newGameState.playerAction.harddrop = true
    newGameState.currentGamePhase = 'pattern'
    newGameState.playfield = this.tetriminoMovementHandler.moveTetriminoOnPlayfield(currentTetriminoCoords, harddroppedTetriminoCoords, playfield, currentTetrimino.minoGraphic)
    newGameState.currentTetrimino = harddroppedTetrimino
  
    dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }
}
