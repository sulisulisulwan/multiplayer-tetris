import * as React from 'react'
import { Engine } from './core/engine/Engine'

import { appStateIF, setAppStateIF, soundEffectsIF } from './types'
import { makeCopy } from './core/utils/utils'

// import { TestPlayfields } from '../__tests__/test-playfields/testPlayfields'
import { getView } from './getView'
import { musicConfig, soundEffectsConfig, soundEffectsConfigIF } from './soundEffectsToSet'
import { getBackgrounds } from './getBackgrounds'

// const newTestPlayfields = new TestPlayfields()


class App extends React.Component<{}, appStateIF> {

  readonly backgrounds: { [key: string]: Function }
  private engine: Engine | null
  public soundEffects: soundEffectsIF
  public backgroundMusic: soundEffectsIF

  constructor(props: appStateIF) {
    super(props)
    this.state = {

      gameOptions: null,
      view: 'mainMenu',

      currentTetrimino: null,
      playfield: this.getInitialPlayfield(),
      // playfield: newTestPlayfields.backToBackTSpin,

      gameMode: 'classic',
      nextQueue: null,
      holdQueue: {
        swapStatus: 'swapAvailableNow',
        heldTetrimino: null,
        available: true
      },

      currentGamePhase: 'off',

      playerAction: {
        autoRepeat: {
          left: false,
          right: false,
          override: null,
        },
        softdrop: false,
        harddrop: false,
        flipClockwise: false,
        flipCounterClockwise: false,
        hold: false
      },

      rightIntervalId: null,
      leftIntervalId: null,
      
      autoRepeatDelayTimeoutId: null,
      fallIntervalId: null,

      pregameCounter: 1, // This should be 2
      pregameIntervalId: null,

      lockTimeoutId: null,
      extendedLockdownMovesRemaining: 15,
      lowestLockSurfaceRow: null,
      postLockMode: false,

      currentLevel: 1,

      patternItems: [],
      scoreItems: [],
      levelClearedLinesGoal: 5, // this is a fixed goal system
      fallSpeed: 1000,
      totalLinesCleared: 0,
      totalScore: 0,
      performedTSpin: false,
      performedTSpinMini: false,
      backToBack: false,
      
      scoringHistoryPerCycle: {},

      // ghostTetriminoOn: false,
      ghostCoords: []
    }

    this.backgrounds = getBackgrounds()

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)    
    this.engine = null

  }

  setEngine() {
    const gameOptions = makeCopy(this.state.gameOptions)
    gameOptions.setAppState = this.setState.bind(this) as setAppStateIF
    this.engine = new Engine(gameOptions)
  }

  getInitialPlayfield() {
    const initialPlayfield = new Array(40).fill(null)
    return initialPlayfield.map(row => new Array(10).fill('[_]', 0, 10))
  }

  startQuitClickHandler(e: Event): void {
    e.preventDefault()
    // may in the future implement "countdown" gamePhase
    this.state.currentGamePhase === 'off' ?
      this.setState({ currentGamePhase: 'pregame', }) : this.setState({ currentGamePhase: 'off' })
  } 

  handlePlayerKeyStroke(e: any) {
    // e.preventDefault()
    if (this.state.view === 'gameActive') {
      this.engine.playerControl.keystrokeHandler(this.state, e)
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() { 

    if (this.state.view === 'loadGame') {
      this.setEngine()
      this.engine.soundEffects.addSoundsToDOM()
      this.engine.backgroundMusic.addSoundsToDOM()
      this.engine.backgroundMusic.setTrack(this.state.gameOptions.backgroundMusic)
      this.setState({ 
        currentLevel: this.state.gameOptions.startingLevel,
        view: 'gameActive'
      })
    }

    if (this.state.view === 'gameActive') {
      this.engine.handleGameStateUpdate(this.state)
    }

  }

  setMusic() {
    this.engine
  }

  setBackground(view: string): void {
    let activateBackground = this.backgrounds[view]
    activateBackground()
  }

  getView() {
    const getter = getView.bind(this)
    return getter()
  }

  render() {
    
    // We need a better way to call setBackground.  What if we want to change it, say, when the player levels up?
    if (this.state.currentGamePhase === 'off') {
      this.setBackground(this.state.view)
    }
    
    return (
      <div>
        { this.getView() }
      </div>
    )
  }
} 



export default App