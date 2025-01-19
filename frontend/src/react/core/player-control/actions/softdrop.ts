import { appStateIF, eventDataIF, tetriminoIF } from '../../../types'
import { makeCopy } from '../../utils/utils'
// import trailHandler from '../../tetrimino/trail/Trail'

export default function actionSoftdrop(eventData: eventDataIF) {
    
  const { strokeType } = eventData
  const { softdrop } = this.appState.playerAction
  const { playfield, currentTetrimino } = this.appState as appStateIF

  const newState = {} as appStateIF
  if (strokeType === 'keyup')  {
    // const newPlayfield = trailHandler.clearSoftdropTrail(playfield)
    // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
    clearInterval(this.appState.fallIntervalId)
    newState.playfield = playfield
    // newState.playfield = newPlayfield
    newState.fallIntervalId = null
    newState.fallSpeed = this.appState.fallSpeed / .02
    newState.playerAction = this.appState.playerAction
    newState.playerAction.softdrop = false

    this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
    return
  }


  if (strokeType === 'keydown')  {
    if (softdrop) {
      // const newPlayfield = trailHandler.clearSoftdropTrail(playfield)
      // this.setAppState((prevState: appStateIF) => ({ ...prevState, playfield: newPlayfield}))
      // continue in the engine
      // Let softdrop 
      return
    }


    const newState = makeCopy(this.appState)
    let { newPlayfield, newTetrimino } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    
    // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
    clearInterval(this.appState.fallIntervalId)
    newState.fallIntervalId = null
    newState.fallSpeed = this.appState.fallSpeed * .02
    newState.playfield = newPlayfield
    newState.currentTetrimino = newTetrimino
    newState.playerAction.softdrop = true
    // SEE Falling phase in Engine Phases for handling score updating
    this.setAppState((prevState: any) => ({ ...prevState, ...newState}))
    return
  }

}