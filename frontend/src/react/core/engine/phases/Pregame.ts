import { appStateIF, sharedHandlersIF } from "../../../types";
import BasePhase from "./BasePhase";



export default class Pregame extends BasePhase {
  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  // TODO: This phase should load in all of the options. Take into account default options
  execute() {
    // console.log('>>> PREGAME PHASE')
    if (this.appState.pregameIntervalId === null) {
      const newState = {} as appStateIF

      this.backgroundMusic.play()

      newState.pregameIntervalId = setInterval(this.pregameIntervalEvent.bind(this), 0)
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
    }
      
  }

  pregameIntervalEvent() {
    const newState = {} as appStateIF
    if (this.appState.pregameCounter === 1) {
      clearInterval(this.appState.pregameIntervalId)
      newState.pregameIntervalId = null
      newState.currentGamePhase = 'generation'
      this.setAppState((prevState) => ({ ...prevState, ...newState}))
    }
    newState.pregameCounter = this.appState.pregameCounter - 1
    
    this.setAppState((prevState) => ({ ...prevState, ...newState}))
  }

}