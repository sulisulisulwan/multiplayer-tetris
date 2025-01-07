import { LevelGoals } from '../level-goals/LevelGoals'
import { ScoringHandlerFactory } from '../scoring/ScoringHandlerFactory'
import { NextQueue } from '../next-queue/NextQueue'
import { PlayerControl } from '../player-control/PlayerControl'
import { ClassicRotationSystem } from '../tetrimino/movement-handler/rotation-systems/ClassicRS'
import { SuperRotationSystem } from '../tetrimino/movement-handler/rotation-systems/SuperRS'
import { 
  BasePhase,
  Pregame,
  Generation,
  FallingClassic,
  FallingExtended,
  FallingInfinite,
  LockClassic,
  LockExtended,
  LockInfinite,
  UpdateScore,
  Pattern,
  Iterate,
  Animate,
  Eliminate,
  Completion,
  Off,
  GameOver,
} from '.'
import { HoldQueue } from '../hold-queue/HoldQueue'
import { 
  initialOptionsIF,
  appStateIF,
  sharedHandlersIF,
  phasesIF,
  soundEffectsIF
} from '../../types'
import SoundEffects from '../audio/SoundEffects'
import BackgroundMusic from '../audio/Music'
import { allSoundEffects } from '../audio/allSoundEffects'
import { allBackgroundMusic } from '../audio/allBackgroundMusic'

export class Engine {

  public playerControl: PlayerControl
  public soundEffects: SoundEffects
  public backgroundMusic: BackgroundMusic
  private tetriminoMovementHandlersMap: Map<string, any>
  private phases: phasesIF
  private currentPhaseName: string
  private currentPhase: BasePhase

  constructor(initialOptions: initialOptionsIF) {

    this.tetriminoMovementHandlersMap = new Map([
      ['classic', ClassicRotationSystem],
      ['super', SuperRotationSystem] 
    ])

    const tetriminoMovementHandler = this.setTetriminoMovementHandler(initialOptions.rotationSystem)
    const scoringHandler = ScoringHandlerFactory.loadScoringHandler(initialOptions.scoringSystem) 
    const levelGoalsHandler = this.setLevelGoalsHandler(initialOptions.levelGoalsSystem)
    const setAppState = initialOptions.setAppState
    const nextQueueHandler = new NextQueue()
    const holdQueueHandler = new HoldQueue()
    const soundEffects = new SoundEffects(allSoundEffects, 'sound-effects')
    const backgroundMusic = new BackgroundMusic(allBackgroundMusic, 'background-music')

    const sharedHandlers: sharedHandlersIF = {
      tetriminoMovementHandler,
      scoringHandler,
      levelGoalsHandler,
      nextQueueHandler,
      holdQueueHandler,
      soundEffects,
      backgroundMusic,
      setAppState
    }

    this.phases = {
      off: new Off(sharedHandlers),
      pregame: new Pregame(sharedHandlers),
      generation: new Generation(sharedHandlers),
      falling: this.setFallingPhase(initialOptions.lockMode, sharedHandlers),
      lock: this.setLockPhase(initialOptions.lockMode, sharedHandlers),
      pattern: new Pattern(sharedHandlers, initialOptions.possibleActivePatterns),
      updateScore: new UpdateScore(sharedHandlers,),
      animate: new Animate(sharedHandlers),
      eliminate: new Eliminate(sharedHandlers),
      completion: new Completion(sharedHandlers),
      iterate: new Iterate(sharedHandlers),
      gameOver: new GameOver(sharedHandlers)
    }
    
    this.soundEffects = soundEffects
    this.backgroundMusic = backgroundMusic
    this.playerControl = new PlayerControl(sharedHandlers)
    this.currentPhaseName = 'off'
    this.currentPhase = this.phases.off


  }

  handleGameStateUpdate(stateData: appStateIF) {
    const { currentGamePhase } = stateData
    if (this.currentPhaseName !== stateData.currentGamePhase) {
      this.setCurrentPhaseName(currentGamePhase)
      this.setCurrentPhase(currentGamePhase)
    }
    this.currentPhase.syncToLocalState(stateData)
    this.currentPhase.execute()
  }

  setTetriminoMovementHandler(mode: string) {
    const ctor = this.tetriminoMovementHandlersMap.get(mode)
    return new ctor()
  }

  setFallingPhase(mode: string, sharedHandlers: sharedHandlersIF) {
    if (mode === 'classic') {
      return new FallingClassic(sharedHandlers)
    } else if (mode === 'extended') {
      return new FallingExtended(sharedHandlers)
    } else if (mode === 'infinite') {
      return new FallingInfinite(sharedHandlers)
    }
  }

  setLockPhase(mode: string, sharedHandlers: sharedHandlersIF) {
    if (mode === 'classic') {
      return new LockClassic(sharedHandlers)
    } else if (mode === 'extended') {
      return new LockExtended(sharedHandlers)
    } else if (mode === 'infinite') {
      return new LockInfinite(sharedHandlers)
    }
  }

  setLevelGoalsHandler(mode: string) {
    return new LevelGoals(mode)
  }

  setCurrentPhase(phase: string) {
    this.currentPhase = this.phases[phase as keyof phasesIF]
  }

  setCurrentPhaseName(phaseName: string) {
    this.currentPhaseName = phaseName
  }

}