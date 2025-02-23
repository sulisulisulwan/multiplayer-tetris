import { MultiplayerLocalGameState } from "../frontend"
import { ChatMessageData, GameId, GameStatus, MultiplayerGameTypes, PlayerSlots, RoomId, UserDataFromDB, UserId } from "../shared"


export interface MainRoomData {
  users: Record<UserId, UserDataFromDB>
}

export type NonMainRoomTypes = 'party' | 'game'
export type NonMainRoomMap = Record<RoomId, PartyRoomDataFromDB> | Record<RoomId, GameRoomDataFromDB>
export type NonMainRoomData = PartyRoomDataFromDB | GameRoomDataFromDB

export type RoomData = MainRoomData | Record<RoomId, PartyRoomDataFromDB> | Record<RoomId, GameRoomDataFromDB>

export interface PartyRoomDataFromDB{
  id: RoomId
  gameType: MultiplayerGameTypes
  status: GameStatus
  users: UserId[]
  gameId: GameId | null
  hostId: UserId 
  slots: PlayerSlots
}

export interface PartyRoomDataAPI{
  id: RoomId
  gameType: MultiplayerGameTypes
  status: GameStatus
  users: UserDataFromDB[]
  gameId: GameId | null
  hostId: UserId 
  slots: PlayerSlots
}

export interface GameRoomDataFromDB {
  id: RoomId
  gameState: Record<UserId, MultiplayerLocalGameState>
  party1: PartyRoomDataAPI
  party2: PartyRoomDataAPI
  gameType: MultiplayerGameTypes
  slots: PlayerSlots
  users: UserId[]
}
export interface GameRoomDataAPI {
  id: RoomId
  party1: PartyRoomDataFromDB
  party2: PartyRoomDataFromDB
  gameType: MultiplayerGameTypes
  slots: PlayerSlots
  users: UserDataFromDB[]
}

export interface RoomsData {
  main: MainRoomData
  party: Record<RoomId, PartyRoomDataFromDB>,
  game: Record<GameId, GameRoomDataFromDB>
}

export interface RoomsDataWithoutMain {
  party: Record<RoomId, PartyRoomDataFromDB>,
  game: Record<GameId, GameRoomDataFromDB>
}

export interface DatabaseAPIData {
  rooms: RoomsData
  users: Record<UserId, UserDataFromDB>
  chat: {
    messages: ChatMessageData[]
  }
}
