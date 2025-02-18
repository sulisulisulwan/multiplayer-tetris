import * as React from 'react'

import { ChatMessageData, ChatTypes, CoopSlotsCustom, CoopSlotsQueueing, GameStatus, MultiplayerGameTypes, OnePlayerSlotsQueueing, OneVAllSlotsCustom, OneVOneSlotsCustom, UserDataFromAPI, UserStatus } from "../../shared"
import { SingleplayerLocalGameState, MultiplayerLocalGameState } from "../core"

export type ReduxActionObj<K> = {
  action: string
  payload: K
}

export interface ChatState {
  inputFocused: boolean
  to: {
    chatType: ChatTypes
    recipient: string[]
  }
  messages: ChatMessageData[]
}

export interface PartyState {
  id: string
  gameId: string | null
  slots: OneVOneSlotsCustom | OneVAllSlotsCustom | CoopSlotsCustom | OnePlayerSlotsQueueing | CoopSlotsQueueing
  gameType: MultiplayerGameTypes
  host: string 
  status: GameStatus
  users: string[] //user ids
}

export interface AppState {
  view: string
  gameState: SingleplayerLocalGameState | MultiplayerLocalGameState
  multiplayerGameState: any
  user: UserDataFromAPI
  party: PartyState
  chat: ChatState
}