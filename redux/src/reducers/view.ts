import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "multiplayer-tetris-types";
import { initializeMultiPlayerGame, initializeSinglePlayerGame } from "./gameState.js";

export const viewSlice =  createSlice({
  name: 'view',
  initialState: 'menu_main',
  // initialState: 'matchFound',
  reducers: {
    setViewToMainMenu: (state) => 'menu_main',
    setViewToSingleplayerMenu: (state) => 'menu_singleplayer',
    setViewToLoadGameSingleplayer: (state) => 'loadGame_singleplayer',
    setViewToMultiplayerMenu: (state) => 'menu_multiplayer',
    setView: (state: string, action: { type: string, payload: string }) => action.payload
  },
  extraReducers: (builder) => {
    builder
      .addCase<any>(initializeSinglePlayerGame, () => 'gameActive_singleplayer')
      .addCase<any>(initializeMultiPlayerGame, () => 'matchFound')
  }
})


export const getViewState = (state: AppState) => state.view
export const {
  setViewToMainMenu,
  setViewToSingleplayerMenu,
  setViewToMultiplayerMenu,
  setViewToLoadGameSingleplayer,
  setView
} = viewSlice.actions

export default viewSlice.reducer