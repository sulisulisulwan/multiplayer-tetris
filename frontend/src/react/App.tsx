import * as React from 'react'
import { AppState } from 'multiplayer-tetris-types'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Engine,
  makeCopy, 
  allSoundEffects, 
  allBackgroundMusic, 
  BackgroundMusic, 
  SoundEffects, 
  MenuPlayerControl
} from 'multiplayer-tetris-core'
import { 
  getUserState ,
  getViewState,
  getGameState, 
  initializeSinglePlayerGame, 
  getMultiplayerGameState, 
  getPartyState,
  getChatState
} from 'multiplayer-tetris-redux'
import { getView } from './allGetsAndSets/getView'
import { getBackgrounds } from './allGetsAndSets/getBackgrounds'  
import ChatWindow from './ui/components/Chat/ChatWindow'
import DgramBrowser from './sockets/dgram/DgramBrowser' 
// import WebsocketBrowser from './sockets/websocket/WebsocketBrowser' 
import { SocketDataItem } from 'multiplayer-tetris-types'
import { Dispatch } from 'redux'
    
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
let chatState: AppState['chat'] = null
let partyState: AppState['party'] = null
let multiplayerGameState: AppState['multiplayerGameState'] = null
let dispatch: Dispatch = null
let currKeyStrokeHandler: (e: KeyboardEvent) => void = null

let inGameHandleKeyStroke = (e: any) => { engine.inGamePlayerControl.keystrokeHandler(e, gameState, dispatch) }
let mainMenuHandleKeyStroke = (e: any) => { menuPlayerControl.keystrokeHandler(e, { chatState }, dispatch)}

// WebsocketBrowser.onMessage((msg: SocketDataItem<any>) => {
//   console.log(`Receiving message "${msg.action}" from server`)
//   const handler = WebsocketBrowser.getHandler(msg.action)  
  
//   let state = {}
//   if (['updateFriendsData', 'playerDisconnected'].includes(msg.action)) {
//     state = { user: userState }
//   }

//   handler({
//     appState: state,
//     socketSend: WebsocketBrowser.send.bind(WebsocketBrowser),
//     msgData: msg.data
//   })  
// })

DgramBrowser.onMessage((msg: SocketDataItem<any>) => {
  console.log(`Receiving message "${msg.action}" from DGRAM server`)
  const handler = DgramBrowser.getHandler(msg.action)

  handler({
    msgData: msg.data
  })
})



const App = React.memo((props: AppTestProps) => {
  userState = useSelector(getUserState)
  viewState = useSelector(getViewState)
  gameState = useSelector(getGameState)
  partyState = useSelector(getPartyState)
  chatState = useSelector(getChatState)
  multiplayerGameState = useSelector(getMultiplayerGameState)


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
      dispatch(initializeSinglePlayerGame(undefined))
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
    menuPlayerControl = new MenuPlayerControl()
    // WebsocketBrowser.init(thisUserId)
    // WebsocketBrowser.setReduxDispatcher(dispatch)
    soundEffects = new SoundEffects(allSoundEffects, 'sound-effects').addSoundsToDOM()
    backgroundMusic = new BackgroundMusic(allBackgroundMusic, 'background-music').addSoundsToDOM()
    return () => {
      // WebsocketBrowser.kill()
    }
  }, [])

  
  return (
    <>
      {/* {
        (function(viewState) {
          const view = getView(viewState)
          return view 
        })(viewState)
      }
      { userState ? <ChatWindow/> : null} */}
      <div style={{ color: 'white' }}>
        Let's figure out DGRAM
        <button onClick={() => {
          DgramBrowser.init(thisUserId)
        }}>SEND DGRAM TO DGRAM</button>
      </div>
    </>
  )
      
}, (props, nextProps) => true)

export default App