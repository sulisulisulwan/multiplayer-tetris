//this is a standin for a restAPI for user authentication and userData retrival
import { 
  GameId, 
  SlotType, 
  GameStatus, 
  MultiplayerGameTypes, 
  NonMainRoomData, 
  NonMainRoomMap, 
  NonMainRoomTypes, 
  PlayerSlots, 
  RoomData, RoomId, RoomsData, RoomTypes, UserId, UserStatus } from 'multiplayer-tetris-types'
import { DatabaseAPIData } from 'multiplayer-tetris-types'
import { RoomsDataWithoutMain } from 'multiplayer-tetris-types/backend'
import { GameRoomDataAPI, GameRoomDataFromDB, PartyRoomDataAPI } from 'multiplayer-tetris-types/backend/types'
import { ChatMessageData, CoopSlotsQueueing, CustomPlayerSlots, OnePlayerSlotsQueueing, OneVAllSlotsCustom, OneVOneSlotsCustom, QueueingPlayerSlots, Slot, UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types/shared/types'
import * as crypto from 'crypto'
import { usersData } from './usersData.js'
import allMessages from './messages.js'

const makeCopy = (obj: any): any => {
  if (['number', 'string', 'boolean'].includes(typeof obj) || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map(makeCopy)
  }

  const keys = Object.keys(obj)
  const newObj = keys.reduce((objCopy: Record<any, any>, currKey: string) => {
    objCopy[currKey] = makeCopy(obj[currKey as keyof any])
    return objCopy
  }, {})

  return newObj
}

class DatabaseAPI {

  protected data: DatabaseAPIData

  constructor() {

    this.data = {
      rooms: {
        main: { users: {} },
        party: {},
        game: {},
      },
      users: usersData,
      chat: {
        messages: allMessages
      }
    }
  }

  
  async getAllUsers() {
    return this.data.users
  }

  async getUserById(userId: UserId) {

    const userData: any = { 
      ...this.data.users[userId],
    }
    const friends = this.data.users[userId].friends.map(friendId => this.data.users[friendId])
    userData.friends = friends
    return userData as UserDataFromAPI
  }

  async getRoomByType(roomType: RoomTypes) {
    return this.data.rooms[roomType]
  }

  async getAllRooms() {
    return this.data.rooms
  }
  async getAllChatMessages() {
    return this.data.chat.messages
  }

  async getAllUsersFromMain() {
    return Object.values(this.data.rooms.main.users)
  }

  async getRoomByIdAndType(roomId: RoomId, roomType: NonMainRoomTypes): Promise<PartyRoomDataAPI | GameRoomDataAPI> {
    const roomData: any = makeCopy(this.data.rooms[roomType][roomId as keyof RoomData])
    
    roomData.users = roomData.users.map((userId: UserId) => {
      return this.data.users[userId]
    })
    return roomData as PartyRoomDataAPI | GameRoomDataAPI
  }

  async createChatMessage(chatMessage: ChatMessageData) {
    this.data.chat.messages.push(chatMessage)
  }

  

  async createMultiplayerGameRoom(gameType: MultiplayerGameTypes, party1: PartyRoomDataAPI, party2: PartyRoomDataAPI) {
    const [gameModeOrQueuePlayerAmount, customOrQueueing, gameModeIfQueued] = gameType.split('-')
    const newGameRoomData: GameRoomDataFromDB = {
      id: crypto.randomUUID(),
      gameType,
      gameState: {},
      party1: null,
      party2: null,
      slots: null,
      users: []
    }

    if (customOrQueueing === 'custom') {
      //party1 should have ALL the info
      newGameRoomData.party1 = party1
      newGameRoomData.slots = party1.slots
      newGameRoomData.users = party1.users.map((userData) => userData.id)

    } else if (customOrQueueing === 'queueing') {
      let gameMode = gameModeIfQueued

      //Remember that in 1vAll, the parties will have a different playerAmount
      const [singleOrCoopParty1] = party1.gameType.split('-')
      const [singleOrCoopParty2] = party2.gameType.split('-')

      newGameRoomData.party1 = party1
      newGameRoomData.party2 = party2
      newGameRoomData.slots = defaultSlots.get(gameMode + '-custom' as MultiplayerGameTypes)()
      newGameRoomData.users = party1.users.map((userData: UserDataFromDB) => userData.id).concat(party2.users.map((userData: UserDataFromDB) => userData.id))

      if (singleOrCoopParty1 === '1') {
        if (gameMode === '1vAll') {
          (newGameRoomData.slots as any).solo.users = (party1.slots as any).player
        } else if (gameMode === '1v1') {
          (newGameRoomData.slots as any).player1.users = (party1.slots as any).player
        }
      } else if (singleOrCoopParty1 === 'coop') {
        if (gameMode === '1vAll') {
          (newGameRoomData.slots as any).coopTeam.users = (party1.slots as any).coopTeam.users
        } else if (gameMode === 'coop') {
          (newGameRoomData.slots as any).team1.users = (party1.slots as any).coopTeam.users
        }
      }

      if (singleOrCoopParty2 === '1') {
        if (gameMode === '1vAll') {
          (newGameRoomData.slots as any).solo.users = (party2.slots as any).player
        } else if (gameMode === '1v1') {
          (newGameRoomData.slots as any).player2.users = (party2.slots as any).player
        }
      } else if (singleOrCoopParty2 === 'coop') {
        if (gameMode === '1vAll') {
          (newGameRoomData.slots as any).coopTeam.users = (party2.slots as any).coopTeam.users
        } else if (gameMode === 'coop') {
          (newGameRoomData.slots as any).team2.users = (party2.slots as any).coopTeam.users
        }
      }


    }

    this.data.rooms.game[newGameRoomData.id] = newGameRoomData
    return newGameRoomData.id
  }

  async createPartyRoom(userId: UserId, gameType: MultiplayerGameTypes) {
    const roomId = crypto.randomUUID()
    this.data.rooms.party[roomId] = {
      id: roomId,
      gameId: null,
      gameType: gameType ? gameType : '1-queueing-1v1',
      hostId: userId,
      slots: defaultSlots.get(gameType)(),
      users: [userId],
      status: 'dequeued'
    }; 

    if (gameType === '1v1-custom') {
      (this.data.rooms.party[roomId].slots as OneVOneSlotsCustom).observers.users[0] = userId
    } else if (gameType.includes('1-queueing')) {
      (this.data.rooms.party[roomId].slots as OnePlayerSlotsQueueing).player.users[0] = userId
    } else if (gameType.includes('coop-queueing')) {
      (this.data.rooms.party[roomId].slots as CoopSlotsQueueing).coopTeam.users[0] = userId
    }
    return roomId
  }


  async updateUserDataField(userId: string, field: string, value: any) {
    if (!this.data.users[userId]) {
      throw new Error(`User with userId ${userId} does not exist`)
    }

    if ((this.data.users[userId] as UserDataFromDB)[field as keyof UserDataFromDB] === undefined) {
      throw new Error(`Field '${field}' is invalid in this.data.users.  Valid fields are ${Object.keys(this.data.users[userId]).reduce((acc, currField, currIdx, thisArr) => {
        currIdx === thisArr.length - 1 ? acc += `and '${currField}'` : acc += `'${currField}', `
        return acc
      }, '')}`)
    }

    ((this.data.users[userId] as UserDataFromDB)[field as keyof UserDataFromDB] as unknown) = value
  }
  async updatePartyRoomType(roomId: RoomId, gameType: MultiplayerGameTypes) {
    this.data.rooms.party[roomId].gameType = gameType
    this.data.rooms.party[roomId].slots = defaultSlots.get(gameType)();
    const [gameTypeName, queueingOrCustom] = gameType.split('-');

    if (queueingOrCustom === 'custom') {
      (this.data.rooms.party[roomId].slots as CustomPlayerSlots).observers.users = this.data.rooms.party[roomId].users.slice()
    } else if (queueingOrCustom === 'queueing') {
      if (gameTypeName === '1') {
        (this.data.rooms.party[roomId].slots as OnePlayerSlotsQueueing).player.users = this.data.rooms.party[roomId].users.slice()
      } else if (gameTypeName === 'coop') {
        const slots = (this.data.rooms.party[roomId].slots as CoopSlotsQueueing).coopTeam.users;
        (this.data.rooms.party[roomId].slots as CoopSlotsQueueing).coopTeam.users = slots.map((slotSpace, index) => {
          if (this.data.rooms.party[roomId].users[index]) {
            return this.data.rooms.party[roomId].users[index]
          }
          return slotSpace
        })
      }
    }
  }

  async updatePartyRoomGameStatus(roomId: RoomId, newStatus: GameStatus) {
    this.data.rooms.party[roomId].status = newStatus
  }

  async updateRoomAddUser(roomType: NonMainRoomTypes, userId: UserId, roomId: RoomId) {
    const room = this.data.rooms[roomType as keyof RoomsDataWithoutMain][roomId as keyof NonMainRoomMap]
    room.users.push(userId);

    if ((room.slots as CustomPlayerSlots).observers) {
      (room.slots as CustomPlayerSlots).observers.users.push(userId)
    } else {
      const userSlotSpaces = (room.slots as CoopSlotsQueueing).coopTeam.users
      for (let i = 0; i < userSlotSpaces.length; i++) {
        if (userSlotSpaces[i] === null) {
          userSlotSpaces[i] = userId
          break
        }
      }
    }
  }

  async updateRoomDataField(roomType: RoomTypes, roomId: RoomId, field: string, value: any) {
    const room = this.data.rooms[roomType as keyof RoomsDataWithoutMain][roomId as keyof NonMainRoomData]
    
    if (!room) {
      throw new Error(`Room with roomId ${roomId} does not exist`)
    }

    if (room[field as keyof NonMainRoomData] === undefined) {
      throw new Error(`Field '${field}' is invalid in this.data.rooms.${roomType}[roomId].  Valid fields are ${Object.keys(room).reduce((acc, currField, currIdx, thisArr) => {
        currIdx === thisArr.length - 1 ? acc += `and '${currField}'` : acc += `'${currField}', `
        return acc
      }, '')}`)
    } 

    (room[field as keyof NonMainRoomData] as unknown) = value
  }

  async updateRoomSlot(roomId: RoomId, userId: UserId, slotType: SlotType, slotIdx: number) {
    
    //Find and remove user from current slot if exists
    const [gameType, customOrQueueing] = this.data.rooms.party[roomId].gameType.split('-')
    const allSlots = this.data.rooms.party[roomId].slots

    let currIn = null
    Object.keys(allSlots)
      .forEach((slot: SlotType) => {
        if ((allSlots[slot as keyof PlayerSlots] as Slot).users.includes(userId)) {
          currIn = slot
        } 
      })

    let targetSlot = (this.data.rooms.party[roomId].slots[slotType as keyof unknown] as Slot)

    if (slotType === 'observers') {
      (this.data.rooms.party[roomId].slots as CustomPlayerSlots).observers.users.push(userId)
    } else if (targetSlot.users[slotIdx]) return

    if (currIn) {
      const targetIdx = (allSlots[currIn as keyof PlayerSlots] as Slot).users.indexOf(userId)
      if (currIn === 'observers') {
        (allSlots[currIn as keyof PlayerSlots] as Slot).users.splice(targetIdx, 1)
      } else {
        (allSlots[currIn as keyof PlayerSlots] as Slot).users[targetIdx] = null
      }
    }

    (this.data.rooms.party[roomId].slots as CustomPlayerSlots).observers.users = (this.data.rooms.party[roomId].slots as CustomPlayerSlots).observers.users.filter(user => user !== null)

    targetSlot.users[slotIdx] = userId
    

  }

  async updateMainRoomAddUser(userData: UserDataFromDB) {
    this.data.rooms.main.users[userData.id] = userData
  }

  async updateUserAddInvitation(inviteeId: UserId, inviterId: UserId, partyId: RoomId) {
    this.data.users[inviterId].pendingInvites[inviteeId] = partyId
  }

  async updateUserAddRequestToJoin(requesteeId: UserId, requesterId: UserId) {
    this.data.users[requesteeId].pendingRequestsToJoin[requesterId] = true
  }

  async updateUserPartyPublicData(userId: UserId, gameType: MultiplayerGameTypes, status: GameStatus) {

    this.data.users[userId].partyPublic = {
      gameType,
      status
    }
  }

  async updateUserRemoveInvitation(inviteeId: UserId, inviterId: UserId) {
    delete this.data.users[inviterId].pendingInvites[inviteeId]
  }

  async updateUserRemoveRequestToJoinParty(requesterId: UserId, requesteeId: UserId) {
    delete this.data.users[requesteeId].pendingRequestsToJoin[requesterId]
  }

  async updateUserSetOffline(userId: UserId) {
    this.data.users[userId].partyId = null
    this.data.users[userId].isHost = true
    this.data.users[userId].status = 'Offline'
    this.data.users[userId].partyPublic = null
    this.data.users[userId].pendingInvites = {}
  }
  async updateUserStatusByUserId(userId: UserId, newStatus: UserStatus) {
    this.data.users[userId].status = newStatus
    return this.data.users[userId]
  }

  async updateUserDeleteFriend(userId: UserId, friendId: UserId) {
    const targetIdx = this.data.users[userId].friends.indexOf(friendId)
    this.data.users[userId].friends.splice(targetIdx, 1)
  }

  async updateUserToggleIsHost(userId: UserId, isHost: boolean) {
    this.data.users[userId].isHost = isHost
  }



  async deleteRoom(roomType: RoomTypes, roomId: RoomId) {
    delete this.data.rooms[roomType as keyof RoomsData][roomId as keyof RoomData]
  }

  async deleteUserFromRoom(roomType: RoomTypes, userId: UserId, roomId: RoomId) {
    const userIdx = this.data.rooms[roomType as keyof RoomsDataWithoutMain][roomId as keyof NonMainRoomMap].users.indexOf(userId)
    const room = this.data.rooms[roomType as keyof RoomsDataWithoutMain][roomId as keyof NonMainRoomMap]
    room.users.splice(userIdx, 1)
    Object.keys(room.slots)
      .forEach(slot => {
        const userIdx = (room.slots[slot as keyof PlayerSlots] as Slot).users.indexOf(userId)
        if (userIdx >= 0) {
          slot === 'observers' ? (room.slots[slot as keyof PlayerSlots] as Slot).users.splice(userIdx, 1) :
            (room.slots[slot as keyof PlayerSlots] as Slot).users[userIdx] = null
        }
      })

    
  }

  async deleteUserFromMainRoom(userId: UserId) {
    delete this.data.rooms.main.users[userId]
  }


}


const defaultSlots = new Map<MultiplayerGameTypes, () => PlayerSlots>([
  ['1v1-custom', () => ({
    player1: {
      max: 1,
      users: [null]
    },
    player2: {
      max: 1,
      users: [null]
    },
    observers: {
      max: 10,
      users:[]
    }
  })],
  ['1vAll-custom', () => ({
    solo: {
      max: 1,
      users: [null]
    },
    coopTeam: { 
      max: 3,
      users: [null, null, null]
    },
    observers: {
      max: 10, 
      users: []
    }
  })],
  ['coop-custom', () => ({
    team1: { 
      max: 3,
      users: [null, null, null]
    },
    team2: { 
      max: 3,
      users: [null, null, null]
    },
    observers: {
      max: 10, 
      users: []
    }
  })],
  ['1-queueing-1v1', () => ({
    player: {
      max: 1,
      users: [null]
    },
  })],
  ['1-queueing-1vAll', () => ({
    player: {
      max: 1,
      users: [null]
    },
  })],
  ['coop-queueing-1vAll', () => ({
      coopTeam: { 
        max: 3,
        users: [null, null, null]
      },
    })
  ],
  ['coop-queueing-coop', () => ({
      coopTeam: { 
        max: 3,
        users: [null, null, null]
      },
    })
  ],
])

const db = new DatabaseAPI()
export { DatabaseAPI }
export default db