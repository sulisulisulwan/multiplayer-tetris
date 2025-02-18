import store from './store/store'
import { 
  activateChat,
  activateChatToWhisper,
  deactivateChat,
  getChatState,
  setChatInputToFocus, 
  resetChatRecipientState, 
  setChatRecipientToTypeUserWhisper,
  setChatRecipientToCommitUserWhisper, 
  setChatRecipientToAll,
  addIncomingChatMessage,
  resetChatMessagesToAllMessagesOnServer 
} from './reducers/chat'

import {
  getGameState,
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
  initializeSinglePlayerGame
} from './reducers/gameState'

import {
  updateMultipleGameStateFields,
  initializeMultiplayerGame,
  getMultiplayerGameState
} from './reducers/multiplayerGameState'

import {
  getPartyState,
  setPartyState,
  updatePartyRoomId
} from './reducers/party'

import {
  getUserState,
  setUserAndPartyData,
  setUserData,
  setUserFriendsData
} from './reducers/user'

import {
  getViewState,
  setViewToMainMenu,
  setViewToSingleplayer,
  setViewToMultiplayer,
  setView,
} from './reducers/view'

//Store
export {
  store,
}

//Selectors
export {
  getChatState,
  getGameState,
  getMultiplayerGameState,
  getPartyState,
  getUserState,
  getViewState,
}

//Reducers
export {
  //chat
  activateChat,
  activateChatToWhisper,
  deactivateChat,
  setChatInputToFocus, 
  resetChatRecipientState, 
  setChatRecipientToTypeUserWhisper,
  setChatRecipientToCommitUserWhisper, 
  setChatRecipientToAll,
  addIncomingChatMessage,
  resetChatMessagesToAllMessagesOnServer,

  //gameState 
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
  initializeSinglePlayerGame,

  //multiplayerGameState
  updateMultipleGameStateFields,
  initializeMultiplayerGame,

  //party
  setPartyState,
  updatePartyRoomId,

  //user
  setUserAndPartyData,
  setUserData,
  setUserFriendsData,

  //view
  setViewToMainMenu,
  setViewToSingleplayer,
  setViewToMultiplayer,
  setView
}