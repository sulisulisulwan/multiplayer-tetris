import { createSlice, CaseReducer, SliceCaseReducers } from "@reduxjs/toolkit";
import { setViewToMainMenu, setViewToMultiplayer, setViewToSingleplayer } from "./view";
import getDefaultGameStates from "../initialStates/getDefaultGameStates";
import { AppState, GameOptions, MultiplayerLocalGameState, SingleplayerLocalGameState, SingleplayerOptions } from "multiplayer-tetris-types";
import { getInitialPlayfield } from "../initialStates/getInitialPlayingField";

export const gameStateSlice =  createSlice<SingleplayerLocalGameState | null, SliceCaseReducers<SingleplayerLocalGameState | null>, any, any>({
  name: 'gameState',
  initialState: null,
  reducers: {
    updateMultipleGameStateFields: (gameState, action: { type: string, payload: Partial<SingleplayerLocalGameState>}) => {
      const updatedFields = action.payload
      return {
        ...gameState as unknown as SingleplayerLocalGameState,
        ...updatedFields
      }
    },
    updateVolume: (gameState, action: { type: string, payload: { volumeField: 'soundeffects' | 'music', newValue: number }}) => {
      const { volumeField, newValue } = action.payload;
      (gameState as SingleplayerLocalGameState).gameOptions.volume[volumeField] = newValue
      return gameState
    },
    updateGameOptionFieldValue: (gameState, action: { type: string, payload: { stateField: keyof GameOptions, newValue: any }}) => {
      const { stateField, newValue } = action.payload;
      ((gameState as SingleplayerLocalGameState).gameOptions[stateField] as any) = newValue
      return gameState
    },
    updateRangeValue(gameState, action: { type: string, payload: { stateField: keyof GameOptions, min: number, max: number, actionSymbol: '-' | '+'}}) {
        const { stateField, min, max, actionSymbol } = action.payload
        let newState = ((gameState as SingleplayerLocalGameState).gameOptions as SingleplayerOptions)[stateField as keyof SingleplayerOptions] as number
      
        if (actionSymbol === '+' && newState < max) {
          newState += 1
        } else if (actionSymbol === '-' && newState > min) {
          newState -= 1
        }
        ((gameState as SingleplayerLocalGameState).gameOptions[stateField] as any) = newState
        return gameState
    },
    updateToggleField(gameState, action: { type: string, payload: { stateField: keyof GameOptions }}) {
      const { stateField } = action.payload
      const newValue = !((gameState as SingleplayerLocalGameState).gameOptions as SingleplayerOptions)[stateField as keyof SingleplayerOptions];
      ((gameState as SingleplayerLocalGameState).gameOptions[stateField] as any) = newValue
      return gameState
    },
    initializeSinglePlayerGame(gameState) {
      (gameState as SingleplayerLocalGameState).currentLevel = (gameState as SingleplayerLocalGameState).gameOptions.startingLevel;
      (gameState as SingleplayerLocalGameState).currentGamePhase = 'pregame';
      (gameState as SingleplayerLocalGameState).playfield = getInitialPlayfield();
      (gameState as SingleplayerLocalGameState).playfieldOverlay = getInitialPlayfield()
      return gameState
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setViewToMainMenu, () => null)
      .addCase<any>(setViewToMultiplayer, () => getDefaultGameStates('multiplayer') as SingleplayerLocalGameState)
      .addCase<any>(setViewToSingleplayer, () => getDefaultGameStates('singleplayer') as SingleplayerLocalGameState)
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