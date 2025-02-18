import { createSlice, CaseReducer, SliceCaseReducers,   } from "@reduxjs/toolkit";
import { AppState, PartyRoomDataAPI, UserDataFromAPI, UserDataFromDB } from "multiplayer-tetris-types";
createSlice

export const userSlice =  createSlice<UserDataFromAPI | null, SliceCaseReducers<UserDataFromAPI | null>, any, any>({
  name: 'user',
  initialState: null,
  reducers: {
    setUserAndPartyData: (userState: UserDataFromAPI | null, action: { type: string, payload: { user: UserDataFromAPI, party: PartyRoomDataAPI } }) => action.payload.user,
    setUserData: (userState: UserDataFromAPI | null, action: { type: string, payload: UserDataFromAPI }) => action.payload,
    setUserFriendsData: (userState: UserDataFromAPI | null, action: {type: string, payload: UserDataFromDB[] }) => {
      return {
        ...userState as unknown as UserDataFromAPI,
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