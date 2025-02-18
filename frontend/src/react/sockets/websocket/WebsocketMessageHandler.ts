import { AppState, SocketDataItem } from "multiplayer-tetris-types"
import { ClientToServerActions } from "multiplayer-tetris-types/shared/types"
import { Dispatch } from "redux"
import { 
  addIncomingChatMessage, resetChatMessagesToAllMessagesOnServer,
  setUserData, setUserAndPartyData, setUserFriendsData,
  setPartyState, updatePartyRoomId, initializeMultiplayerGame
 } from 'multiplayer-tetris-redux'

type WebsocketHandlerArgs = {
  appState: Partial<AppState>,
  socketSend: (data: SocketDataItem<ClientToServerActions>) => void,
  msgData: any
}

type WebsocketHandler = (arg: WebsocketHandlerArgs) => void

export default class WebsocketMessageHandler {

  protected handlerMap: Map<string, WebsocketHandler>
  protected dispatchers: Map<string, Dispatch>
  protected dispatcher: Dispatch<any>

  constructor() {
    this.handlerMap = new Map([
      ['confirmedLoggedIn', this.confirmedLoggedIn.bind(this)],
      ['sendAllFriends', this.sendAllFriends.bind(this)],
      ['updateFriendsData', this.updateFriendsData.bind(this)],
      ['sendPartyRoomId', this.sendPartyRoomId.bind(this)],
      ['getUsersInMain', this.getUsersInMain.bind(this)],
      ['playerDisconnected', this.playerDisconnected.bind(this)],
      ['accountAlreadyInUse', this.accountAlreadyInUse.bind(this)],
      ['updatePartyAndUserData', this.updatePartyAndUserData.bind(this)],
      ['updateUserData', this.updateUserData.bind(this)],
      ['updatePartyData', this.updatePartyData.bind(this)],
      ['incomingChatMessage', this.incomingChatMessage.bind(this)],
      ['getAllChatMessages', this.getAllChatMessages.bind(this)],
      ['matchFound', this.matchFound.bind(this)],
    ])
    this.dispatcher = null
  }

  public setReduxDispatcher(dispatcher: Dispatch<any>) {
    this.dispatcher = dispatcher
  }

  public reduxDispatch(action: any) {
    if (this.dispatcher === null) {
      throw new Error('this.dispatcher must be set before access')
    }
    this.dispatcher(action)
  }

  public getHandler(action: string) {
    return this.handlerMap.get(action)
  }


  protected updateFriendsData({ appState, socketSend }: WebsocketHandlerArgs) {
    socketSend({
      action: 'getAllFriends',
      data: appState.user.friends.map(friendData => friendData.id)
    })
  }
  
  protected playerDisconnected({ appState, socketSend }: WebsocketHandlerArgs) {
    socketSend({
      action: 'getAllFriends',
      data: appState.user.friends.map(friendData => friendData.id)
    })
  }

  protected getUsersInMain({}: WebsocketHandlerArgs) {}

  protected updateUserData({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(setUserData(msgData))
  } 
      
  protected confirmedLoggedIn({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(setUserAndPartyData(msgData))
  }

  protected sendAllFriends({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(setUserFriendsData(msgData))
  }
  
  protected sendPartyRoomId({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(updatePartyRoomId(msgData.roomId))
  }

  protected updatePartyAndUserData({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(setUserAndPartyData(msgData))
  }

  protected updatePartyData({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(setPartyState(msgData))
  }

  protected incomingChatMessage({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(addIncomingChatMessage(msgData))
  }
  
  protected getAllChatMessages({ msgData }: WebsocketHandlerArgs) {
    this.reduxDispatch(resetChatMessagesToAllMessagesOnServer(msgData))
  }
  protected matchFound({ msgData }: WebsocketHandlerArgs) {
    console.log('outside', msgData)
    this.reduxDispatch(initializeMultiplayerGame(msgData.gameRoomData))
  }

  protected accountAlreadyInUse() {
    alert('Account already in use')
    window.close()
  }

}