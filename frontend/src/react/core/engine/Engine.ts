import { LevelGoals } from '../level-goals/LevelGoals'
import { ScoringHandlerFactory } from '../scoring/ScoringHandlerFactory'
import { NextQueue } from '../next-queue/NextQueue'
import { InGamePlayerControl } from '../player-control/InGamePlayerControl'
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
import SoundEffects from '../audio/SoundEffects'
import BackgroundMusic from '../audio/BackgroundMusic'
import { GamePhases, InitialOptions, SharedHandlersMap } from 'multiplayer-tetris-types/frontend'
import { AppState } from 'multiplayer-tetris-types/frontend/shared'
import { Dispatch } from 'redux'

export class Engine {

  public inGamePlayerControl: InGamePlayerControl
  public soundEffects: SoundEffects
  public backgroundMusic: BackgroundMusic
  private tetriminoMovementHandlersMap: Map<string, any>
  private phases: GamePhases
  private currentPhaseName: string
  private currentPhase: BasePhase

  constructor(initialOptions: InitialOptions) {

    this.tetriminoMovementHandlersMap = new Map([
      ['classic', ClassicRotationSystem],
      ['super', SuperRotationSystem] 
    ])

    const tetriminoMovementHandler = this.setTetriminoMovementHandler(initialOptions.rotationSystem)
    const scoringHandler = ScoringHandlerFactory.loadScoringHandler(initialOptions.scoringSystem) 
    const levelGoalsHandler = this.setLevelGoalsHandler(initialOptions.levelGoalsSystem)
    const nextQueueHandler = new NextQueue()
    const holdQueueHandler = new HoldQueue()

    const sharedHandlers: SharedHandlersMap = {
      tetriminoMovementHandler,
      scoringHandler,
      levelGoalsHandler,
      nextQueueHandler,
      holdQueueHandler,
    }

    this.phases = {
      off: new Off(sharedHandlers),
      pregame: new Pregame(sharedHandlers),
      generation: new Generation(sharedHandlers),
      falling: this.setFallingPhase(initialOptions.lockMode, sharedHandlers),
      lock: this.setLockPhase(initialOptions.lockMode, sharedHandlers),
      pattern: new Pattern(sharedHandlers, initialOptions.possibleActivePatterns),
      updateScore: new UpdateScore(sharedHandlers),
      animate: new Animate(sharedHandlers),
      eliminate: new Eliminate(sharedHandlers),
      completion: new Completion(sharedHandlers),
      iterate: new Iterate(sharedHandlers),
      gameOver: new GameOver(sharedHandlers)
    }
    
    this.inGamePlayerControl = new InGamePlayerControl(sharedHandlers)
    this.currentPhaseName = 'pregame'
    this.currentPhase = this.phases.pregame
  }

  handleGameStateUpdate(gameState: AppState['gameState'], dispatcher: Dispatch) {
    const { currentGamePhase } = gameState
    if (this.currentPhaseName !== currentGamePhase) {
      this.setCurrentPhaseName(currentGamePhase)
      this.setCurrentPhase(currentGamePhase)
    }
    this.currentPhase.execute(gameState, dispatcher)
  }

  setTetriminoMovementHandler(mode: string) {
    const ctor = this.tetriminoMovementHandlersMap.get(mode)
    return new ctor()
  }

  setFallingPhase(mode: string, sharedHandlers: SharedHandlersMap) {
    if (mode === 'classic') {
      return new FallingClassic(sharedHandlers)
    } else if (mode === 'extended') {
      return new FallingExtended(sharedHandlers)
    } else if (mode === 'infinite') {
      return new FallingInfinite(sharedHandlers)
    }
  }

  setLockPhase(mode: string, sharedHandlers: SharedHandlersMap) {
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
    this.currentPhase = this.phases[phase as keyof GamePhases]
  }

  setCurrentPhaseName(phaseName: string) {
    this.currentPhaseName = phaseName
  }

}