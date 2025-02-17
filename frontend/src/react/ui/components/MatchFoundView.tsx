import * as React from 'react'
import { soundEffects } from '../../App'
import { useDispatch } from 'react-redux'
import { setView } from '../../redux/reducers/view'



const MatchFoundView = () => {

const dispatch = useDispatch()
  React.useEffect(() => {
    setTimeout(() => {
      dispatch(setView('multiplayerGameLoading'))
    }, 1000)
    soundEffects.play('matchFound')
  }, [])

  return (
    <div style={{
      height: '100%',
      fontFamily: 'Exo',
      fontWeight: '600',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '10vw',
      flexDirection: 'column'
    }}>
      <div>MATCH</div>
      <div>FOUND</div>
    </div>
  )
}

export default MatchFoundView