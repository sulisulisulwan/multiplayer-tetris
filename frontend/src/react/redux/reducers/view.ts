import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "multiplayer-tetris-types";
import { initializeSinglePlayerGame } from "./gameState";
import { initializeMultiplayerGame } from "./multiplayerGameState";

export const viewSlice =  createSlice({
  name: 'view',
  initialState: 'mainMenu',
  // initialState: 'matchFound',
  reducers: {
    setViewToMainMenu: (state) => 'mainMenu',
    setViewToSingleplayer: (state) => 'singleplayer',
    setViewToMultiplayer: (state) => 'multiplayer',
    setView: (state: string, action: { type: string, payload: string }) => action.payload
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSinglePlayerGame, () => 'gameActive')
      .addCase(initializeMultiplayerGame, () => 'matchFound')
  }
})


export const getViewState = (state: AppState) => state.view
export const {
  setViewToMainMenu,
  setViewToSingleplayer,
  setViewToMultiplayer,
  setView
} = viewSlice.actions

export default viewSlice.reducer