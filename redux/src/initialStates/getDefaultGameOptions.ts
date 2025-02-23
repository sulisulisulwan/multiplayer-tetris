import { GameOptions } from "multiplayer-tetris-types"



const gameOptionsMap: Record<'singleplayer' | 'multiplayer', GameOptions> = {
  singleplayer: {
    possibleActivePatterns: {
      lineClear: true
    },
    levelGoalsSystem: 'variable',
    lockMode: 'extended',
    ghostTetriminoOn: false,
    holdQueueAvailable: true,
    rotationSystem: 'super',
    scoringSystem: 'classic',
    startingLevel: 1,
    startingLines: 0,
    nextQueueSize: 6,
    backgroundMusic: 'None',
    volume: {
      soundeffects: 50,
      music: 50
    }
  },
  multiplayer: {
    possibleActivePatterns: {
      lineClear: true
    },
    levelGoalsSystem: 'variable',
    lockMode: 'extended',
    ghostTetriminoOn: false,
    holdQueueAvailable: true,
    rotationSystem: 'super',
    scoringSystem: 'classic',
    startingLevel: 1,
    startingLines: 0,
    nextQueueSize: 6,
    backgroundMusic: 'None',
    volume: {
      soundeffects: 50,
      music: 50
    }
  }
}

const getDefaultGameOptions = (gameType: 'singleplayer' | 'multiplayer') => gameOptionsMap[gameType ? gameType : 'singleplayer']

export { getDefaultGameOptions }