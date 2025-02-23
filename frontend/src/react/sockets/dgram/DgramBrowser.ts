import { ElectronWindow } from "multiplayer-tetris-types/electron"
import DgramBrowserMessageHandler from "./DgramBrowserMessageHandler"
import { SocketDataItem, SocketDataItemDgram, UserId } from "multiplayer-tetris-types"
import { ClientToDgramServer, DgramServerToClient } from "multiplayer-tetris-types/shared/types"

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
  
  public setAddress(address: string) {
    this.sendMessage('dgram', { action: 'setAddress', data: address })
    
  }
  
  public setPort(port: number) {
    this.sendMessage('dgram', { action: 'setPort', data: port })

  }

  public onMessage(callback: Function) {
    this.onReceive('dgram:in', callback)
  }

  public send(data: SocketDataItemDgram<ClientToDgramServer>) {
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

export {
  DgramBrowser
}

export default new DgramBrowser()