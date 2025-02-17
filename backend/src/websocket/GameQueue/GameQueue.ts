import { PartyId, PartyRoomDataAPI, RoomId, SocketDataItem } from "multiplayer-tetris-types"
import db, { DatabaseAPI } from "../../db/db"
import WebsocketServer from "../WebsocketServer"
import { ServerToClientActions, UserDataFromDB, UserId } from "multiplayer-tetris-types/shared/types"
import chalk from "chalk"

class GameQueueHandler {

  protected queues: Record<string, GameModeQueue>
  protected server: WebsocketServer

  constructor(websocketServer: WebsocketServer) {
    this.server = websocketServer
    this.queues = {
      '1v1': new GameModeQueue('1v1', this),
      '1vAll': new GameModeQueue('1vAll', this),
      'coop': new GameModeQueue('coop', this),
    }
  }

  getServer() {
    return this.server
  }

  broadcastTo(roomId: RoomId, socketDataItem: SocketDataItem<ServerToClientActions>) {
    console.log(`Message broadcast to room ${chalk.bgYellow(roomId)}: ${chalk.greenBright(socketDataItem.action)}`)
    const { action, data } = socketDataItem
    if (!action) return
    this.server.to(roomId).emit('messageFromServer', { action, data })
  }

  getQueue(gameMode: string) {
    const [numOfPlayers, customOrQueue, gameType] = gameMode.split('-')
    const queue = this.queues[gameType as keyof Record<string, GameModeQueue>]

    if (!queue) {
      throw new Error(`Invalid gameMode name for queue.  '${gameMode}' does not have a corresponding queue.  Valid gameMode names are ${Object.keys(this.queues).reduce((acc, curr, idx, arr) => { return arr.length - 1 === idx ? acc + `and '${curr}'` : acc + `'${curr}', `}, '')}`)
    }
    return queue
  }

  queueParty(partyData: PartyRoomDataAPI) {
    const queue = this.getQueue(partyData.gameType)
    queue.queueParty(partyData)
  }

  dequeueParty(partyData: PartyRoomDataAPI) {
    const queue = this.getQueue(partyData.gameType)
    queue.dequeueParty(partyData)
  }
}

class GameModeQueue {

  protected queues: Record<string, GameQueue>
  protected enqueuedParties: Record<PartyId, string>
  protected queueLobbyName: string
  protected queueMap: Record<string, any>

  constructor(lobbyName: string, parentQueueHandler: GameQueueHandler) {
    this.queueMap = {
      '1v1': OneVOneQueue,
      '1vAll': OneVAllQueue,
      'coop': CoopQueue
    }
    this.queueLobbyName = lobbyName
    this.queues = {
      // this will be divided into ranks
      somerank_queue: this.initQueue(parentQueueHandler)
    }
    this.enqueuedParties = {}
  }

  initQueue(parentQueueHandler: GameQueueHandler) {
    const Ctr = this.queueMap[this.queueLobbyName as keyof Record<string, GameQueue>]
    return new Ctr(this.queueLobbyName, parentQueueHandler)
  }

  getQueueLobbyName() {
    return this.queueLobbyName
  }

  getQueue(queueType: string): GameQueue {
    return this.queues[queueType + '_queue' as keyof Record<string, GameQueue>]
  }

  queueParty(partyData: PartyRoomDataAPI) {
    try {
      const queueType = this.determineQueueType(partyData)
      const targetQueue = this.getQueue(queueType)
      this.enqueuedParties[partyData.id] = queueType
      targetQueue.enqueueParty(partyData)
    } catch(e) {
      console.error(e)
    }
  }

  dequeueParty(partyData: PartyRoomDataAPI) {
    try {
      const queueType = this.enqueuedParties[partyData.id]
      const targetQueue = this.getQueue(queueType)
      targetQueue.dequeueParty(partyData)
      delete this.enqueuedParties[partyData.id]
    } catch(e) {
      console.error(e)
    }
  }

  determineQueueType(partyData: PartyRoomDataAPI) {
    //for now we only have one queue
    return 'somerank'
  }
}

abstract class GameQueue {

  protected name: string
  protected queue: PartyRoomDataAPI[]
  protected db: DatabaseAPI
  protected parentQueueHandler: GameQueueHandler

  constructor(queueName: string, parentQueueHandler: GameQueueHandler) {
    this.name = queueName
    this.parentQueueHandler = parentQueueHandler
    this.db = db
  }

  public abstract enqueueParty(partyData: PartyRoomDataAPI): void
  public abstract dequeueParty(partyData: PartyRoomDataAPI): void
  protected abstract matchPartys(): void
  protected abstract createGame(party1: PartyRoomDataAPI, party2: PartyRoomDataAPI): Promise<void>
}

class OneVAllQueue extends GameQueue {
  protected queues: { solo: PartyRoomDataAPI[], coop: PartyRoomDataAPI[] }

  constructor(queueName: string, parentQueueHandler: GameQueueHandler) {
    super(queueName, parentQueueHandler)
    this.queues = {
      solo: [],
      coop: []
    }

  }

  
  public enqueueParty(partyData: PartyRoomDataAPI) {
    const queue = this.getAppropriateQueue(partyData)
    queue.unshift(partyData)
    setTimeout(this.matchPartys.bind(this), 5000)
  }
  
  
  public dequeueParty(partyData: PartyRoomDataAPI) {
    const queue = this.getAppropriateQueue(partyData)
    const targetIndex = queue.findIndex((queuedPartyData: PartyRoomDataAPI) => queuedPartyData.id = partyData.id)
    queue.splice(targetIndex, 1)
  }
  
  protected getAppropriateQueue(partyData: PartyRoomDataAPI) {
    const typeOfParty = partyData.gameType.split('-')[0]
    return typeOfParty === '1' ? this.queues.solo : this.queues.coop
  }

  protected matchPartys() {
    console.log('this.queues.solo', this.queues.solo)
    console.log('this.queues.coop', this.queues.coop)
    if (this.queues.solo.length && this.queues.coop.length) {
      const party1 = this.queues.solo.pop()
      const party2 = this.queues.coop.pop()
      this.createGame(party1, party2)
    }
  }


  protected async createGame(party1: PartyRoomDataAPI, party2: PartyRoomDataAPI) {

    this.db.updatePartyRoomGameStatus(party1.id, 'playing')
    this.db.updatePartyRoomGameStatus(party2.id, 'playing')
    const gameRoomId = await this.db.createGameRoom(party1.gameType, party1, party2)
    const gameRoomData = await this.db.getRoomByIdAndType(gameRoomId, 'game')

    gameRoomData.users.forEach((userData: UserDataFromDB) => {
      this.parentQueueHandler.getServer().getSocketByUserId(userData.id).join(gameRoomData.id)
    })

    this.parentQueueHandler.broadcastTo(gameRoomData.id, {
      action: 'matchFound',
      data: {
        gameRoomData
      }
    })
  }

}

class CoopQueue extends GameQueue {
  protected queue: PartyRoomDataAPI[]

  constructor(queueName: string, parentQueueHandler: GameQueueHandler) {
    super(queueName, parentQueueHandler)
    this.queue = []
  }

  
  public enqueueParty(partyData: PartyRoomDataAPI) {
    this.queue.unshift(partyData)
    setTimeout(this.matchPartys.bind(this), 5000)
  }
  
  
  public dequeueParty(partyData: PartyRoomDataAPI) {
    const targetIndex = this.queue.findIndex((queuedPartyData: PartyRoomDataAPI) => queuedPartyData.id = partyData.id)
    this.queue.splice(targetIndex, 1)
  }
  
  protected matchPartys() {
    if (this.queue.length > 1) {
      const party1 = this.queue.pop()
      const party2 = this.queue.pop()
      this.createGame(party1, party2)
    }
  }


  protected async createGame(party1: PartyRoomDataAPI, party2: PartyRoomDataAPI) {

    this.db.updatePartyRoomGameStatus(party1.id, 'playing')
    this.db.updatePartyRoomGameStatus(party2.id, 'playing')
    const gameRoomId = await this.db.createGameRoom(party1.gameType, party1, party2)
    const gameRoomData = await this.db.getRoomByIdAndType(gameRoomId, 'game')

    gameRoomData.users.forEach((userData: UserDataFromDB) => {
      this.parentQueueHandler.getServer().getSocketByUserId(userData.id).join(gameRoomData.id)
    })

    this.parentQueueHandler.broadcastTo(gameRoomData.id, {
      action: 'matchFound',
      data: {
        gameRoomData
      }
    })
  }

}
class OneVOneQueue extends GameQueue {
  protected queues: { solo: PartyRoomDataAPI[], coop: PartyRoomDataAPI[] }

  constructor(queueName: string, parentQueueHandler: GameQueueHandler) {
    super(queueName, parentQueueHandler)
    this.queue = []
    
  }

  
  public enqueueParty(partyData: PartyRoomDataAPI) {
    this.queue.unshift(partyData)
    setTimeout(this.matchPartys.bind(this), 5000)
  }
  
  
  public dequeueParty(partyData: PartyRoomDataAPI) {
    const targetIndex = this.queue.findIndex((queuedPartyData: PartyRoomDataAPI) => queuedPartyData.id = partyData.id)
    this.queue.splice(targetIndex, 1)
  }

  protected matchPartys() {
    if (this.queue.length > 1) {
      const party1 = this.queue.pop()
      const party2 = this.queue.pop()
      this.createGame(party1, party2)
    }
  }



  protected async createGame(party1: PartyRoomDataAPI, party2: PartyRoomDataAPI) {

    this.db.updatePartyRoomGameStatus(party1.id, 'playing')
    this.db.updatePartyRoomGameStatus(party2.id, 'playing')


    const gameRoomId = await this.db.createGameRoom(party1.gameType, party1, party2)
    
    const gameRoomData = await this.db.getRoomByIdAndType(gameRoomId, 'game')


    gameRoomData.users.forEach((userData: UserDataFromDB) => {
      this.parentQueueHandler.getServer().getSocketByUserId(userData.id).join(gameRoomData.id)
    })

    this.parentQueueHandler.broadcastTo(gameRoomData.id, {
      action: 'matchFound',
      data: {
        gameRoomData
      } 
    })
  }

}


export default GameQueueHandler