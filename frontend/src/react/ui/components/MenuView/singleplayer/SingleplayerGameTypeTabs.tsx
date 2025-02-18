import * as React from 'react'
import HoverButton from '../../sharedComponents/HoverButton'
import { useSelector } from 'react-redux'
import { soundEffects } from '../../../../App'
import { getGameState } from 'multiplayer-tetris-redux'

type SingleplayerGameTypeTab = {
  displayName: 'MARATHON' | 'SPRINT' | 'ULTRA'
  metaName: string
}

type SingleplayerGameTypeTabsProps = {
  selectedGameMode: string,
  setSelectedGameMode: React.Dispatch<React.SetStateAction<string>>
}

const SingleplayerGameTypeTabs = ({ selectedGameMode, setSelectedGameMode }: SingleplayerGameTypeTabsProps ) => {
  
  const gameState = useSelector(getGameState)
  const gameTypes: SingleplayerGameTypeTab[] = [
    {
      displayName: 'MARATHON',
      metaName: 'sp-marathon'
    },
    {
      displayName: 'SPRINT',
      metaName: 'sp-sprint'
    },
    {
      displayName: 'ULTRA',
      metaName: 'sp-ultra'
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <ul 
        style={{ 
          listStyle: 'none', 
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          width: '80%',
          paddingBottom: 10,
          borderBottom: '.5px gray solid'
        }}>
        { gameTypes.map((gameType, idx) => {

          const isSelectedGameMode = selectedGameMode === gameType.metaName
          const isDisabled = isSelectedGameMode
          return (
            <li
              key={gameType.metaName + idx}
              style={{ 
                paddingLeft: 20,
                paddingRight: 20,
              }}
              >
              <HoverButton
                disabled={isDisabled}
                style={{
                  fontFamily: 'Exo',
                  color: isSelectedGameMode ? 'aqua' : 'white', 
                  background: 'none',
                  border: 'none',
                  opacity: isDisabled ? ''  : .6 ,
                  cursor: isSelectedGameMode ? '' : 'pointer'
                }}
                opacityMin={isSelectedGameMode ? 1 : .5}
                opacityMax={1}
                onHover={() => { if (!isDisabled) soundEffects.play('menuBasicButtonHover') }}
                onClick={() => {
                  soundEffects.play('menuBasicButtonClick')
                  setSelectedGameMode(gameType.metaName)
                }}
                children={gameType.displayName}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SingleplayerGameTypeTabs