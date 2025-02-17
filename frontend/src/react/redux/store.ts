import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chat";
import gameStateReducer from "./reducers/gameState";
import partyReducer from "./reducers/party";
import serverReducer from "./reducers/server";
import userReducer from "./reducers/user";
import viewReducer from "./reducers/view";
import multiplayerGameStateReducer from "./reducers/multiplayerGameState";

export default configureStore({
  reducer: {
    chat: chatReducer,
    gameState: gameStateReducer,
    multiplayerGameState: multiplayerGameStateReducer,
    party: partyReducer,
    user: userReducer,
    view: viewReducer
  }
})

