import { appStateIF, sharedHandlersIF } from "../../../types"
import BasePhase from "./BasePhase"

export default class GameOver extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  execute() {
    // console.log('>>>> GAME OVER')

    const newState = {} as appStateIF
    // newState.currentGamePhase = 'gameover'
    // this.setAppState((prevState) => ({ ...prevState, ...newState}))

  }

}