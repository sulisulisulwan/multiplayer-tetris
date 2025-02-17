import * as React from 'react'
import { Engine } from './core/engine/Engine'

import { makeCopy } from './core/utils/utils'
import { getView } from './allGetsAndSets/getView'
import { getBackgrounds } from './allGetsAndSets/getBackgrounds'  
import ChatWindow from './ui/components/Chat/ChatWindow'
import MenuPlayerControl from './core/player-control/MenuPlayerControl' 
import DgramBrowser from './sockets/dgram/DgramBrowser' 
import contentEqual from '../utils/contentEqual' 
import WebsocketBrowser from './sockets/websocket/WebsocketBrowser' 
import { AppState } from '../../../types/frontend/shared'
import SoundEffects from './core/audio/SoundEffects'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getUserState } from './redux/reducers/user'
import { getViewState } from './redux/reducers/view'
import { getGameState, initializeSinglePlayerGame } from './redux/reducers/gameState'
import { SocketDataItem } from 'multiplayer-tetris-types'
import { allSoundEffects } from './core/audio/allSoundEffects'
import BackgroundMusic from './core/audio/BackgroundMusic'
import { allBackgroundMusic } from './core/audio/allBackgroundMusic'
import { Dispatch } from 'redux'
import { getMultiplayerGameState } from './redux/reducers/multiplayerGameState'
import { getPartyState } from './redux/reducers/party'
    
type AppStateSlices = {
  view: AppState['view'],
  gameState: AppState['gameState'],
  user: AppState['user'],
  party: AppState['party']
  multiplayerGameState: AppState['multiplayerGameState']
}
type AppTestProps = {
  thisUserId?: string // 
}

type BackgroundsGetter = {
  gameActive: () => void;
  mainMenu: () => void;
  singleplayer: () => void;
  multiplayer: () => void;
  singleplayer_options: () => string;
  singleplayer_highscore: () => string;
  singleplayer_help: () => string;
  highScore: () => string;
  help: () => string;
  loadGame: () => string;
}

let engine: Engine | null = null
let soundEffects: SoundEffects = null
  export { soundEffects }
let backgroundMusic: BackgroundMusic = null
  export { backgroundMusic }
let backgrounds: BackgroundsGetter = getBackgrounds()
let menuPlayerControl: MenuPlayerControl = null
let userState: AppState['user'] = null
let viewState: AppState['view'] = null
let gameState: AppState['gameState'] = null
let partyState: AppState['party'] = null
let multiplayerGameState: AppState['multiplayerGameState'] = null
let dispatch: Dispatch = null
let currKeyStrokeHandler: (e: KeyboardEvent) => void = null

let inGameHandleKeyStroke = (e: any) => {
  engine.inGamePlayerControl.keystrokeHandler(gameState, dispatch, e)
}
let mainMenuHandleKeyStroke = (e: any) => {
  menuPlayerControl.keystrokeHandler(null, e)
}

WebsocketBrowser.onMessage((msg: SocketDataItem<any>) => {
  console.log(`Receiving message "${msg.action}" from server`)
  const handler = WebsocketBrowser.getHandler(msg.action)  
  
  let state = {}
  if (['updateFriendsData', 'playerDisconnected'].includes(msg.action)) {
    state = { user: userState }
  }

  handler({
    appState: state,
    socketSend: WebsocketBrowser.send.bind(WebsocketBrowser),
    msgData: msg.data
  })  
})



const App = React.memo((props: AppTestProps) => {
  userState = useSelector(getUserState)
  viewState = useSelector(getViewState)
  gameState = useSelector(getGameState)
  partyState = useSelector(getPartyState)
  multiplayerGameState = useSelector(getMultiplayerGameState)

  const state: AppStateSlices = {
    user: userState,
    view: viewState,
    party: partyState,
    gameState: gameState,
    multiplayerGameState: multiplayerGameState
  }

  const { thisUserId } = props
  dispatch = useDispatch()
  
  React.useEffect(() => {

    if (viewState === 'mainMenu') {
      document.removeEventListener('keyup', currKeyStrokeHandler)
      document.removeEventListener('keydown', currKeyStrokeHandler)
      currKeyStrokeHandler = mainMenuHandleKeyStroke
      document.addEventListener('keydown', currKeyStrokeHandler, true)
      document.addEventListener('keyup', currKeyStrokeHandler, true)
    }
    
    if (viewState === 'loadGame') {
      document.removeEventListener('keyup', currKeyStrokeHandler)
      document.removeEventListener('keydown', currKeyStrokeHandler)
      currKeyStrokeHandler = inGameHandleKeyStroke
      document.addEventListener('keydown', currKeyStrokeHandler, true)
      document.addEventListener('keyup', currKeyStrokeHandler, true)
      const gameOptions = makeCopy(gameState.gameOptions)
      engine = new Engine(gameOptions)
      backgroundMusic.setTrack(gameState.gameOptions.backgroundMusic)
      dispatch(initializeSinglePlayerGame())
      return
    }

    backgrounds[viewState as keyof BackgroundsGetter]()
  }, [viewState])



  React.useEffect(() => {
    if (viewState === 'gameActive') {
      engine.handleGameStateUpdate(gameState, dispatch)
    }
  }, [gameState])


  //componentDidMount
  React.useEffect(() => {
    currKeyStrokeHandler = mainMenuHandleKeyStroke
    document.addEventListener('keydown', currKeyStrokeHandler, true)
    document.addEventListener('keyup', currKeyStrokeHandler, true)
    menuPlayerControl = new MenuPlayerControl(null)
    WebsocketBrowser.init(thisUserId)
    WebsocketBrowser.setReduxDispatcher(dispatch)
    soundEffects = new SoundEffects(allSoundEffects, 'sound-effects').addSoundsToDOM()
    backgroundMusic = new BackgroundMusic(allBackgroundMusic, 'background-music').addSoundsToDOM()
    return () => {
      WebsocketBrowser.kill()
    }
  }, [])

  console.log(state)
  
  return (
    <>
      {
        (function(viewState) {
          const view = getView(viewState)
          return view 
        })(viewState)
      }
      { userState ? <ChatWindow/> : null}
    </>
  )
      
}, (props, nextProps) => true)

export default App