import * as React from 'react'

import MenuOptionWrapper from '../../MenuOptionWrapper'
import { useDispatch } from 'react-redux'
import { setView } from 'multiplayer-tetris-redux'


const Help = () => {
  const dispatch = useDispatch()
  return(
    <MenuOptionWrapper
      clsName="singleplayer-help-view"
      optionTitle='HELP'
      onBackButtonClick={() => { 
        dispatch(setView('singleplayer'))
      }}
    >
      <div 
        style={{ 
          color: 'white',
          fontFamily: 'Exo',
          height: '100%'
        }}
      >
        <div>
          <h1 style={{ textAlign: 'center' }}>SINGLEPLAYER HELP</h1>
          {/* <SingleplayerGameTypeTabs selectedGameMode={selectedGameMode} setSelectedGameMode={setSelectedGameMode}/> */}
        </div>
        find help here
      </div>
    </MenuOptionWrapper>
  )
}

export default Help