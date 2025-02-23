import frontendStore from './store/store.js'
import { getBackendStore } from './store/backendStore.js'
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
} from './reducers/chat.js'

import {
  getGameState,
  setGameStateToSingleplayer,
  initGameStateToSingleplayer,
  updateMultipleGameStateFieldsSingleplayer,
  initializeSinglePlayerGame,
  initializeMultiPlayerGame
} from './reducers/gameState.js'


import {
  getPartyState,
  setPartyState,
  updatePartyRoomId
} from './reducers/party.js'

import {
  getGameOptions,
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
} from './reducers/gameOptions.js'

import {
  getUserState,
  setUserAndPartyData,
  setUserData,
  setUserFriendsData
} from './reducers/user.js'

import {
  getViewState,
  setViewToMainMenu,
  setViewToSingleplayerMenu,
  setViewToMultiplayerMenu,
  setViewToLoadGameSingleplayer,
  setView,
} from './reducers/view.js'

//Store
export {
  frontendStore,
}
export {
  getBackendStore,
}

//Selectors
export {
  getChatState,
  getGameState,
  getPartyState,
  getUserState,
  getViewState,
  getGameOptions,
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
  setGameStateToSingleplayer,
  initGameStateToSingleplayer,
  updateMultipleGameStateFieldsSingleplayer,
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
  initializeSinglePlayerGame,
  initializeMultiPlayerGame,


  //party
  setPartyState,
  updatePartyRoomId,

  //user
  setUserAndPartyData,
  setUserData,
  setUserFriendsData,

  //view
  setViewToMainMenu,
  setViewToSingleplayerMenu,
  setViewToMultiplayerMenu,
  setViewToLoadGameSingleplayer,
  setView

  //gameOptions
}