
type UUIDString = string
type UserId = UUIDString
type RoomId = UUIDString
type GameId = UUIDString
type SocketId = UUIDString
type PartyId = UUIDString
export { UserId, RoomId, GameId, SocketId, PartyId }
export type MultiplayerGameTypes = '1v1-custom' | 'coop-custom' | '1vAll-custom' | '1-queueing-1v1' | '1-queueing-1vAll'  | 'coop-queueing-1vAll' | 'coop-queueing-coop'
export type RoomTypes = 'main' | 'party' | 'game'
export type ChatTypes = 'party' | 'all' | 'whisper'
export type UserStatus = 'Online' | 'Offline' | 'Away'
export type GameStatus = 'queued' | 'dequeued' | 'playing'

export type UserDataFromDB = {
  id: UserId
  partyId: RoomId,
  name: string
  friends: UserId[]
  partyPublic: {
    status: GameStatus
    gameType: MultiplayerGameTypes
  }
  pendingInvites: Record<UserId, PartyId>
  pendingRequestsToJoin: Record<UserId, true>
  isHost: boolean
  status: UserStatus
  avatarSrc: string
}
export type UserDataFromAPI = {
  id: UserId
  partyId: RoomId,
  name: string
  friends: UserDataFromDB[]
  partyPublic: {
    status: GameStatus
    gameType: MultiplayerGameTypes
  }
  pendingRequestsToJoin: Record<UserId, true>
  pendingInvites: Record<UserId, PartyId>
  isHost: boolean
  status: UserStatus
  avatarSrc: string
}
export type SlotType = 'team1' | 'team2' | 'observers' | 'coopTeam' | 'solo' | 'players' | 'player'
export type PlayerSlots = OneVOneSlotsCustom | CoopSlotsCustom | OneVAllSlotsCustom | OnePlayerSlotsQueueing | CoopSlotsQueueing
export type CustomPlayerSlots = OneVOneSlotsCustom | CoopSlotsCustom | OneVAllSlotsCustom
export type QueueingPlayerSlots = OnePlayerSlotsQueueing | CoopSlotsQueueing

export type Slot = {
  max: number
  users: UserId[]
}

export type OnePlayerSlotsQueueing = {
  player: Slot
}

export type CoopSlotsQueueing = {
  coopTeam: Slot
}

export type OneVAllSlotsCustom = {
  solo: Slot
  coopTeam: Slot
  observers: Slot
}

export type OneVOneSlotsCustom = {
  player1: Slot
  player2: Slot
  observers: Slot
}

export type CoopSlotsCustom = {
  team1: Slot
  team2: Slot
  observers: Slot
}

export type SocketDataItem<K> = {
  action: K
  data: any | Record<string, any>
}

export type ServerToClientActions = 
  'confirmedLoggedIn' | 'sendAllFriends' | 
  'updateFriendsData' | 'sendPartyRoomId' | 
  'getUsersInMain' | 'playerDisconnected' |
  'accountAlreadyInUse' | 'updatePartyAndUserData' |
  'updateUserData' | 'updatePartyData' |
  'incomingChatMessage' | 'getAllChatMessages' |
  'matchFound'

export type ClientToServerActions = 
  'createPartyRoom' | 'createGameRoom' | 
  'getAllFriends' | 'updatePartyRoomType' | 
  'deleteRoom' | 'addUserToRoom' | 
  'removeUserFromRoom' | 'sendChatMessage' | 
  'inviteToParty' | 'acceptInvitation' |
  'declineInvitation' | 'leaveAllPopulatedParties' | 
  'addPlayerToSlot' | 'getAllChatMessages' |
  'removePlayerToObservers' | 'requestToJoinParty' | 
  'acceptRequestToJoinParty' | 'declineRequestToJoinParty' |
  'removeFriend' | 'queueParty' | 'dequeueParty'
  
export type ClientToElectronActions =
  'initSocket'

export type DgramServerToClient = any

export type ClientToDgramServer = any

export type ChatMessageData = {
  id: number
  to: {
    chatType: 'party' | 'all' | 'whisper'
    recipient: string[]
  }
  userId: string
  username: string
  content: string
}