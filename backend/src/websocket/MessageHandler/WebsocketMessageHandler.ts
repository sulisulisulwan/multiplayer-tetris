import db, { DatabaseAPI } from "../../db/db.js"
import WebsocketServer from "../WebsocketServer.js"
import { Socket } from "socket.io"
import { NonMainRoomTypes, SocketDataItem } from "multiplayer-tetris-types"
import { MultiplayerGameTypes, PartyId, RoomId, RoomTypes, UserId } from "multiplayer-tetris-types"
import { PartyRoomDataAPI } from "multiplayer-tetris-types"
import chalk from 'chalk'
import { ChatMessageData, ServerToClientActions, SlotType, UserDataFromAPI, UserDataFromDB } from "multiplayer-tetris-types/shared/types.js"
import { DecorateAcknowledgementsWithMultipleResponses, DefaultEventsMap } from "socket.io/dist/typed-events.js"
import gameQueues from "../GameQueue/GameQueue.js"

type HandlerMap = Map<string, Function>

export default class MessageHandler {

  protected server: WebsocketServer
  protected db: DatabaseAPI
  protected handlerMap: HandlerMap

  constructor(server: WebsocketServer) {
    this.server = server
    this.db = db
    this.handlerMap = this.initMap()
  }

  getHandler(action: string): Function {
    const handler = this.handlerMap.get(action)
    if (!handler) throw new Error(`Handler '${action}' is not yet a valid handler.  Choose a different handler or implement the chosen handler`)
    return handler
  }

  initMap() {
    return new Map([
      ['createPartyRoom', this.createPartyRoom.bind(this)],
      ['getAllFriends', this.getAllFriends.bind(this)],
      ['updatePartyRoomType', this.updatePartyRoomType.bind(this)],
      ['deleteRoom', this.deleteRoom.bind(this)],
      ['addUserToRoom', this.addUserToRoom.bind(this)],
      ['removeUserFromRoom', this.removeUserFromRoom.bind(this)],
      ['sendChatMessage', this.sendChatMessage.bind(this)],
      ['requestToJoinParty', this.requestToJoinParty.bind(this)],
      ['inviteToParty', this.inviteToParty.bind(this)],
      ['acceptInvitation', this.acceptInvitation.bind(this)],
      ['acceptRequestToJoinParty', this.acceptRequestToJoinParty.bind(this)],
      ['declineInvitation', this.declineInvitation.bind(this)],
      ['declineRequestToJoinParty', this.declineRequestToJoinParty.bind(this)],
      ['leaveAllPopulatedParties', this.leaveAllPopulatedParties.bind(this)],
      ['addPlayerToSlot', this.addPlayerToSlot.bind(this)],
      ['getAllChatMessages', this.getAllChatMessages.bind(this)],
      ['removeFriend', this.removeFriend.bind(this)],
      ['queueParty', this.queueParty.bind(this)],
      ['dequeueParty', this.dequeueParty.bind(this)],
    ])
  }

  broadcastTo(roomId: RoomId, socketDataItem: SocketDataItem<ServerToClientActions>) {
    console.log(`Message broadcast to room ${chalk.bgYellow(roomId)}: ${chalk.greenBright(socketDataItem.action)}`)
    const { action, data } = socketDataItem
    if (!action) return
    this.server.to(roomId).emit('messageFromServer', { action, data })
  }

  send(socket: Socket, socketDataItem: SocketDataItem<ServerToClientActions>) {
    console.log(`Message to ${chalk.bgYellow(this.server.getUserIdBySocketId(socket.id))}: ${chalk.greenBright(socketDataItem.action)}`)
    const { action, data } = socketDataItem
    if (!action) return
    socket.emit('messageFromServer', { action, data })
  }

  async getAllFriends(socket: Socket, data: UserId[]) {
    const allFriendsData = await Promise.all(data.map(friendId => this.db.getUserById(friendId)))
    this.send(socket, { action: 'sendAllFriends', data: allFriendsData })
  }

  async createPartyRoom(socket: Socket, data: { userId: UserId, gameType: MultiplayerGameTypes }) {
    const { userId, gameType } = data

  

    const roomId = await this.db.createPartyRoom(userId, gameType)
    await this.db.updateUserPartyPublicData(userId, gameType, 'dequeued')
    await this.db.updateUserDataField(userId, 'partyId', roomId)
    const newPartyRoomData = await this.db.getRoomByIdAndType(roomId, 'party')
    const newUserData = await this.db.getUserById(userId)

    socket.join(roomId)
    this.broadcastTo(roomId, { action: 'updatePartyAndUserData', data: { user: newUserData, party: newPartyRoomData }})
  }

  async getUsersFromMain(socket: Socket, data: any) {
    const allUsersInMain = await this.db.getAllUsersFromMain()
    this.broadcastTo('main', { action: 'getUsersInMain', data: { allUsersInMain } })
  }

  async addUserToRoom(socket: Socket, data: { roomType: RoomTypes, userData: UserDataFromDB, roomId: RoomId }) {
    const {roomType, userData, roomId} = data
    if (roomType === 'main') {
      await this.db.updateMainRoomAddUser(userData)
      return 
    }
    await this.db.updateRoomAddUser(roomType, userData.id, roomId)
    const partyData = await this.db.getRoomByIdAndType(roomId, roomType)
    await this.db.updateUserDataField(userData.id, 'partyId', roomId)
    socket.join(roomId)

    this.broadcastTo(roomId, { action: 'updatePartyData', data: partyData })
  }

  async updatePartyRoomType(socket: Socket, data: { roomId: RoomId, gameType: MultiplayerGameTypes }) {
    const { roomId, gameType } = data
    await this.db.updatePartyRoomType(roomId, gameType)
    const partyData = await this.db.getRoomByIdAndType(roomId, 'party') as PartyRoomDataAPI

    partyData.users.forEach(async (userData: UserDataFromDB) => {
      
      await this.db.updateUserPartyPublicData(userData.id, partyData.gameType, partyData.status)
      const partyMemberData = await this.db.getUserById(userData.id)
      const partyMemberSocket = this.server.getSocketByUserId(userData.id)
      this.send(partyMemberSocket, { action: 'updatePartyAndUserData', data: { user: partyMemberData, party: partyData } })
    })
  }

  async deleteRoom(socket: Socket, data: { roomType: NonMainRoomTypes, roomId: RoomId }) {
    const { roomType, roomId } = data
    const roomData = await this.db.getRoomByIdAndType(roomId, roomType)
    roomData.users.forEach((userData: UserDataFromDB) => {
      const partyMemberSocket = this.server.getSocketByUserId(userData.id)
      partyMemberSocket.leave(roomId)
    })
    if (roomData)
    await this.db.deleteRoom(roomType, roomId)
  }

  async removeUserFromRoom(socket: Socket, data: { roomType: RoomTypes, userId: UserId, roomId: RoomId }) {
    const { roomType, userId, roomId } = data
    if (roomType === 'main') {
      return await this.db.deleteUserFromMainRoom(userId)
    }
    await this.db.deleteUserFromRoom(roomType, userId, roomId)
    await this.db.updateUserDataField(userId, 'partyId', null)
    const partyData = await this.db.getRoomByIdAndType(roomId, 'party') as PartyRoomDataAPI
    socket.leave(roomId)

    partyData.users.forEach(async (userData: UserDataFromDB) => {
      await this.db.updateUserPartyPublicData(userData.id, partyData.gameType, partyData.status)
      const partyMemberData = await this.db.getUserById(userData.id)
      const partyMemberSocket = this.server.getSocketByUserId(userData.id)
      this.send(partyMemberSocket, { action: 'updatePartyAndUserData', data: { user: partyMemberData, party: partyData } })
    })
  }

  async requestToJoinParty(socket: Socket, data: { requesterId: UserId, requesteeId: UserId }) {
    const { requesterId, requesteeId } = data

    await this.db.updateUserAddRequestToJoin(requesteeId, requesterId) //TODO:
    const updatedRequesteeData = await this.db.getUserById(requesteeId)
    const requesteeSocket = this.server.getSocketByUserId(requesteeId)
    if (requesteeSocket) {
      this.send(requesteeSocket, { action: 'updateUserData', data: updatedRequesteeData })
    }
    // this.send(requesteeSocket, { action: 'updateFriendsData', data: null })

  }


  async inviteToParty(socket: Socket, data: { inviteeId: UserId, inviterId: UserId, partyId: PartyId }) {
    const { inviteeId, inviterId, partyId } = data

    await this.db.updateUserAddInvitation(inviteeId, inviterId, partyId)
    const newUserData = await this.db.getUserById(inviterId)
    const inviteeSocket = this.server.getSocketByUserId(inviteeId)

    if (inviteeSocket) {
      this.send(inviteeSocket, { action: 'updateFriendsData', data: null })
    }
    this.send(socket, { action: 'updateUserData', data: newUserData })
  }

  async acceptInvitation(socket: Socket, data: { inviterId: UserId, inviteeId: UserId, partyId: PartyId, inviteeOldPartyId: PartyId }) {
    const { inviterId, inviteeId, partyId, inviteeOldPartyId } = data

    await this.db.deleteRoom('party', inviteeOldPartyId)
    const partyRoomData = await this.db.getRoomByIdAndType(partyId, 'party')
    if (partyRoomData.gameType.includes('1-queueing')) {
      await this.updatePartyRoomType(socket, { roomId: partyId, gameType: 'coop-queueing-coop' })
    }

    await this.db.updateRoomAddUser('party', inviteeId, partyId)

    const updatedRoomData = await this.db.getRoomByIdAndType(partyId, 'party') as PartyRoomDataAPI
    await this.db.updateUserToggleIsHost(inviteeId, false)
    await this.db.updateUserRemoveInvitation(inviteeId, inviterId)
    await this.db.updateUserDataField(inviteeId, 'partyId', partyId)
    await this.db.updateUserPartyPublicData(inviterId, updatedRoomData.gameType, updatedRoomData.status)
    await this.db.updateUserPartyPublicData(inviteeId, updatedRoomData.gameType, updatedRoomData.status)
    socket.join(partyId)

    // We must update everyone's user data for changes in the party room to immediately update.
    // Potentially create a broadcast to all party members to update their userData info
    updatedRoomData.users.forEach(async (userData: UserDataFromDB) => {
      const userSocket = this.server.getSocketByUserId(userData.id)
      this.send(userSocket, { action: 'updatePartyAndUserData', data: { user: userData, party: updatedRoomData } })
    })
    this.broadcastTo(partyId, { action: 'updateFriendsData', data: null })
  }

  async acceptRequestToJoinParty(socket: Socket, data: { requesterId: UserId, requesteeId: UserId, partyId: PartyId }) {
    const { requesterId, requesteeId, partyId } = data

    const requesterData = await this.db.getUserById(requesterId)
    await this.db.deleteRoom('party', requesterData.partyId)

    const partyRoomData = await this.db.getRoomByIdAndType(partyId, 'party')
    if (partyRoomData.gameType.includes('1-queueing')) {
      await this.updatePartyRoomType(this.server.getSocketByUserId(requesteeId), { roomId: partyId, gameType: 'coop-queueing-coop' })
    }

    await this.db.updateRoomAddUser('party', requesterId, partyId)

    const updatedRoomData = await this.db.getRoomByIdAndType(partyId, 'party') as PartyRoomDataAPI
    await this.db.updateUserToggleIsHost(requesterId, false)
    await this.db.updateUserRemoveRequestToJoinParty(requesterId, requesteeId)
    await this.db.updateUserDataField(requesterId, 'partyId', partyId)
    await this.db.updateUserPartyPublicData(requesterId, updatedRoomData.gameType, updatedRoomData.status)
    await this.db.updateUserPartyPublicData(requesteeId, updatedRoomData.gameType, updatedRoomData.status)

    const requesterSocket = this.server.getSocketByUserId(requesterId)
    requesterSocket.join(partyId)

    // We must update everyone's user data for changes in the party room to immediately update.
    // Potentially create a broadcast to all party members to update their userData info
    updatedRoomData.users.forEach(async (userData: UserDataFromDB) => {
      const userSocket = this.server.getSocketByUserId(userData.id)
      this.send(userSocket, { action: 'updatePartyAndUserData', data: { user: userData, party: updatedRoomData } })
    })
    this.broadcastTo(partyId, { action: 'updateFriendsData', data: null })
  }
  
  async declineInvitation(socket: Socket, data: { inviterId: UserId, inviteeId: UserId }) {
    const { inviterId, inviteeId } = data
    await this.db.updateUserRemoveInvitation(inviteeId, inviterId)
    this.send(socket, { action: 'updateFriendsData', data: null })
  }

  async declineRequestToJoinParty(socket: Socket, data: { requesterId: UserId, requesteeId: UserId }) {
    const { requesterId, requesteeId } = data
    await this.db.updateUserRemoveRequestToJoinParty(requesterId, requesteeId)
    this.send(socket, { action: 'updateFriendsData', data: null })
  }

  async leaveAllPopulatedParties(socket: Socket, data: { userId: UserId, partyId: PartyId, targetGameType: MultiplayerGameTypes }) {
    const { userId, partyId, targetGameType } = data
    socket.leave(partyId)
    const newPartyRoomId = await this.db.createPartyRoom(userId, targetGameType)
    const newPartyRoomData = await this.db.getRoomByIdAndType(newPartyRoomId, 'party')
    await this.db.deleteUserFromRoom('party', userId, partyId)
    await this.db.updatePartyRoomGameStatus(partyId, 'dequeued')
    await this.db.updateUserToggleIsHost(userId, true)
    await this.db.updateUserPartyPublicData(userId, '1-queueing-1v1', 'dequeued')
    await this.db.updateUserDataField(userId, 'partyId', newPartyRoomId)
    const newUserData = await this.db.getUserById(userId)
    socket.join(newPartyRoomId)
    this.send(socket, { action: 'updatePartyAndUserData', data: { user: newUserData, party: newPartyRoomData }})

    const oldPartyUpdatedData = await this.db.getRoomByIdAndType(partyId, 'party')
    if (oldPartyUpdatedData.users.length) {
      const newHostId = oldPartyUpdatedData.users[0].id
      this.db.updateUserToggleIsHost(newHostId, true)
      this.db.updateRoomDataField('party', partyId, 'hostId', newHostId)
      const newHostData = await this.db.getUserById(newHostId)
      this.send(this.server.getSocketByUserId(newHostId), { action: 'updateUserData', data: newHostData })
      this.broadcastTo(partyId, { action: 'updatePartyData', data: oldPartyUpdatedData })
      this.broadcastTo(partyId, { action: 'updatePartyData', data: oldPartyUpdatedData })
      this.broadcastTo(partyId, { action: 'updateFriendsData', data: null })
    }
  }

  async addPlayerToSlot(socket: Socket, data: { roomId: RoomId, userId: UserId, slotType: SlotType, slotIdx: number }) {
    const { roomId, userId, slotType, slotIdx } = data
    await this.db.updateRoomSlot(roomId, userId, slotType, slotIdx)
    const partyRoomData = await this.db.getRoomByIdAndType(roomId, 'party')
    this.broadcastTo(roomId, { action: 'updatePartyData', data: partyRoomData })
  }

  async removeFriend(socket: Socket, data: { userId: UserId, friendId: UserId }) {
    const { userId, friendId } = data
    await this.db.updateUserDeleteFriend(userId, friendId)
    await this.db.updateUserDeleteFriend(friendId, userId)
    const updatedUserData = await this.db.getUserById(userId)
    const usedToBeFriendSocket = this.server.getSocketByUserId(friendId)
    
    this.send(socket, { action: 'updateUserData', data: updatedUserData })
    
    if (usedToBeFriendSocket) {
      const updatedFriendData = await this.db.getUserById(friendId)
      this.send(usedToBeFriendSocket, { action: 'updateUserData', data: updatedFriendData })
    }
  }

  async sendChatMessage(socket: Socket, data: ChatMessageData) {
    await this.db.createChatMessage(data)

    const chatType = data.to.chatType

    if (chatType === 'party') {
      const senderData = await this.db.getUserById(data.userId)
      this.broadcastTo(senderData.partyId, { action: 'incomingChatMessage', data: data })
    } else if (chatType === 'whisper') {
      const whisperSocket = this.server.getSocketByUserId(data.to.recipient[0])
      if (whisperSocket) {
        this.send(whisperSocket, { action: 'incomingChatMessage', data: data })
        this.send(socket, { action: 'incomingChatMessage', data: data })
      } else {
        this.send(socket, { action: 'incomingChatMessage', data: {
          id: '',
          to: {
              chatType: 'system',
              recipient: [data.userId]
          },
          userId: '',
          username: '',
          content: `${data.to.recipient[0]} is not online.  Message can not be delivered`
        } })

      }
    } else if (chatType === 'all') {
      console.log('sending chat to "all" needs to be implemented')
    }
  }

  async getAllChatMessages(socket: Socket, data: { messages: ChatMessageData }) {
    const messages = await this.db.getAllChatMessages()
    this.send(socket, { action: 'getAllChatMessages', data: messages })
  }


  async queueParty(socket: Socket, data: { partyId: RoomId }) {
    const { partyId } = data
    await this.db.updatePartyRoomGameStatus(partyId, 'queued')
    const partyRoomData = await this.db.getRoomByIdAndType(partyId, 'party') as PartyRoomDataAPI
    this.server.getQueueingService().queueParty(partyRoomData)
    this.broadcastTo(partyId, {
      action: 'updatePartyData',
      data: partyRoomData
    })

  }
  
  async dequeueParty(socket: Socket, data: { partyId: RoomId }) {
    const { partyId } = data
    await this.db.updatePartyRoomGameStatus(partyId, 'dequeued')
    const partyRoomData = await this.db.getRoomByIdAndType(partyId, 'party') as PartyRoomDataAPI
    this.server.getQueueingService().dequeueParty(partyRoomData)
    this.broadcastTo(partyId, {
      action: 'updatePartyData',
      data: partyRoomData
    })

  }
}