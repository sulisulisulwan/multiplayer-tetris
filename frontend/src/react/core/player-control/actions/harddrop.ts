import { eventDataIF } from '../../../types'
import { makeCopy } from '../../utils/utils'

export default function actionHarddrop(eventData: eventDataIF) {

  console.log('here')
  const { strokeType } = eventData

  if (strokeType === 'keydown' && this.appState.playerAction.harddrop) {
    return
  }
  const newState = makeCopy(this.appState)

  if (strokeType === 'keyup') {
    newState.playerAction.harddrop = false
    this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
    return
  }

  let { playfield, currentTetrimino } = newState

  //Remove the ghost tetrimino
  if (this.appState.ghostTetriminoOn) {
    playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(this.appState.ghostCoords, playfield)
  }

  const harddroppedTetrimino = this.tetriminoMovementHandler.getProjectedLandedTetrimino(playfield, currentTetrimino)
  const harddroppedTetriminoCoords = this.tetriminoMovementHandler.getPlayfieldCoords(harddroppedTetrimino)
  const currentTetriminoCoords = this.tetriminoMovementHandler.getPlayfieldCoords(currentTetrimino)

  const linesDropped = harddroppedTetriminoCoords[0][0] - currentTetriminoCoords[0][0]

  console.log('linesDropped', linesDropped)
  const scoreItem = this.scoreItemFactory.getItem('harddrop', this.appState, { linesDropped })
  newState.totalScore = this.scoringHandler.updateScore(this.appState.totalScore, scoreItem)

  clearTimeout(this.appState.fallIntervalId)
  newState.fallIntervalId = null
  newState.playerAction.harddrop = true
  newState.currentGamePhase = 'pattern'
  newState.playfield = this.tetriminoMovementHandler.moveTetriminoOnPlayfield(currentTetriminoCoords, harddroppedTetriminoCoords, playfield, currentTetrimino.minoGraphic)
  newState.currentTetrimino = harddroppedTetrimino

  this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
}