import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { AppState, PartyId, PartyState } from "multiplayer-tetris-types";
import { setUserAndPartyData } from "./user";

export const partySlice =  createSlice<PartyState | null, SliceCaseReducers<PartyState | null>, any, any>({
  name: 'party',
  initialState: null,
  reducers: {
    setPartyState: (state, action: { type: string, payload: PartyState }) => action.payload,
    updatePartyRoomId: (state, action: { type: string, payload: PartyId}) => {
      return {
        ...state as unknown as PartyState,
        id: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase<any>(setUserAndPartyData, (state, action: { type: string, payload: any }) => action.payload.party)
  }
})

export const getPartyState = (state: AppState) => state.party
export const {
  setPartyState,
  updatePartyRoomId
} = partySlice.actions

export default partySlice.reducer