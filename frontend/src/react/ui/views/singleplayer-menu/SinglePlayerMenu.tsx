import * as React from 'react'
import HoverButton from '../../sharedComponents/HoverButton'
import MenuOptionWrapper from '../../sharedComponents/MenuOptionWrapper'
import { useDispatch } from 'react-redux'
import { getGameState, setView, setViewToMainMenu, updateMultipleGameStateFieldsSingleplayer } from 'multiplayer-tetris-redux'
import SingleplayerGameTypeTabs from './SingleplayerGameTypeTabs'
import { soundEffects } from '../../../App'
import { useSelector } from 'react-redux'


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
    metaName: 'menu_singleplayer_options'
  },
  {
    displayName: 'HIGHSCORE',
    metaName: 'menu_singleplayer_highscore'
  },
  {
    displayName: 'HELP',
    metaName: 'menu_singleplayer_help'
  },
]


const SinglePlayerMenu = () => {
  const dispatch = useDispatch()
  const gameState = useSelector(getGameState)

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
            <SingleplayerGameTypeTabs selectedGameMode={gameState} setSelectedGameMode={(gameMode) => dispatch(updateMultipleGameStateFieldsSingleplayer({ gameMode })) }/>
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <ul 
                style={{ 
                  margin: 0,
                  listStyle: 'none', 
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  width: '80%',
                  height: '100%',
                  paddingBottom: '1vh',
                  borderBottom: '.1vh gray solid'
                }}>
                { subMenuItems.map((menuItem, idx) => {

                  return (
                    <li
                      key={menuItem.metaName + menuItem.displayName + idx}
                      style={{ 
                        paddingLeft: '2vw',
                        paddingRight: '2vw',
                      }}
                      >
                      <HoverButton
                        style={{
                          fontSize: '1.7vh',
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
                marginTop: '4vh',
                textAlign: 'center',
                fontFamily: 'Exo',
                fontSize: '3vh',
                fontWeight: 900,
                color: 'white'
              }}
            >{gameState.gameMode.split('-')[1].toUpperCase()}</div>
              {/**TODO: We must pass the game mode to top level app state.  But we must also build out infra for different game mode variations */}
            <div 
              style={{
                // marginTop: 25,
                marginLeft: '20%',
                marginRight: '20%',
                fontFamily: 'Arial',
                fontSize: '2vh',
                color: 'white'
              }}
            >{getModeExplanation(gameState.gameMode)}</div>
            <div style={{ textAlign: 'center', marginTop: '10vh' }}>
              <HoverButton
                onClick={() => { 
                  dispatch(setView('loadGame_singleplayer'))
                }}
                style={{ 
                  padding: '2vh', 
                  fontSize: '2vh', 
                  fontWeight: 900, 
                  fontFamily: 'Exo', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(142, 57, 57, 0.8)',
                  color: 'white',
                  border: 'solid white .1vh',
                  minWidth: '8vw',
                }} 
                children="START"
              />
            </div>
          </div>
      </div>

    </MenuOptionWrapper>
  )
}

export default SinglePlayerMenu