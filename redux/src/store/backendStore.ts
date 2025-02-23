import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "../reducers/gameState.js";
export const getBackendStore = (gameMode: string) => {

  if (gameMode === 'singleplayer') return configureStore({
    reducer: {
      gameState: gameStateReducer,
    }
  })

  if (gameMode === 'multiplayer') return configureStore({
    reducer: {
      gameState: gameStateReducer,
    }
  })
}
