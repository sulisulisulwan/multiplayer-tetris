import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../reducers/chat.js";
import gameStateReducer from "../reducers/gameState.js";
import partyReducer from "../reducers/party.js";
import userReducer from "../reducers/user.js";
import viewReducer from "../reducers/view.js";
import gameOptionsReducer from "../reducers/gameOptions.js";

export default configureStore({
  reducer: {
    chat: chatReducer,
    gameState: gameStateReducer,
    party: partyReducer,
    user: userReducer,
    view: viewReducer,
    gameOptions: gameOptionsReducer
  }
})

