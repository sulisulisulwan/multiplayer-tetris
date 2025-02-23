import * as React from 'react'
import HoverButton from '../../../sharedComponents/HoverButton';
import { UserDataFromAPI, UserDataFromDB } from 'multiplayer-tetris-types';

type PlayerSlotProps = {
  slotId: string
  playerData: UserDataFromAPI | UserDataFromDB,
  width: number | string
  height: number | string
  margin: number | string
  onLeftClickHandler: Function
  onRightClickHandler: Function
}

const PlayerSlot = ({ playerData, width, height, margin, slotId, onLeftClickHandler, onRightClickHandler }: PlayerSlotProps) => {

  const [ isVisible, setIsVisible ] = React.useState(false)
  const [ shineBarActivate , setShinebarActivate ] = React.useState(false)

  React.useEffect(() => {
    let timeoutId = setTimeout(() => {
      setIsVisible(true)
      clearTimeout(timeoutId)
    }, 100)
  }, [])


  React.useEffect(() => {
    let timeoutId = setTimeout(() => {
      setShinebarActivate(true)
      clearTimeout(timeoutId)
    }, 100)
  }, [isVisible])


  if (playerData) return (
    <>
      <div
        data-slotid={slotId}
        className={`fade-in-section ${isVisible ? 'is-visible' : ''}`} 
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      > 
        <div
          className={`${shineBarActivate ? ' shine-bar-right' : ''}`}
          onClick={(e) => onLeftClickHandler(e)}
          onContextMenu={(e) => onRightClickHandler(e)}
          style={{
            overflow: 'hidden',
            position: 'relative',
            width,
            height,
            margin,
            opacity: playerData ? 1 : .1,
            backgroundColor: '',
            background: `linear-gradient(to bottom, rgba(255,153,153,0) 0%,rgba(255,153,153,0) 55%, rgba(0,0,0,.9) 100%),url(${playerData.avatarSrc}) no-repeat center`
          }}
        >
          <div
            style={{
              position: 'relative',
              top: '80%',
              height,
              width,
              backgroundColor: 'gray',
              opacity: .8,
              color: 'white',
              textAlign: 'center'
            }}
          >{playerData.name}</div>

        </div>

      </div>
    </>
  );

  return (
    <div
      data-slotid={slotId}
      className={`fade-in-section ${isVisible ? 'is-visible' : '' }`}
    >
      <HoverButton
        onClick={(e) => onLeftClickHandler(e, false)}
        onContextMenu={(e) => onRightClickHandler(e, false)}
        style={{
          width,
          height,
          margin,
          color: 'white',
          background: 'gray',
          font: 'Exo',
          fontSize: 50
        }}
        opacityMax={.3}
        opacityMin={.2}
        children={'+'}
        
      />
    </div>
  )
}


export default PlayerSlot