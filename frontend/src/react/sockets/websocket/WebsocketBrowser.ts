import { SocketDataItem } from "multiplayer-tetris-types"
import WebsocketMessageHandler from "./WebsocketMessageHandler"
import { ClientToServerActions, UserId } from "multiplayer-tetris-types/shared/types"
import { Dispatch } from "redux"
import { ElectronWindow } from "multiplayer-tetris-types/electron"

class WebsocketBrowser {

  protected onReceive: any
  protected sendMessage: any
  protected initSocket: any
  protected killSocket: any
  protected messageHandler: WebsocketMessageHandler

  constructor() {
    this.onReceive = (window as unknown as ElectronWindow).electronBridge.receiveFromElectron
    this.sendMessage = (window as unknown as ElectronWindow).electronBridge.sendToElectron
    this.messageHandler = new WebsocketMessageHandler()
  }

  public init(userId: UserId) {
    this.sendMessage('websocket', { action: 'initSocket', data: userId })
  }

  public kill() {
    this.killSocket()
    this.sendMessage('websocket', { action: 'killSocket', data: null })
  }
  
  public onMessage(callback: Function) {
    this.onReceive('websocket:in', callback)
  }
  
  public send(data: SocketDataItem<ClientToServerActions>): void {
    console.log(`Sending message "${data.action}" to WEBSOCKET server`)
    this.sendMessage('websocket', data)
  }
  
  public getHandler(action: string) {
    return this.messageHandler.getHandler(action)
  }

  public setReduxDispatcher(dispatcher: Dispatch<any>) {
    this.messageHandler.setReduxDispatcher(dispatcher)
  }
}

export { WebsocketBrowser }

export default new WebsocketBrowser()