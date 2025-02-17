import { createSlice } from "@reduxjs/toolkit";
import { setViewToMainMenu, setViewToMultiplayer, setViewToSingleplayer } from "./view";
import getDefaultGameStates from "../../allGetsAndSets/getDefaultGameStates";
import { AppState, SingleplayerOptions } from "multiplayer-tetris-types";
import { getInitialPlayfield } from "../../allGetsAndSets/getInitialPlayingField";

export const gameStateSlice =  createSlice({
  name: 'gameState',
  initialState: null,
  reducers: {
    updateMultipleGameStateFields: (gameState, action) => {
      const updatedFields = action.payload
      return {
        ...gameState,
        ...updatedFields
      }
    },
    updateVolume: (gameState, action) => {
      const { volumeField, newValue } = action.payload
      gameState.gameOptions.volume[volumeField] = newValue
      return gameState
    },
    updateGameOptionFieldValue: (gameState, action) => {
      const { stateField, newValue } = action.payload
      gameState.gameOptions[stateField] = newValue
      return gameState
    },
    updateRangeValue(gameState, action) {
        const { stateField, min, max, actionSymbol } = action.payload
        let newState = (gameState.gameOptions as SingleplayerOptions)[stateField as keyof SingleplayerOptions] as number
      
        if (actionSymbol === '+' && newState < max) {
          newState += 1
        } else if (actionSymbol === '-' && newState > min) {
          newState -= 1
        }
        gameState.gameOptions[stateField] = newState
        return gameState
    },
    updateToggleField(gameState, action) {
      const { stateField } = action.payload
      const newValue = !(gameState.gameOptions as SingleplayerOptions)[stateField as keyof SingleplayerOptions]
      gameState.gameOptions[stateField] = newValue
      return gameState
    },
    initializeSinglePlayerGame(gameState) {
      gameState.currentLevel = gameState.gameOptions.startingLevel
      gameState.currentGamePhase = 'pregame'
      gameState.playfield = getInitialPlayfield()
      gameState.playfieldOverlay = getInitialPlayfield()
      return gameState
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setViewToMainMenu, () => null)
      .addCase(setViewToMultiplayer, () => getDefaultGameStates('multiplayer'))
      .addCase(setViewToSingleplayer, () => getDefaultGameStates('singleplayer'))
  }
})

export const getGameState = (state: AppState) => state.gameState
export const {
  updateMultipleGameStateFields,
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
  initializeSinglePlayerGame
} = gameStateSlice.actions

export default gameStateSlice.reducer