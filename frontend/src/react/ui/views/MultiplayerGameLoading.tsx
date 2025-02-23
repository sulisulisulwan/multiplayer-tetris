import * as React from 'react'
import { useSelector } from 'react-redux'
import { UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types'

const MultiplayerGameLoading = () => {

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
      }}
    >
      <div style={{
        fontFamily: 'Exo',
        fontSize: '20vh'
      }}>LOADING...</div>
    </div>
  )

}

export default MultiplayerGameLoading