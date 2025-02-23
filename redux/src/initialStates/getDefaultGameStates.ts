import { MultiplayerLocalGameState, OnePlayerLocalGameState, UserId } from "multiplayer-tetris-types"
import { getDefaultGameOptions } from "./getDefaultGameOptions"

const defaultGameState: OnePlayerLocalGameState =  {
  type: 'singleplayer',
  gameMode: 'sp-marathon',
  currentTetrimino: null,
  playfield: null,
  playfieldOverlay: null,
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
  pregameCounter: 0, // This should be 2
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
  gameOptions: null
}

const getDefaultGameStates = (type: any, users?: UserId[]) => {

  if (users) {
    return users.reduce((gameStates, currUserId) => {
      const initialGameState = {
        ...defaultGameState,
        type: 'multiplayer' as 'multiplayer'
      } 
      gameStates[currUserId as keyof MultiplayerLocalGameState] = initialGameState
      return gameStates
    }, {} as MultiplayerLocalGameState)
  }

  return defaultGameState

  
}

export default getDefaultGameStates