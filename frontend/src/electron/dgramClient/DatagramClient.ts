import * as dgram from 'dgram'
import { SocketDataItem } from 'multiplayer-tetris-types'
import ElectronApp from '../ElectronApp'
import { DgramServerToClient } from 'multiplayer-tetris-types/shared/types'
const { ipcMain } = require('electron')

class DatagramClient {

  protected app: ElectronApp
  protected client: dgram.Socket
  protected serverAddress: string
  protected serverPort: number

  constructor(serverAddress: string, serverPort: number, electronApp: ElectronApp) {
    console.log('Electron App opening Dgram port on: ', serverPort)
    this.app = electronApp
    this.client = dgram.createSocket('udp4')
    this.serverAddress = serverAddress
    this.serverPort = serverPort
    this.initListeners()
    this.handleMessage.bind(this)
  }

  initListeners() {
    this.client.on('message', (msg, rinfo) => this.handleMessage(msg, rinfo))
  }

  handleMessage(msg: Buffer, rinfo: dgram.RemoteInfo) {
    const msgData = JSON.parse(msg.toString())
    const { action, data } = msgData
    const handlerMethodName =`_handle_${action}`
    const handler = this[handlerMethodName as keyof DatagramClient].bind(this)
    console.log('DGRAM CLIENT RECEIVED GAMESTATE UPDATE')
    console.log('SENDING DATA TO ELECTRON BRIDGE VIA "dgram:in"')
    console.log(msgData)
    handler(msgData)
  }

  sendData(data: SocketDataItem<DgramServerToClient>) {
    console.log('DGRAM CLIENT SENDING DATA TO SERVER: ')
    console.log(data)
    this.client.send(JSON.stringify(data), this.serverPort, this.serverAddress, () => {})
  }

  _handle_getActivePlayers(data: SocketDataItem<DgramServerToClient>) {
    this.app.getWindow().webContents.send('dgram:in', data)
  }
  _handle_updateClientGameState(data: SocketDataItem<DgramServerToClient>) {
    this.app.getWindow().webContents.send('dgram:in', data)
  }

  _handle_poll(data: SocketDataItem<DgramServerToClient>) {
    this.app.getWindow().webContents.send('dgram:in', data)
    this.sendData({ action: 'poll_OK', data: null })
  }

  kill() {
    try {
      this.client.disconnect()
    } catch(e){ 
      console.error(e.message)
    }
  }
}

export default DatagramClient