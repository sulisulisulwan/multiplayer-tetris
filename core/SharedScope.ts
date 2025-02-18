import { SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { 
  HoldQueue as HoldQueueAbstract,
  LevelGoals as LevelGoalsAbstract, 
  NextQueue as NextQueueAbstract, 
  TetriminoMovementHandler as TetriminoMovementHandlerAbstract,
} from "multiplayer-tetris-types/frontend/core"
import { BaseScoringHandler } from "multiplayer-tetris-types/frontend/core"

export class SharedScope {

  public scoringHandler: BaseScoringHandler
  public levelGoalsHandler: LevelGoalsAbstract
  public tetriminoMovementHandler: TetriminoMovementHandlerAbstract
  public nextQueueHandler: NextQueueAbstract
  public holdQueueHandler: HoldQueueAbstract

  constructor(sharedHandlers: SharedHandlersMap) {
    this.scoringHandler = sharedHandlers.scoringHandler
    this.levelGoalsHandler = sharedHandlers.levelGoalsHandler
    this.tetriminoMovementHandler = sharedHandlers.tetriminoMovementHandler
    this.nextQueueHandler = sharedHandlers.nextQueueHandler
    this.holdQueueHandler = sharedHandlers.holdQueueHandler
  }

  

  // public syncToReactAppState(appState: AppState) {
  //   const appStateCopy = makeCopy(appState) as AppState
  //   this.appState = appStateCopy
  // }

}