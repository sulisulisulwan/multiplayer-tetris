


const gameOptionsMap: any = {
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
    setAppState: null,
    startingLevel: 1,
    startingLines: 0,
    nextQueueSize: 6,
    backgroundMusic: 'None',
    volume: {
      soundeffects: 50,
      music: 50
    }
  },
  multiplayer: {}
}

const getDefaultGameOptions = (gameType: string) => gameOptionsMap[gameType]

export { getDefaultGameOptions }