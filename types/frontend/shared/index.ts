import * as React from 'react'

import { ChatMessageData, ChatTypes, CoopSlotsCustom, CoopSlotsQueueing, GameStatus, MultiplayerGameTypes, OnePlayerSlotsQueueing, OneVAllSlotsCustom, OneVOneSlotsCustom, UserDataFromAPI, UserStatus } from "../../shared"
import { SingleplayerLocalGameState, MultiplayerLocalGameState } from "../core"

export type ReduxActionObj<K> = {
  action: string
  payload: K
}

export interface AppState {
  view: string
  gameState: SingleplayerLocalGameState | MultiplayerLocalGameState
  multiplayerGameState: any
  user: UserDataFromAPI
  party: {
    id: string
    gameId: string | null
    slots: OneVOneSlotsCustom | OneVAllSlotsCustom | CoopSlotsCustom | OnePlayerSlotsQueueing | CoopSlotsQueueing
    gameType: MultiplayerGameTypes
    host: string 
    status: GameStatus
    users: string[] //user ids
  }
  chat: {
    inputFocused: boolean
    to: {
      chatType: ChatTypes
      recipient: string[]
    }
    messages: ChatMessageData[]
  }
}

export type SetAppState = React.Dispatch<React.SetStateAction<AppState>>