import { ElectronWindow } from "multiplayer-tetris-types/electron"
import DgramBrowserMessageHandler from "./DgramBrowserMessageHandler"
import { SocketDataItem, UserId } from "multiplayer-tetris-types"

class DgramBrowser {
  protected onReceive: any
  protected sendMessage: any
  protected initSocket: any
  protected killSocket: any
  protected messageHandler: DgramBrowserMessageHandler

  constructor() {
    this.onReceive = (window as unknown as ElectronWindow).electronBridge.receiveFromElectron
    this.sendMessage = (window as unknown as ElectronWindow).electronBridge.sendToElectron
    this.messageHandler = new DgramBrowserMessageHandler()
  }

  public init(userId: UserId) {
    this.sendMessage('dgram', { action: 'initSocket', data: userId })
  }

  public kill() {
    this.killSocket()
    this.sendMessage('dgram', { action: 'killSocket', data: null })
  }

  public onMessage(callback: Function) {
    this.onReceive('dgram:in', callback)
  }

  public send(data: SocketDataItem<DgramBrowser>) {
    /**
     * data must have this format:
     * {
     *   action: 'whatever',
     *   data: {
     *     userId: UserId,  <----- this is NECESSARY for associating rinfo to userId
     *     data: Whatever
     *   }
     * }
     * 
     */
    console.log(`Sending message "${data.action}" to DGRAM server`)
    this.sendMessage('dgram', data)
  }

  public getHandler(action: string) {
    return this.messageHandler.getHandler(action)
  }
}

export default new DgramBrowser()