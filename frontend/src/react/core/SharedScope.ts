import { SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { 
  HoldQueue as HoldQueueAbstract,
  LevelGoals as LevelGoalsAbstract, 
  NextQueue as NextQueueAbstract, 
  TetriminoMovementHandler as TetriminoMovementHandlerAbstract,
  BackgroundMusic as BackgroundMusicAbstract,
  SoundEffects as SoundEffectsAbstract
} from "multiplayer-tetris-types/frontend/core"
import { AppState, SetAppState } from "multiplayer-tetris-types/frontend/shared"
import { BaseScoringHandler } from "multiplayer-tetris-types/frontend/core"
import { makeCopy } from "./utils/utils"

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