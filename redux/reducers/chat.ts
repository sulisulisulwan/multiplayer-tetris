import { createSlice, CaseReducer } from "@reduxjs/toolkit";
import { AppState, ChatMessageData, ChatState, ReduxActionObj, UserId } from "multiplayer-tetris-types";

export const chatSlice =  createSlice<ChatState, Record<string, CaseReducer<ChatState, { payload: any; type: string; }>>, any, any>({
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
    activateChat: (chatState, action: { type: string, payload: { shiftKey: boolean, ctrlKey: boolean }}) => {
      const { shiftKey, ctrlKey } = action.payload
      return {
        ...chatState,
        inputFocused: true,
        to: {
          chatType: shiftKey ? 'all' : ctrlKey ? 'whisper' : 'party',
          recipient: null
        }
      }
    },
    activateChatToWhisper: (chatState, action: { type: string, payload: any}) => {
      return {
        ...chatState, 
        inputFocused: true,
        to: {
          chatType: 'whisper',
          recipient: null
        }
      }
    },
    deactivateChat: (chatState, action: { type: string, payload: any}) => {
      return {
        ...chatState, 
        inputFocused: false,
        to: {
          chatType: 'party',
          recipient: null
        }
      } 
    },
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
  activateChat,
  activateChatToWhisper,
  deactivateChat,
  setChatInputToFocus, 
  resetChatRecipientState, 
  setChatRecipientToTypeUserWhisper,
  setChatRecipientToCommitUserWhisper, 
  setChatRecipientToAll,
  addIncomingChatMessage,
  resetChatMessagesToAllMessagesOnServer
} = chatSlice.actions

export default chatSlice.reducer