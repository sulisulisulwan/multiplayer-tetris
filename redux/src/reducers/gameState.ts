import { AppState, GameOptions, GameRoomDataAPI, MultiplayerLocalGameState, SingleplayerLocalGameState, SingleplayerOptions, UserId } from "multiplayer-tetris-types";
import { createSlice, CaseReducer, SliceCaseReducers } from "@reduxjs/toolkit";
import { setViewToLoadGameSingleplayer, setViewToMainMenu, setViewToMultiplayerMenu, setViewToSingleplayerMenu } from "./view.js";
import getDefaultGameStates from "../initialStates/getDefaultGameStates.js";
import { getInitialPlayfield } from "../initialStates/getInitialPlayingField.js";

export const gameStateSlice =  createSlice<SingleplayerLocalGameState | null, SliceCaseReducers<SingleplayerLocalGameState | null>, any, any>({
  name: 'gameState',
  initialState: null,
  reducers: {
    setGameStateToSingleplayer: (gameState, action: { type: string, payload: SingleplayerLocalGameState })  => {
      return action.payload
    },
    initGameStateToSingleplayer: (gameState, action: { type: string, payload: { type: 'marathon' | 'ultra' | 'classic' | '1v1' | '1vAll' | 'coop', users?: UserId[] } }) => getDefaultGameStates(action.payload.type, action.payload.users) as SingleplayerLocalGameState,
    updateMultipleGameStateFieldsSingleplayer: (gameState, action: { type: string, payload: Partial<SingleplayerLocalGameState>}) => {
      const updatedFields = action.payload
      return {
        ...gameState as unknown as SingleplayerLocalGameState,
        ...updatedFields
      }
    },

    initializeSinglePlayerGame(gameState, action: { type: string, payload: GameOptions }) {
      //TODO: should apply all gameOptions to relevant fields

      (gameState as SingleplayerLocalGameState).gameOptions = action.payload;
      (gameState as SingleplayerLocalGameState).currentLevel = action.payload.startingLevel;
      (gameState as SingleplayerLocalGameState).currentGamePhase = 'pregame';
      (gameState as SingleplayerLocalGameState).playfield = getInitialPlayfield();
      (gameState as SingleplayerLocalGameState).playfieldOverlay = getInitialPlayfield()
      return gameState
    },

    initializeMultiPlayerGame(gameState, action: { type: string, payload: any }) {
      return action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setViewToMainMenu, () => null)
      .addCase<any>(setViewToMultiplayerMenu, () => getDefaultGameStates('multiplayer') as SingleplayerLocalGameState)
      .addCase<any>(setViewToSingleplayerMenu, () => getDefaultGameStates('singleplayer') as SingleplayerLocalGameState)
  }
})

export const getGameState = (state: AppState) => state.gameState
export const {
  setGameStateToSingleplayer,
  initGameStateToSingleplayer,
  updateMultipleGameStateFieldsSingleplayer,
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
  initializeSinglePlayerGame,
  initializeMultiPlayerGame
} = gameStateSlice.actions

export default gameStateSlice.reducer