import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { AppState, MultiplayerLocalGameState } from "multiplayer-tetris-types";

export const multiplayerGameStateSlice =  createSlice<MultiplayerLocalGameState | null, SliceCaseReducers<MultiplayerLocalGameState | null>, any, any>({
  name: 'multiplayerGameState',
  initialState: null,
  reducers: {
    updateMultipleGameStateFields: (multiplayerGameState, action: { type: string, payload: Partial<MultiplayerLocalGameState> }) => {
      const updatedFields = action.payload
      return {
        ...multiplayerGameState as unknown as MultiplayerLocalGameState,
        ...updatedFields
      }
    },
    initializeMultiplayerGame: (multiplayerGameState, action: { type: string, payload: MultiplayerLocalGameState }) => {
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