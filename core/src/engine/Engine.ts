import { BaseScoringHandler, GamePhases, InitialOptions, TetriminoMovementHandler } from 'multiplayer-tetris-types'
import { Dispatch } from 'redux'
import { LevelGoals } from '../level-goals/LevelGoals.js'
import { ScoringHandlerFactory } from '../scoring/ScoringHandlerFactory.js'
import { NextQueue } from '../next-queue/NextQueue.js'
import { ClassicRotationSystem } from '../tetrimino/movement-handler/rotation-systems/ClassicRS.js'
import { SuperRotationSystem } from '../tetrimino/movement-handler/rotation-systems/SuperRS.js'
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
} from './index.js'
import { HoldQueue } from '../hold-queue/HoldQueue.js'
import TimerManager from '../timerManager/TimerManager.js'
import { OnePlayerLocalGameState } from 'multiplayer-tetris-types/frontend/core/index.js'

export class Engine {

  private tetriminoMovementHandlersMap: Map<string, any>
  private phases: GamePhases
  private currentPhaseName: string
  private currentPhase: BasePhase

  constructor(initialOptions: InitialOptions, timerManager: TimerManager) {

    this.tetriminoMovementHandlersMap = new Map([
      ['classic', ClassicRotationSystem],
      ['super', SuperRotationSystem] 
    ])

    const tetriminoMovementHandler = this.setTetriminoMovementHandler(initialOptions.rotationSystem)
    const scoringHandler = ScoringHandlerFactory.loadScoringHandler(initialOptions.scoringSystem) 
    const levelGoalsHandler = this.setLevelGoalsHandler(initialOptions.levelGoalsSystem)
    const nextQueueHandler = new NextQueue()
    const holdQueueHandler = new HoldQueue()
    

    this.phases = {
      off: new Off(),
      pregame: new Pregame(levelGoalsHandler),
      generation: new Generation(tetriminoMovementHandler, nextQueueHandler),
      falling: this.setFallingPhase(initialOptions.lockMode, tetriminoMovementHandler, scoringHandler, timerManager),
      lock: this.setLockPhase(initialOptions.lockMode, tetriminoMovementHandler, timerManager),
      pattern: new Pattern(initialOptions.possibleActivePatterns),
      updateScore: new UpdateScore(scoringHandler, levelGoalsHandler),
      animate: new Animate(),
      eliminate: new Eliminate(),
      completion: new Completion(),
      iterate: new Iterate(),
      gameOver: new GameOver()
    }
    
    this.currentPhaseName = 'pregame'
    this.currentPhase = this.phases.pregame
  }

  handleGameStateUpdate(gameState: OnePlayerLocalGameState, dispatcher: Dispatch) {
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

  setFallingPhase(mode: string, tetriminoMovementHandler: TetriminoMovementHandler, scoringHandler: BaseScoringHandler, timerManager: TimerManager) {
    if (mode === 'classic') {
      return new FallingClassic(tetriminoMovementHandler, scoringHandler, timerManager)
    } else if (mode === 'extended') {
      return new FallingExtended(tetriminoMovementHandler, scoringHandler, timerManager)
    } else if (mode === 'infinite') {
      return new FallingInfinite(tetriminoMovementHandler, scoringHandler, timerManager)
    }
  }

  setLockPhase(mode: string, tetriminoMovementHandler: TetriminoMovementHandler, timerManager: TimerManager) {
    if (mode === 'classic') {
      return new LockClassic(tetriminoMovementHandler, timerManager)
    } else if (mode === 'extended') {
      return new LockExtended(tetriminoMovementHandler, timerManager)
    } else if (mode === 'infinite') {
      return new LockInfinite(tetriminoMovementHandler, timerManager)
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