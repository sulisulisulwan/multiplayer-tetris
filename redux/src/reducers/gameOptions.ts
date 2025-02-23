import { createSlice } from "@reduxjs/toolkit";
import { AppState, GameOptions, SingleplayerOptions } from "multiplayer-tetris-types";
import { getDefaultGameOptions } from "../initialStates/getDefaultGameOptions";
import { setViewToMultiplayerMenu, setViewToSingleplayerMenu } from "./view";

const gameOptionsSlice = createSlice({
  name: 'gameOptions',
  initialState: {
    singleplayer: getDefaultGameOptions('singleplayer'),
    multiplayer: getDefaultGameOptions('multiplayer')
  },
  reducers: {
    updateVolume: (gameOptions, action: { type: string, payload: { gameType: 'singleplayer' | 'multiplayer', volumeField: 'soundeffects' | 'music', newValue: number }}) => {
      const { volumeField, newValue } = action.payload;
      gameOptions[action.payload.gameType].volume[volumeField] = newValue
      return gameOptions
    },
    updateGameOptionFieldValue: (gameOptions, action: { type: string, payload: { gameType: 'singleplayer' | 'multiplayer', stateField: keyof GameOptions, newValue: any }}) => {
      const { stateField, newValue } = action.payload;
      (gameOptions[action.payload.gameType][stateField] as any) = newValue
      return gameOptions
    },
    updateRangeValue(gameOptions, action: { type: string, payload: { gameType: 'singleplayer' | 'multiplayer', stateField: keyof GameOptions, min: number, max: number, actionSymbol: '-' | '+'}}) {
        const { stateField, min, max, actionSymbol } = action.payload
        let newState = gameOptions[action.payload.gameType][stateField as keyof SingleplayerOptions] as number
      
        if (actionSymbol === '+' && newState < max) {
          newState += 1
        } else if (actionSymbol === '-' && newState > min) {
          newState -= 1
        }
        (gameOptions[action.payload.gameType][stateField] as any) = newState
        return gameOptions
    },
    updateToggleField(gameOptions, action: { type: string, payload: { gameType: 'singleplayer' | 'multiplayer', stateField: keyof GameOptions }}) {
      const { stateField } = action.payload
      const newValue = !gameOptions[action.payload.gameType][stateField];
      (gameOptions[action.payload.gameType][stateField] as any) = newValue
      return gameOptions
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase<any>(setViewToSingleplayerMenu, (state) => { 
        return !state.singleplayer ? { ...state, singleplayer: getDefaultGameOptions('singleplayer') } : state
      })
      .addCase<any>(setViewToMultiplayerMenu, (state) => {
        return !state.multiplayer ? { ...state, multiplayer: getDefaultGameOptions('multiplayer') } : state
      })
  }

})

export const getGameOptions = (state: AppState) => state.gameOptions
export const {
  updateVolume,
  updateGameOptionFieldValue,
  updateRangeValue,
  updateToggleField,
} = gameOptionsSlice.actions

export default gameOptionsSlice.reducer