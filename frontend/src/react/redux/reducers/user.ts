import { createSlice } from "@reduxjs/toolkit";
import { AppState, PartyRoomDataAPI, UserDataFromAPI, UserDataFromDB } from "multiplayer-tetris-types";

export const userSlice =  createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUserAndPartyData: (userState, action: { type: string, payload: { user: UserDataFromAPI, party: PartyRoomDataAPI } }) => action.payload.user,
    setUserData: (userState, action: { type: string, payload: boolean }) => action.payload,
    setUserFriendsData: (userState, action: {type: string, payload: UserDataFromDB[] }) => {
      return {
        ...userState,
        friends: action.payload
      }
    }
  }
})

export const getUserState = (state: AppState) => state.user
export const {
  setUserAndPartyData,
  setUserData,
  setUserFriendsData
} = userSlice.actions

export default userSlice.reducer