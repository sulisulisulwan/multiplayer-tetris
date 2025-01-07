import * as React from 'react'

interface startQuitButtonPropsIF {
  currentGamePhase: string
  clickHandler: (e: Event) => void
}

const StartQuitButton = (props: startQuitButtonPropsIF) => {

  const { currentGamePhase, clickHandler } = props

  let action = 'Start'
  if (currentGamePhase !== 'off') {
    action = 'Quit'
  }

  return (
    <div className="start-quit-button-wrapper">
      <button onClick={clickHandler as unknown as React.MouseEventHandler<HTMLButtonElement>}>{action}</button>
    </div>
  )
}

export default StartQuitButton