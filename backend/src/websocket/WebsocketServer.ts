import { BroadcastOperator, Server, Socket } from "socket.io";
import dbApi, { DatabaseAPI } from "../db/db.js"; 
import MessageHandler from "./MessageHandler/WebsocketMessageHandler.js";
import chalk from "chalk";
import { SocketDataItem, SocketId, UserId } from "multiplayer-tetris-types";
import { DgramServerToClient } from "multiplayer-tetris-types/shared/types.js";
import { DecorateAcknowledgementsWithMultipleResponses, DefaultEventsMap } from "socket.io/dist/typed-events.js";
import GameQueue from "./GameQueue/GameQueue.js";

class WebsocketServer {
  
  protected port = 3001
  protected db: DatabaseAPI
  protected openSockets: {
    userId: Record<UserId, Socket>
    socketId: Record<SocketId, UserId>
  }
  protected messageHandler: MessageHandler
  protected queueingService: GameQueue
  protected server: Server


  constructor() {
    this.port = 3001
    this.db = dbApi
    console.log('Websocket server connected on ' + this.port)
    this.openSockets = {
      userId: {},
      socketId: {},
    }
    this.server = new Server(this.port)
    this.messageHandler = new MessageHandler(this)
    this.queueingService = new GameQueue(this)
    this.initListeners()
  }

  public getUserIdBySocketId(socketId: SocketId) {
    return this.openSockets.socketId[socketId]
  }

  public getSocketByUserId(userId: UserId) {
    return this.openSockets.userId[userId]
  }
  

  public getQueueingService () {
    return this.queueingService
  }

  public to(roomId: string): BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any> {
    return this.server.to(roomId)
  }
  
  private initListeners() {
    const onMessage = this.onMessage.bind(this)
    const onDisconnect = this.onDisconnect.bind(this)
    this.server.on('connection', async (socket) => {
      
      socket.on('message', async(action, data) => await onMessage(socket, action, data))
      socket.on('disconnect', async () => await onDisconnect(socket))
      this.connectUser(socket)
    })
  }

  private async connectUser(socket: Socket) {

    const userId = socket.handshake.query.userId as UserId
    console.log(`Connecting   ${chalk.yellow(userId)} with socket id: ${chalk.yellow(socket.id)}`)

    //If the user is already connected disallow conncection
    if (this.openSockets.userId[userId]) {
      console.log('USER ALREADY CONNECTED')
      this.send(socket, { action: 'accountAlreadyInUse', data: null })
      socket.emit('messageFromServer', )
      socket.disconnect()
      return
    }


    const roomId = await this.db.createPartyRoom(userId, '1-queueing-1v1')
    const partyRoomData = await this.db.getRoomByIdAndType(roomId, 'party')

    await this.db.updateUserStatusByUserId(userId, 'Online')
    await this.db.updateUserDataField(userId, 'partyId', roomId)
    await this.db.updateUserPartyPublicData(userId, '1-queueing-1v1', 'dequeued')
    const userData = await this.db.getUserById(userId)

    this.openSockets.socketId[socket.id] = userData.id
    this.openSockets.userId[userData.id] = socket


    const onlineFriendSockets = userData.friends.reduce((acc, friendDataFromDb) => {

      if (this.openSockets.userId[friendDataFromDb.id]) { 
        acc.push(this.openSockets.userId[friendDataFromDb.id]) 
      }
      return acc
    }, [])

    onlineFriendSockets.forEach(async(friendSocket) => { 
      this.send(friendSocket, { action: 'updateFriendsData', data: null })
    })

    const addUserToRoom = this.messageHandler.getHandler('addUserToRoom')
    addUserToRoom(socket, { roomType: 'main', userData })
    socket.join('main')
    socket.join(roomId)
    this.send(socket, { action: 'confirmedLoggedIn', data: { user: userData, party: partyRoomData } })
  }

  private async send(socket: Socket, socketDataItem: SocketDataItem<DgramServerToClient>) {
    console.log(`Message to ${chalk.bgYellow(this.openSockets.socketId[socket.id])}: ${chalk.greenBright(socketDataItem.action)}`)
    const { action, data } = socketDataItem
    socket.emit('messageFromServer', { action, data })
  }

  private async onMessage(socket: Socket, action: string, data: any) {
    if (!action) return
    const userId = this.openSockets.socketId[socket.id]
    const handler = this.messageHandler.getHandler(action)
    console.log(`Message from ${chalk.bgYellow(userId)}: ${chalk.magentaBright(action)}`)
    await handler(socket, data)
  }

  private async onDisconnect(socket: Socket) {
    //Inform other players in main room that a player is no longer connected
        
    if (!this.openSockets.socketId[socket.id]) {
      //This is a case where someone tried to open a socket with a username that already has an open socket.
      return
    }

    const disconnectingUserId = this.openSockets.socketId[socket.id] 
    const userData = await this.db.getUserById(disconnectingUserId)

    //Handle party room changes
    if (userData.partyId) {
      //Delete user from room
      await this.db.deleteUserFromRoom('party', disconnectingUserId, userData.partyId)
      let partyData = await this.db.getRoomByIdAndType(userData.partyId, 'party')

      // Reassign host if necessary
      if (partyData.users.length && userData.isHost) {
        const nextHost = partyData.users[0].id
        await this.db.updateUserToggleIsHost(nextHost, true)
        await this.db.updateRoomDataField('party', userData.partyId, 'hostId', nextHost)
        partyData = await this.db.getRoomByIdAndType(userData.partyId, 'party')
      }


      //If anyone is left in the room, let them know of the changes.  Otherwise, delete the room
      if (partyData.users.length) {
        partyData.users.forEach(async(userData) => {
          console.log('SENDING DISCONNECT DATA TO ' + userData.id)
          const partyUserSocket = this.openSockets.userId[userData.id]
          const partyMemberData = await this.db.getUserById(userData.id)
          this.messageHandler.send(partyUserSocket, { action: 'updatePartyAndUserData', data: { user: partyMemberData, party: partyData }})
        })
      } else {
        await this.db.deleteRoom('party', userData.partyId)
      }
    }
  

    await this.db.updateUserSetOffline(disconnectingUserId)

    delete this.openSockets.userId[disconnectingUserId]
    delete this.openSockets.socketId[socket.id]
    
    this.messageHandler
      .getHandler('removeUserFromRoom')(socket, { roomType: 'main', roomId: null, userId: disconnectingUserId })
    
    console.log(`Disconnected ${chalk.yellow(disconnectingUserId)} on socket id ${chalk.yellow(socket.id)}`)

    this.server.to('main').emit('messageFromServer', {
      action: 'playerDisconnected',
      data: { id: disconnectingUserId }
    })
  }

}

export default WebsocketServer