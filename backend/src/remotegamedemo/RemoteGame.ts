import { GameId, GameOptions, MultiplayerLocalGameState, SingleplayerLocalGameState, UserId } from "multiplayer-tetris-types"
import { getBackendStore, initializeSinglePlayerGame, setGameStateToSingleplayer } from "multiplayer-tetris-redux"
import { Engine, InGamePlayerControl, TimerManager } from "multiplayer-tetris-core"
import { RemoteInfo } from "node:dgram"
import DgramServerSocket from "../dgram/DgramServer.js"
import { ScoringHandlerFactory } from "multiplayer-tetris-core/dist/scoring/ScoringHandlerFactory.js"
import { randomUUID } from "node:crypto"

export default class RemoteGame {

  protected gameDb: any
  protected id: GameId
  protected initialGameState: SingleplayerLocalGameState | MultiplayerLocalGameState
  protected dgramSocket: DgramServerSocket
  protected loopCount: number
  protected engine: Engine
  protected playerActionHandler: InGamePlayerControl
  protected store: any
  protected users: UserId[]

  constructor(gameDb: any, initialGameState: SingleplayerLocalGameState | MultiplayerLocalGameState, users: UserId[]) {
    this.gameDb = gameDb
    this.id = randomUUID()
    this.initialGameState = initialGameState
    this.dgramSocket = null
    this.loopCount = 0
    this.playerActionHandler = null,
    this.store = null
    this.users = users
  }

  public activateLoop() {
    const gameOptions = this.initialGameState.gameOptions as GameOptions
    const timerManager = new TimerManager()
    this.activateStore()
    this.engine = new Engine(gameOptions, timerManager)
    const scoringHandler = ScoringHandlerFactory.loadScoringHandler(gameOptions.scoringSystem)
    const tetriminoMovementHandler = new (this.gameDb.tetriminoMovementHandlersMap.get(gameOptions.rotationSystem))()

    this.playerActionHandler = new InGamePlayerControl(
      tetriminoMovementHandler, 
      scoringHandler, 
      timerManager
    )
    
    this.store.subscribe(this.loop.bind(this))
    //this updates gameState to its initial state
    this.store.dispatch(setGameStateToSingleplayer(this.initialGameState))
  }
  
  public async setGameServer(gameRoom: any) {
    this.dgramSocket = new DgramServerSocket(gameRoom)
    const port = await this.dgramSocket.initiateSocket()
    return port
  }

  public getPlayerActionHandler() {
    return this.playerActionHandler
  }

  public getId() {
    return this.id
  }

  public getUsers() {
    return this.users
  }

  public getDispatch() {
    return this.store.dispatch
  }

  public getState() {
    return this.store.getState()
  }

  public getSocket() {
    return this.dgramSocket
  }

  protected activateStore() {
    this.store = getBackendStore('singleplayer')
  }

  protected loop() {
    if (this.loopCount === 0) {
      this.loopCount++
      // this kicks off the pregame actions
      const { gameOptions } = this.store.getState()
      this.store.dispatch(initializeSinglePlayerGame(gameOptions))
      return
    }
    const newGameState = this.store.getState().gameState
    const remoteAddresses = this.dgramSocket.getAllUsersRemoteAddressInfo()

    remoteAddresses.forEach((rinfo: RemoteInfo) => {
      this.dgramSocket.send(rinfo, {
        action: 'gameStateUpdate',
        data: newGameState
      })
    })

    this.engine.handleGameStateUpdate(newGameState, this.store.dispatch)
  }
}