import { Action, createSlice } from "@reduxjs/toolkit";
import { AppState, ChatMessageData, ReduxActionObj, UserId } from "multiplayer-tetris-types";
import { ActionCreator } from "redux";

export const chatSlice =  createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    inputFocused: false,
    to: {
      chatType: 'party',
      recipient: []
    }
  },
  reducers: {
    setChatInputToFocus: (chatState, action: { type: string, payload: boolean }) => {
      chatState.inputFocused = action.payload
    },
    setChatRecipientToCommitUserWhisper: (chatState, action: { type: string, payload: UserId }) => {
      chatState.to = {
        chatType: 'whisper',
        recipient: [action.payload]
      }
    },
    setChatRecipientToTypeUserWhisper: (chatState) => {
      chatState.to = {
        chatType: 'whisper',
        recipient: []
      }
    },
    setChatRecipientToAll: (chatState, action: { type: string, payload: UserId[] }) => {
      chatState.to = {
        chatType: 'all',
        recipient: action.payload
      }
    },
    resetChatRecipientState: (chatState) => {
      chatState.to = {
        chatType: 'party',
        recipient: []
      }
    },
    addIncomingChatMessage: (chatState, action: { type: string, payload: ChatMessageData } ) => {
      const messages = chatState.messages.slice()
      messages.push(action.payload)
      chatState.messages = messages
    },
    resetChatMessagesToAllMessagesOnServer: (chatState, action: { type: string, payload: ChatMessageData[] }) => {
      chatState.messages = action.payload
    }
  }
})

export const getChatState = (state: AppState) => state.chat
export const { 
  setChatInputToFocus, 
  resetChatRecipientState, 
  setChatRecipientToTypeUserWhisper,
  setChatRecipientToCommitUserWhisper, 
  setChatRecipientToAll,
  addIncomingChatMessage,
  resetChatMessagesToAllMessagesOnServer
} = chatSlice.actions

export default chatSlice.reducer