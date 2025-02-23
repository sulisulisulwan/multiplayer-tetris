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
  MenuPlayerControl,
  InGamePlayerControl,
  TimerManager
} from 'multiplayer-tetris-core'
import { 
  getUserState ,
  getViewState,
  getGameState, 
  initializeSinglePlayerGame, 
  getPartyState,
  getChatState,
  setView,
  getGameOptions
} from 'multiplayer-tetris-redux'
import { getView } from './allGetsAndSets/getView'
import { getBackgrounds } from './allGetsAndSets/getBackgrounds'  
import ChatWindow from './ui/chat/ChatWindow'
import DgramBrowser from './sockets/dgram/DgramBrowser' 
import WebsocketBrowser from './sockets/websocket/WebsocketBrowser' 
import { SocketDataItem } from 'multiplayer-tetris-types'
import { Dispatch } from 'redux'
import { ScoringHandlerFactory } from 'multiplayer-tetris-core/dist/scoring/ScoringHandlerFactory'
import { ClassicRotationSystem } from 'multiplayer-tetris-core/dist/tetrimino/movement-handler/rotation-systems/ClassicRS'
import { SuperRotationSystem } from 'multiplayer-tetris-core/dist/tetrimino/movement-handler/rotation-systems/SuperRS'

const axiosPost = (window as any).electronBridge.axiosPost
const axiosGet = (window as any).electronBridge.axiosGet
type AppStateSlices = {
  view: AppState['view'],
  gameState: AppState['gameState'],
  user: AppState['user'],
  party: AppState['party']
}
type AppTestProps = {
  thisUserId?: string // 
}

type BackgroundsGetter = {
  gameActive_singleplayer: () => void;
  gameActive_multiplayer: () => void;
  menu_main: () => void;
  menu_singleplayer: () => void;
  menu_singleplayer_options: () => string;
  menu_singleplayer_highscore: () => string;
  menu_singleplayer_help: () => string;
  menu_multiplayer: () => void;
  loadGame_singleplayer: () => string;
  loadGame_multiplayer: () => string;
}

let timerManager = new TimerManager()
let engine: Engine | null = null
let soundEffects: SoundEffects = null
  export { soundEffects }
let backgroundMusic: BackgroundMusic = null
  export { backgroundMusic }
let backgrounds: BackgroundsGetter = getBackgrounds()
let inGamePlayerControl: InGamePlayerControl = null
let menuPlayerControl: MenuPlayerControl = null
let userState: AppState['user'] = null
let viewState: AppState['view'] = null
let gameState: AppState['gameState'] = null
let chatState: AppState['chat'] = null
let partyState: AppState['party'] = null
let gameOptions: AppState['gameOptions'] = null
let dispatch: Dispatch = null
let currKeyStrokeHandler: (e: KeyboardEvent) => void = null

const tetriminoMovementHandlersMap = new Map([
  ['classic', ClassicRotationSystem],
  ['super', SuperRotationSystem] 
])


let inGameHandleKeyStrokeMultiplayer = (e: any) => { 
  DgramBrowser.send({ userId: null, action: 'handleKeyStroke', data: { key: e.key, type: e.type } })
}

let inGameHandleKeyStrokeSingleplayer = (e: any) => { 
  inGamePlayerControl.keystrokeHandler({ key: e.key, type: e.type }, gameState, dispatch) 
}

let menuHandleKeyStroke = (e: any) => { menuPlayerControl.keystrokeHandler({ key: e.key, type: e.type }, { chatState }, dispatch)}

WebsocketBrowser.onMessage((msg: SocketDataItem<any>) => {
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

DgramBrowser.onMessage((msg: SocketDataItem<any>) => {
  const handler = DgramBrowser.getHandler(msg.action)

  handler({
    msgData: msg.data,
    socketSend: DgramBrowser.send.bind(DgramBrowser),
    dispatch
  })
})



const App = React.memo((props: AppTestProps) => {
  userState = useSelector(getUserState)
  viewState = useSelector(getViewState)
  gameState = useSelector(getGameState)
  partyState = useSelector(getPartyState)
  chatState = useSelector(getChatState)
  gameOptions = useSelector(getGameOptions)


  const { thisUserId } = props
  dispatch = useDispatch()
  
  React.useEffect(() => {

    if (viewState === 'menu_main') {
      document.removeEventListener('keyup', currKeyStrokeHandler)
      document.removeEventListener('keydown', currKeyStrokeHandler)
      currKeyStrokeHandler = menuHandleKeyStroke
      document.addEventListener('keydown', currKeyStrokeHandler, true)
      document.addEventListener('keyup', currKeyStrokeHandler, true)
    }

    if (viewState === 'loadGame_singleplayer') {
      const scoringHandler = ScoringHandlerFactory.loadScoringHandler(gameOptions.singleplayer.scoringSystem)
      const tetriminoMovementHandler = new (tetriminoMovementHandlersMap.get(gameOptions.singleplayer.rotationSystem))()
      inGamePlayerControl = new InGamePlayerControl(tetriminoMovementHandler, scoringHandler, timerManager)
      engine = new Engine(gameOptions.singleplayer, timerManager)

      document.removeEventListener('keyup', currKeyStrokeHandler)
      document.removeEventListener('keydown', currKeyStrokeHandler)
      currKeyStrokeHandler = inGameHandleKeyStrokeSingleplayer
      document.addEventListener('keydown', currKeyStrokeHandler, true)
      document.addEventListener('keyup', currKeyStrokeHandler, true)
      dispatch(initializeSinglePlayerGame(gameOptions.singleplayer))
      return
    }

    if (viewState === 'loadGame_multiplayer') {
      document.removeEventListener('keyup', currKeyStrokeHandler)
      document.removeEventListener('keydown', currKeyStrokeHandler)
      currKeyStrokeHandler = inGameHandleKeyStrokeMultiplayer
      document.addEventListener('keydown', currKeyStrokeHandler, true)
      document.addEventListener('keyup', currKeyStrokeHandler, true)

      const getGameRoomDgramPortAddress = async() => {
        console.log(thisUserId)
        console.log(userState)
        // const respGet: any = await axiosGet(`http://localhost:3002/game?userId=${userState.id}`);
        const respGet: any = await axiosGet(`http://localhost:3002/game?userId=${thisUserId}`);
        if (respGet.data) {
          DgramBrowser.setAddress(respGet.data.address)
          DgramBrowser.setPort(respGet.data.port)
          // DgramBrowser.init(userState.id)
          DgramBrowser.init(thisUserId)
          DgramBrowser.send({ userId: thisUserId, action: 'trackThisUser', data: { gameId: respGet.data.gameId } })
        } else {

          // const respPost: any = await axiosPost('http://localhost:3002/game', { gameState, userId: userState.id });
          const respPost: any = await axiosPost('http://localhost:3002/game', { gameState, userId: thisUserId });
          const { address, port, gameId } = respPost.data
          DgramBrowser.setAddress(address)
          DgramBrowser.setPort(port)
          // DgramBrowser.init(userState.id)
          DgramBrowser.init(thisUserId)
          DgramBrowser.send({ userId: thisUserId, action: 'trackThisUser', data: { gameId } })
        }
      }
      
      dispatch(initializeSinglePlayerGame(gameOptions))
      getGameRoomDgramPortAddress()
      // backgroundMusic.setTrack(gameState.gameOptions.backgroundMusic)
      return
    }


    
    backgrounds[viewState as keyof BackgroundsGetter]()
  }, [viewState])
  
  
  
  React.useEffect(() => {
    // if (viewState === 'loadGame_singleplayer') {
    //   dispatch(initializeSinglePlayerGame(gameOptions))
    //   return
    // }

    if (viewState === 'gameActive_singleplayer') {
      engine.handleGameStateUpdate(gameState, dispatch)
      return
    }

    if (viewState === 'loadGame_multiplayer') {
      dispatch(setView('gameActive_multiplayer'))
      return
    }
  }, [gameState])


  //componentDidMount
  React.useEffect(() => {
    currKeyStrokeHandler = menuHandleKeyStroke
    document.addEventListener('keydown', currKeyStrokeHandler, true)
    document.addEventListener('keyup', currKeyStrokeHandler, true)
    menuPlayerControl = new MenuPlayerControl()
    WebsocketBrowser.init(thisUserId)
    WebsocketBrowser.setReduxDispatcher(dispatch)
    soundEffects = new SoundEffects(allSoundEffects, 'sound-effects').addSoundsToDOM()
    backgroundMusic = new BackgroundMusic(allBackgroundMusic, 'background-music').addSoundsToDOM()
    return () => {
      // WebsocketBrowser.kill()
    }
  }, [])

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