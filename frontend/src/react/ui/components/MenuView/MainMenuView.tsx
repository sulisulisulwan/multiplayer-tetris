import * as React from 'react'
import HoverButton from '../sharedComponents/HoverButton'
import { useDispatch } from 'react-redux'
import { setViewToMultiplayer, setViewToSingleplayer } from '../../../redux/reducers/view'
import { soundEffects } from '../../../App'

const MainMenuView = () => {
  const dispatcher = useDispatch()

  return(
    <div className="main-menu-view" style={{
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      fontFamily: 'Exo',
      height: '100%'
    }}>
      <div className="main-menu-logo"
        style={{
          textAlign: 'center',
          fontFamily: 'Exo',
          fontSize: '15vw',
          fontWeight: '900'
        }}
      >TETRIS</div>
      <div className="main-menu-menu">
      <ul style={{
        marginTop: '5%',
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: '10% 35% 10% 35% 10%'
      }}>
        <li/>
        <li style={{
          textAlign: 'right'
        }}>
          <HoverButton
            onClick={() => {
              soundEffects.play('menuBasicButtonClick')
              dispatcher(setViewToSingleplayer())
            }}
            onHover={() => soundEffects.play('menuBasicButtonHover')}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              padding: '10%',
              color: 'white',
              border: 'solid white .1vw',
              fontFamily: 'Exo',
              fontSize: '2.5vw',
              minWidth: '30%',
            }}
            children='SINGLE PLAYER'
          />
        </li>
        <li/>
        <li>
          <HoverButton
            onClick={() => { 
              soundEffects.play('menuBasicButtonClick')
              dispatcher(setViewToMultiplayer())
            }}
            onHover={() => soundEffects.play('menuBasicButtonHover')}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              padding: '10%',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              border: 'solid white .1vw',
              fontFamily: 'Exo',
              fontSize: '2vw',
              minWidth: '40%',
            }}
            children='MULTIPLAYER'
          />
        </li>
        <li/>
      </ul>
    </div>
    </div>
  )
  
}

export default MainMenuView