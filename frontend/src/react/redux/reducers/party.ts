import { createSlice } from "@reduxjs/toolkit";
import { AppState, PartyId, PartyRoomDataAPI } from "multiplayer-tetris-types";
import { setUserAndPartyData } from "./user";

export const partySlice =  createSlice({
  name: 'party',
  initialState: null,
  reducers: {
    setPartyState: (state, action: { type: string, payload: PartyRoomDataAPI }) => action.payload,
    updatePartyRoomId: (state, action: { type: string, payload: PartyId}) => {
      return {
        ...state,
        id: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setUserAndPartyData, (state, action) => action.payload.party)
  }
})

export const getPartyState = (state: AppState) => state.party
export const {
  setPartyState,
  updatePartyRoomId
} = partySlice.actions

export default partySlice.reducer