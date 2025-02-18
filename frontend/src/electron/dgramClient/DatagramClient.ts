import * as dgram from 'dgram'
import { SocketDataItem } from 'multiplayer-tetris-types'
import ElectronApp from '../ElectronApp'
import { ClientToElectronActions, DgramServerToClient, SocketDataItemDgram, UserId } from 'multiplayer-tetris-types/shared/types'
import chalk = require('chalk')
const { ipcMain } = require('electron')

class DatagramClient {

  protected app: ElectronApp
  protected socketClient: dgram.Socket
  protected serverAddress: string
  protected serverPort: number
  protected userId: UserId

  constructor(serverAddress: string, serverPort: number, electronApp: ElectronApp) {
    this.app = electronApp
    this.socketClient = null
    this.serverAddress = serverAddress
    this.serverPort = serverPort
    this.userId = null
  }

  getSocket() {
    return this.socketClient
  }

  initSocket(request?: SocketDataItem<ClientToElectronActions>) {
    this.userId = request.data
    console.log(chalk.yellow('Initializing Dgram connection...'))
    this.socketClient = dgram.createSocket('udp4')
    this.initListeners()
  }

  killSocket() {
    this.socketClient.disconnect()
  }


  initListeners() {
    this.socketClient.on('message', (msg, rinfo) => {
      const socketDataItem = JSON.parse(msg.toString())
      this.app.getWindow().webContents.send('dgram:in', socketDataItem)
    })
    
    this.sendData({
      userId: this.userId,
      action: 'trackThisUser',
      data: null
    })
  }

  sendData(socketDataItem: SocketDataItemDgram<any>) {
    this.socketClient.send(JSON.stringify(socketDataItem), this.serverPort, this.serverAddress)
  }


  async kill() {
    console.log(chalk.yellow('Killing Dgram connection...'))
    await this.socketClient.disconnect()
    this.socketClient = null
  }
}

export default DatagramClient