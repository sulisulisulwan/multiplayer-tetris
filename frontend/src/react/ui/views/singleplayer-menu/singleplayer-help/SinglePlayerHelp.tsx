import * as React from 'react'

import MenuOptionWrapper from '../../../sharedComponents/MenuOptionWrapper'
import { useDispatch } from 'react-redux'
import { setView } from 'multiplayer-tetris-redux'


const SinglePlayerHelp = () => {
  const dispatch = useDispatch()
  return(
    <MenuOptionWrapper
      clsName="singleplayer-help-view"
      optionTitle='HELP'
      onBackButtonClick={() => { 
        dispatch(setView('menu_singleplayer'))
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

export default SinglePlayerHelp