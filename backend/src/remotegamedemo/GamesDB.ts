import { GameId, GameOptions, MultiplayerLocalGameState, SingleplayerLocalGameState, UserId } from 'multiplayer-tetris-types'
import { Engine } from 'multiplayer-tetris-core'
import { randomUUID } from 'node:crypto'
import { ClassicRotationSystem } from 'multiplayer-tetris-core/dist/tetrimino/movement-handler/rotation-systems/ClassicRS.js'
import { SuperRotationSystem } from 'multiplayer-tetris-core/dist/tetrimino/movement-handler/rotation-systems/SuperRS.js'
import RemoteGame from './RemoteGame.js'


class GamesDB {
  protected games: Record<GameId, RemoteGame>
  protected tetriminoMovementHandlersMap: Map<string, any>

  constructor() {
    this.games = {
    
    }
    this.tetriminoMovementHandlersMap = new Map([
      ['classic', ClassicRotationSystem],
      ['super', SuperRotationSystem] 
    ])

  }

  async getGameByUserId(userId: UserId) {
    const gameId = Object.keys(this.games).find(gameId => this.games[gameId].getUsers().includes(userId)) || null
    if (gameId) {
      return this.games[gameId]
    } else {
      return null
    }
  }

  async createGame(userId: UserId, initialGameState: SingleplayerLocalGameState | MultiplayerLocalGameState) {
    
    const newGame = new RemoteGame(this, initialGameState, [userId])
    await newGame.setGameServer(newGame)
    this.games[newGame.getId()] = newGame
    return newGame.getId()
  }

  async getGame(gameId: GameId)  {
    return this.games[gameId]
  }

  async setGameToActivated(gameId: GameId, initialGameState: GameOptions) {
    const game = this.games[gameId]
    game.activateLoop()
  }
}

export default GamesDB