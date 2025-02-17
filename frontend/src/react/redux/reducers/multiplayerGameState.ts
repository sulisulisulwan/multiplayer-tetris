import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "multiplayer-tetris-types";
import { soundEffects } from "../../App";

export const multiplayerGameStateSlice =  createSlice({
  name: 'multiplayerGameState',
  initialState: null,
  reducers: {
    updateMultipleGameStateFields: (multiplayerGameState, action) => {
      const updatedFields = action.payload
      return {
        ...multiplayerGameState,
        ...updatedFields
      }
    },
    initializeMultiplayerGame: (multiplayerGameState, action) => {
      return action.payload
    }
  },
})

export const getMultiplayerGameState = (state: AppState) => state.multiplayerGameState
export const {
  updateMultipleGameStateFields,
  initializeMultiplayerGame
} = multiplayerGameStateSlice.actions

export default multiplayerGameStateSlice.reducer