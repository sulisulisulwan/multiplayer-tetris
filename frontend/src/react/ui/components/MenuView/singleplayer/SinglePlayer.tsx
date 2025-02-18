import * as React from 'react'
import HoverButton from '../../sharedComponents/HoverButton'
import MenuOptionWrapper from '../MenuOptionWrapper'
import { useDispatch } from 'react-redux'
import { setView, setViewToMainMenu } from 'multiplayer-tetris-redux'
import SingleplayerGameTypeTabs from './SingleplayerGameTypeTabs'
import { soundEffects } from '../../../../App'


type SinglePlayerModes = 'sp-ultra' | 'sp-sprint' | 'sp-marathon'
type SinglePlayerModeExplanations = Record<SinglePlayerModes, string>

const modeExplanations: SinglePlayerModeExplanations  = {
  'sp-marathon': "This is the traditional game of tetris. Here, the player competes purely for points over 15 levels of play, at which point the game ends. each tetris variant using the Marathon method of game play has a specific Level up condition.",
  'sp-sprint': "The player chooses a starting level, and competes to clear a set number of lines (typically 40) in the shortest amount of time. the game ends when a game over Condition is met, or when the player clears the set number of lines. this game does not Level up.",
  'sp-ultra': "the player's objective is to a) score as many points, or b) clear as many lines as possible within a two or three minute time span. the game ends when a game over Condition is met, or when the time limit expires. this game does not Level up.",
}

const getModeExplanation = (mode: string): string => {
  return modeExplanations[mode as keyof SinglePlayerModeExplanations]
}

const subMenuItems: any[] = [
  {
    displayName: 'OPTIONS',
    metaName: 'singleplayer_options'
  },
  {
    displayName: 'HIGHSCORE',
    metaName: 'singleplayer_highscore'
  },
  {
    displayName: 'HELP',
    metaName: 'singleplayer_help'
  },
]


const SinglePlayer = () => {
  const dispatch = useDispatch()
  const [ selectedGameMode, setSelectedGameMode ] = React.useState('sp-marathon')

  return(
    <MenuOptionWrapper
      clsName="singleplayer-menu"
      optionTitle=''
      onBackButtonClick={() => { 
        dispatch(setViewToMainMenu())
      }}
    >
        <div 
          className="game-room"
          style={{ 
            color: 'white',
            fontFamily: 'Exo',
            height: '100%'
          }}
        >
          <div>
          <div 
            style={{ 
              paddingTop: '3.5vw',
              textAlign: 'center',
              fontSize: '3vw',
          }}>SINGLEPLAYER MENU</div>
            <div></div>
            <SingleplayerGameTypeTabs selectedGameMode={selectedGameMode} setSelectedGameMode={setSelectedGameMode}/>
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
                { subMenuItems.map((menuItem, idx) => {

                  return (
                    <li
                      key={menuItem.metaName + menuItem.displayName + idx}
                      style={{ 
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}
                      >
                      <HoverButton
                        style={{
                          fontFamily: 'Exo',
                          color: 'white', 
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        opacityMin={.5}
                        opacityMax={1}
                        onHover={() => { soundEffects.play('menuBasicButtonHover') }}
                        onClick={() => {
                          soundEffects.play('menuBasicButtonClick')
                          dispatch(setView(menuItem.metaName))
                        }}
                        children={menuItem.displayName}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div>
            <div
              style={{
                marginTop: 40,
                textAlign: 'center',
                fontFamily: 'Exo',
                fontSize: 20,
                fontWeight: 900,
                color: 'white'
              }}
            >{selectedGameMode.split('-')[1].toUpperCase()}</div>
              {/**TODO: We must pass the game mode to top level app state.  But we must also build out infra for different game mode variations */}
            <div 
              style={{
                marginTop: 25,
                marginLeft: '20%',
                marginRight: '20%',
                fontFamily: 'Arial',
                fontSize: 15,
                color: 'white'
              }}
            >{getModeExplanation(selectedGameMode)}</div>
            <div style={{ textAlign: 'center', marginTop: 50 }}>
              <HoverButton
                onClick={() => { 
                  dispatch(setView('loadGame'))
                }}
                style={{ 
                  padding: 20, 
                  fontSize: 15, 
                  fontWeight: 900, 
                  fontFamily: 'Exo', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'slategray',
                  color: 'white',
                  border: 'solid black 1px',
                  minWidth: 100,
                }} 
                children="START"
              />
            </div>
          </div>
      </div>

    </MenuOptionWrapper>
  )
}

export default SinglePlayer