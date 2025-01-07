import * as React from 'react'
import { appStateIF, setAppStateIF } from '../../../types'
import HoverButton from '../../sharedComponents/HoverButton'
import MenuOptionWrapper from '../MenuOptionWrapper'

interface singlePlayerPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

interface modeExplanationsIF {
  ultra: string
  sprint: string
  marathon: string
}

interface singlePlayerStateIF {
  selectedGameMode: string
}

class SinglePlayer extends React.Component<singlePlayerPropsIF, singlePlayerStateIF> {

  public modeExplanations: modeExplanationsIF

  constructor(props: singlePlayerPropsIF) {
    super(props)
    this.state = {
      selectedGameMode: 'marathon'
    }

    this.modeExplanations = {
      marathon: marathonExplanation,
      sprint: sprintExplanation,
      ultra: ultraExplanation
    }

  }

  getModeExplanation(mode: string): string {
    return this.modeExplanations[mode as keyof modeExplanationsIF]
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <MenuOptionWrapper
        clsName="singleplayer-menu"
        optionTitle='SINGLE PLAYER MENU'
        onBackButtonClick={() => { 
          setAppState((currentState: any) => { 
            return { 
              ...currentState, 
              view: 'mainMenu',
              gameOptions: null
            }
          }) 
        }}
      >
        <div>
          <ul style={{
            marginTop: 50,
            padding: 'none',
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: '20% 20% 20% 20% 20%'
          }}>
            <li/>
            <li><HoverButton 
              onClick={() => { this.setState({ selectedGameMode: 'marathon'}) }} 
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
              children={'Marathon'}/></li>
            <li><HoverButton 
              onClick={() => { this.setState({ selectedGameMode: 'sprint'}) }} 
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
              children={'Sprint'}/></li>
            <li><HoverButton 
              onClick={() => { this.setState({ selectedGameMode: 'ultra'}) }} 
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
              children={'Ultra'}/></li>
            <li/>
          </ul>
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
          >Selected Game Mode: {this.state.selectedGameMode.toUpperCase()}</div>
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
          >{this.getModeExplanation(this.state.selectedGameMode)}</div>
          <ul style={{
            marginTop: 100,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: '33% 33% 33%'
          }}>
            <li style={{ textAlign: 'right' }}>
              <HoverButton
                onClick={() => { 
                  setAppState((currentState) => { 
                    return { 
                      ...currentState,
                      view: 'singleplayer_options'
                    }
                  }) 
                }}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'slategray',
                  padding: 20,
                  color: 'white',
                  border: 'solid black 1px',
                  fontFamily: 'Exo',
                  minWidth: 100,
                }}
                children='OPTIONS'
              />
            </li>
            <li style={{ textAlign: 'center' }}>
              <HoverButton
                onClick={() => { 
                  setAppState((currentState) => { 
                    return { 
                      ...currentState,
                      view: 'singleplayer_highscore'
                    }
                  }) 
                }}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'slategray',
                  padding: 20,
                  color: 'white',
                  border: 'solid black 1px',
                  fontFamily: 'Exo',
                  minWidth: 100,
                }}
                children='HIGHSCORE'
              />
            </li>
            <li style={{ textAlign: 'left' }}>
              <HoverButton
                onClick={() => { 
                  setAppState((currentState) => { 
                    return { 
                      ...currentState,
                      view: 'singleplayer_help'
                    }
                  }) 
                }}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'slategray',
                  padding: 20,
                  color: 'white',
                  border: 'solid black 1px',
                  fontFamily: 'Exo',
                  minWidth: 100,
                }}
                children='HELP'
              />
            </li>
          </ul>
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <HoverButton
              onClick={() => { 
                setAppState((currentState: any) => { 
                  return { 
                    ...currentState, 
                    view: 'loadGame'
                  }
                }) 
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
      </MenuOptionWrapper>
    )
  }
}

const marathonExplanation = "This is the traditional game of tetris. Here, the player competes purely for points over 15 levels of play, at which point the game ends. each tetris variant using the Marathon method of game play has a specific Level up condition."
const sprintExplanation = "The player chooses a starting level, and competes to clear a set number of lines (typically 40) in the shortest amount of time. the game ends when a game over Condition is met, or when the player clears the set number of lines. this game does not Level up."
const ultraExplanation = "the player's objective is to a) score as many points, or b) clear as many lines as possible within a two or three minute time span. the game ends when a game over Condition is met, or when the time limit expires. this game does not Level up."

export default SinglePlayer