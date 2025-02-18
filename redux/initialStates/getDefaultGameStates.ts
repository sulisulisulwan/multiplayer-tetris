import { MultiplayerLocalGameState, SingleplayerLocalGameState } from "multiplayer-tetris-types"
import { getDefaultGameOptions } from "./getDefaultGameOptions"

const singleplayerGameState: SingleplayerLocalGameState =  {
  type: 'singleplayer',
  currentTetrimino: null,
  playfield: null,
  playfieldOverlay: null,
  gameMode: 'marathon',
  nextQueue: null,
  holdQueue: {
    swapStatus: 'swapAvailableNow',
    heldTetrimino: null,
    available: true
  },
  
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
  // pregameCounter: 2, // This should be 2
  pregameCounter: 0, // This should be 2
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
  ghostCoords: [],
  currentGamePhase: 'off',
  gameOptions: getDefaultGameOptions('singleplayer'),
  
}

const multiplayerGameState: MultiplayerLocalGameState = {
  autoRepeatDelayTimeoutId: null,
  backToBack: false,
  currentLevel: 1,
  currentTetrimino: null,
  extendedLockdownMovesRemaining: 15,
  fallIntervalId: null,
  fallSpeed: 1000,
  holdQueue: {
    swapStatus: 'swapAvailableNow',
    heldTetrimino: null,
    available: true
  },
  levelClearedLinesGoal: 5, // this is a fixed goal system
  leftIntervalId: null,
  lockTimeoutId: null,
  lowestLockSurfaceRow: null,
  nextQueue: null,
  patternItems: [],
  performedTSpin: false,
  performedTSpinMini: false,
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
  playfield: null,
  playfieldOverlay: null,
  postLockMode: false,
  pregameCounter: 2, // This should be 2
  pregameIntervalId: null,
  rightIntervalId: null,
  scoreItems: [],
  scoringHistoryPerCycle: {},
  totalLinesCleared: 0,
  totalScore: 0,
  type: 'multiplayer',
  ghostCoords: [],
  currentGamePhase: 'off',
  gameOptions: getDefaultGameOptions('multiplayer'),
}

const getDefaultGameStates = (type: 'singleplayer' | 'multiplayer') => {
  if (type === 'singleplayer') return singleplayerGameState
  if (type === 'multiplayer') return multiplayerGameState
}

export default getDefaultGameStates