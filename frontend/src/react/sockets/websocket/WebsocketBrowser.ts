import { SocketDataItem } from "multiplayer-tetris-types"
import WebsocketMessageHandler from "./WebsocketMessageHandler"
import { ClientToServerActions } from "multiplayer-tetris-types/shared/types"
import { Dispatch } from "redux"

interface ElectronWindow extends Window {
  electronBridge: {
    receiveFromElectron: Function
    sendToElectron: Function
    initSocket: Function
    killSocket: Function
  }
}

class WebsocketBrowser {

  protected onReceive: any
  protected sendMessage: any
  protected initSocket: any
  protected killSocket: any
  protected messageHandler: WebsocketMessageHandler

  constructor() {
    this.onReceive = (window as unknown as ElectronWindow).electronBridge.receiveFromElectron
    this.sendMessage = (window as unknown as ElectronWindow).electronBridge.sendToElectron
    this.initSocket =  (window as unknown as ElectronWindow).electronBridge.initSocket
    this.killSocket =  (window as unknown as ElectronWindow).electronBridge.killSocket
    this.messageHandler = new WebsocketMessageHandler()
  }

  public init(userId: string) {
    this.sendMessage('websocket', { action: 'initSocket', data: userId })
  }

  public kill() {
    this.killSocket()
    this.sendMessage('websocket', { action: 'killSocket', data: null })
  }

  public setReduxDispatcher(dispatcher: Dispatch<any>) {
    this.messageHandler.setReduxDispatcher(dispatcher)
  }

  public onMessage(callback: Function) {
    this.onReceive('websocket:in', callback)
  }

  public send(data: SocketDataItem<ClientToServerActions>): void {
    console.log(`Sending message "${data.action}" to server`)
    this.sendMessage('websocket', data)
  }

  public getHandler(action: string) {
    return this.messageHandler.getHandler(action)
  }
}

export { WebsocketBrowser }

export default new WebsocketBrowser()