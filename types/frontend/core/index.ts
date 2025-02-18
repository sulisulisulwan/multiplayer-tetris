import { AppState } from "../shared"
import * as Redux from 'redux'

export abstract class Action {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>, eventData: EventData): void
}
export interface ActionItem {
  eliminatorName: string
  actionData: any 
}
export abstract class Audio {
  public abstract play(soundName?: string): void 
}
export abstract class Engine {}

export abstract class BackgroundMusic extends Audio {
  public abstract play(): void
  public abstract setTrack(trackName: string): void
}
export abstract class BaseAward {
}
export abstract class BaseScoringHandler {
  public abstract handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: ScoreItem[], 
    scoringHistoryPerCycle: ScoringHistoryPerCycle
  ): number

  public abstract updateScore(currentScore: number, scoreItem: ScoreItem): number
}

export abstract class SharedScope {
  
  public scoringHandler: BaseScoringHandler
  public levelGoalsHandler: LevelGoals
  public tetriminoMovementHandler: TetriminoMovementHandler
  public nextQueueHandler: NextQueue
  public holdQueueHandler: HoldQueue

  constructor(sharedHandlers: SharedHandlersMap) {
    this.scoringHandler = sharedHandlers.scoringHandler
    this.levelGoalsHandler = sharedHandlers.levelGoalsHandler
    this.tetriminoMovementHandler = sharedHandlers.tetriminoMovementHandler
    this.nextQueueHandler = sharedHandlers.nextQueueHandler
    this.holdQueueHandler = sharedHandlers.holdQueueHandler
  }

}
export abstract class BasePhase extends SharedScope {
  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class Animate extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class Completion extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export interface DirectionsMap {
  right: Function
  left: Function
  down: Function
  inPlace: Function
}
export abstract class Eliminate extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export interface EventData {
  key: string,
  strokeType: string
  action: string
  currKeystrokes?: Set<string>
}
export abstract class FallingClassic extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class FallingExtended extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class FallingInfinite extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class GameOver extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class Generation extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class GoalSpecs {
  public abstract getClearedLinesGoals(level: number, linesCleared?: number): number 
}
export abstract class HoldQueue {
  public abstract setHoldQueueState(gameState: AppState['gameState']): void
  public abstract handleHoldQueueToggle(gameState: AppState['gameState'], eventData: EventData): void
}
export abstract class Iterate extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class LevelGoals {
  public abstract getNewLevelSpecs(level: number, linesCleared: number): {
    levelClearedLinesGoal: number
    fallSpeed: number
  }
}
export abstract class LockClassic extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class LockExtended extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class LockInfinite extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class NextQueue {
  public abstract dequeue(): Tetrimino
  public abstract peek(): string
  public abstract queueToArray(length: number): string[]
  public abstract logQueue(length: number): void
}
export abstract class Off extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class Pattern extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export abstract class Pregame extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}

export abstract class SoundEffects extends Audio {
  public abstract play(soundName: string): void
}
export abstract class TetriminoMovementHandler {
  public abstract getPlayfieldCoords(tetrimino: Tetrimino, direction?: string): Coordinates[]
  public abstract  gridCoordsAreClear(targetCoordsOnPlayfield: Coordinates[], playfieldNoTetrimino: string[][]): boolean
  public abstract  moveOne(targetDirection: string, playfield: string[][], tetrimino: Tetrimino): {
    newPlayfield: string[][]
    newTetrimino: Tetrimino
    successfulMove: boolean
  }
  public abstract getLowestPlayfieldRowOfTetrimino(tetrimino: Tetrimino): number
  public abstract updateTetrimino(tetrimino: Tetrimino, direction: string, offset?: Coordinates, targetOrientation?: string, playfield?: string[][]): Tetrimino
  public abstract removeTetriminoFromPlayfield(tetriminoCoords: Coordinates[], playfield: string[][]): string[][]
  public abstract addTetriminoToPlayfield(tetriminoCoords: Coordinates[], playfield: string[][], minoGraphic: string): string[][]
  public abstract getProjectedLandedTetrimino(playfield: string[][], tetrimino: Tetrimino): Tetrimino
  public abstract getPlayfieldWithGhostTetrimino(playfield: string[][], tetrimino: Tetrimino): string[][]
  public abstract moveTetriminoOnPlayfield(oldCoords: Coordinates[], targetCoords: Coordinates[], playfield: string[][], minoGraphic: string): string[][]
  public abstract getGhostCoords(tetrimino: Tetrimino, playfield: string[][]): Coordinates[]
}
export abstract class UpdateScore extends BasePhase {
  public abstract execute(gameState: AppState['gameState'], dispatch: Redux.Dispatch<any>): void
}
export interface GamePhases {
  off: Off
  pregame: Pregame
  generation: Generation
  falling: FallingClassic | FallingExtended | FallingInfinite
  lock: LockClassic | LockExtended | LockInfinite
  pattern: Pattern
  animate: Animate
  eliminate: Eliminate
  completion: Completion
  iterate: Iterate
  gameOver: GameOver
  updateScore: UpdateScore
}
export interface AutoRepeat {
  left: boolean
  right: boolean
  override: null | string
}
export interface PlayerAction {
  autoRepeat: AutoRepeat,
  softdrop: boolean
  harddrop: boolean
  flipClockwise: boolean
  flipCounterClockwise: boolean
  hold: boolean
}
export type LocalGameState = SingleplayerLocalGameState | MultiplayerLocalGameState
export interface SingleplayerLocalGameState {
  autoRepeatDelayTimeoutId: null | ReturnType<typeof setTimeout>
  backToBack: boolean
  currentTetrimino: null | Tetrimino
  currentGamePhase: string
  currentLevel: number
  extendedLockdownMovesRemaining: number
  fallIntervalId: null | ReturnType<typeof setTimeout>
  fallSpeed: number
  gameMode: string
  gameOptions: GameOptions
  ghostCoords: Coordinates[]
  holdQueue: HoldQueueState
  leftIntervalId: null | ReturnType<typeof setTimeout>
  levelClearedLinesGoal: number
  lockTimeoutId: null | ReturnType<typeof setTimeout>
  lowestLockSurfaceRow: null | number
  nextQueue: null | string[]
  patternItems: PatternItem[]
  performedTSpin: boolean
  performedTSpinMini: boolean
  playerAction: PlayerAction,
  playfield: string[][] | null
  playfieldOverlay: string[][] | null
  postLockMode: boolean
  pregameCounter: number
  pregameIntervalId: null | ReturnType<typeof setTimeout>
  rightIntervalId: null | ReturnType<typeof setTimeout>
  scoreItems: ScoreItem[]
  scoringHistoryPerCycle: ScoringHistoryPerCycle
  totalLinesCleared: number
  totalScore: number
  type: 'singleplayer'
}
export declare interface MultiplayerLocalGameState {
  autoRepeatDelayTimeoutId: null | ReturnType<typeof setTimeout>
  backToBack: boolean
  currentTetrimino: null | Tetrimino
  currentGamePhase: string
  currentLevel: number
  extendedLockdownMovesRemaining: number
  fallIntervalId: null | ReturnType<typeof setTimeout>
  fallSpeed: number
  gameOptions: GameOptions
  ghostCoords: Coordinates[]
  holdQueue: HoldQueueState
  leftIntervalId: null | ReturnType<typeof setTimeout>
  levelClearedLinesGoal: number
  lockTimeoutId: null | ReturnType<typeof setTimeout>
  lowestLockSurfaceRow: null | number
  nextQueue: null | string[]
  patternItems: PatternItem[]
  performedTSpin: boolean
  performedTSpinMini: boolean
  playerAction: PlayerAction,
  playfield: string[][] | null
  playfieldOverlay: string[][] | null
  postLockMode: boolean
  pregameCounter: number
  pregameIntervalId: null | ReturnType<typeof setTimeout>
  rightIntervalId: null | ReturnType<typeof setTimeout>
  scoreItems: ScoreItem[]
  scoringHistoryPerCycle: ScoringHistoryPerCycle
  totalLinesCleared: number
  totalScore: number
  type: 'multiplayer'
}
export interface ScoringHistoryPerCycle {
  softdrop?: LineClearScoringDataItem[]
  lineClear?: boolean
}
export type LineClearScoringDataItem = { 
  currentScore?: number 
  linesDropped?: number
  currentLevel?: number
  linesCleared?: number, 
  performedTSpin?: boolean,
  performedTSpinMini?: boolean,
  backToBack?: boolean
}
export interface StateUpdateItem {
  field: string | null
  value: number | string | null
}
export interface PatternItem {
  type: string
  action: string
  stateUpdate: StateUpdateItem[] | null
  data: PatternDataItem
}
export type PatternDataItem = LineClearPatternDataItem | HarddropDataItem
export interface LineClearPatternDataItem {
  rowsToClear: number[]
  linesCleared: number
}
export interface HarddropDataItem {
  linesDropped: number
}
export interface ScoreItem {
  type: string
  data: GenericObject | LineClearScoringDataItem
}
export type EliminatorFn = (playfield: string[][], actionData: any /* TODO: make this stronger*/) => string[][]
export interface EliminatorsMap {
  lineClear: EliminatorFn
}
export type PlayerActionHandlersMap = Record<string, Action>
export interface PossibleActivePatternsMap {
  lineClear: boolean
}
export interface TetriminoGraphicsMap {
  OTetriminoGraphic: string[][]  
  ITetriminoGraphic: string[][]  
  TTetriminoGraphic: string[][]  
  JTetriminoGraphic: string[][]  
  LTetriminoGraphic: string[][]  
  STetriminoGraphic: string[][]  
  ZTetriminoGraphic: string[][]  
  emptyGraphic: string[][]  
}
export interface HoldQueueState {
  swapStatus: string
  heldTetrimino: null | Tetrimino
  available: boolean
}
export interface LevelColorsMap {
  [key: number]: string
}
export interface SharedHandlersMap {
  tetriminoMovementHandler: TetriminoMovementHandler
  scoringHandler: BaseScoringHandler
  levelGoalsHandler: LevelGoals
  nextQueueHandler: NextQueue
  holdQueueHandler: HoldQueue
}
export interface InitialOptions {
  possibleActivePatterns: {
    lineClear: boolean
  }
  rotationSystem: string
  scoringSystem: string
  levelGoalsSystem: string
  lockMode: string
}
export interface SingleplayerOptions {
  possibleActivePatterns: {
    lineClear: boolean
  },
  levelGoalsSystem: 'variable' | 'fixed'
  lockMode: 'classic' | 'extended' | 'infinite'
  ghostTetriminoOn: boolean
  holdQueueAvailable: boolean
  rotationSystem: 'classic' | 'super'
  scoringSystem: 'classic',
  startingLevel: number
  startingLines: number
  nextQueueSize: number
  backgroundMusic: string
  volume: {
    soundeffects: number,
    music: number
  }
  
}
export interface MultiplayerOptions {
  possibleActivePatterns: {
    lineClear: boolean
  },
  levelGoalsSystem: 'variable' | 'fixed'
  lockMode: 'classic' | 'extended' | 'infinite'
  ghostTetriminoOn: boolean
  holdQueueAvailable: boolean
  rotationSystem: 'classic' | 'super'
  scoringSystem: 'classic',
  startingLevel: number
  startingLines: number
  nextQueueSize: number
  backgroundMusic: string
  volume: {
    soundeffects: number,
    music: number
  }
}
export type GameOptions = SingleplayerOptions | MultiplayerOptions
export interface GenericObject {
  [key: string]: any
}
export interface TSlotCornersGettersMap {
  getTSlotCorners_north: Function
  getTSlotCorners_south: Function
  getTSlotCorners_east: Function
  getTSlotCorners_west: Function
}
export interface IsATSlotCornerMap {
  a: boolean
  b: boolean
  c: boolean
  d: boolean
}
export interface RelativeOrientationsMap {
  north: FlipDirectionsMap
  south: FlipDirectionsMap
  east: FlipDirectionsMap
  west: FlipDirectionsMap
}
export interface FlipDirectionsMap {
  flipCounterClockwise: string
  flipClockwise: string
}
export interface Tetrimino {
  startingGridPosition: Coordinates
  currentOriginOnPlayfield: Coordinates
  localGridSize: number
  currentOrientation: string
  status: string
  orientations?: OrientationsMap
  name?: string
  minoGraphic?: string
  ghostCoordsOnPlayfield: number[]
}
export interface OrientationsMap {
  north: OrientationData,
  east: OrientationData,
  south: OrientationData,
  west: OrientationData
}
export interface OrientationData {
  topBorderCoords: Coordinates[]
  coordsOffOrigin: Coordinates[]
  rotationPoints: RotationPointsMap
  lowestRowOffOrigin: number
}
export type Coordinates = [number, number]
export interface RotationPointsMap {
  '1': Coordinates
  '2': Coordinates
  '3': Coordinates
  '4': Coordinates
  '5': Coordinates
}
export interface ScoringMethods {
  [key: string]: Function
}
export interface PatternScanners {
  lineClear: Function
}
export interface SoundEffectMap {
  [key:string]: HTMLAudioElement
}
