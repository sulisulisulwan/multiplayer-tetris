import * as dgram from 'dgram'
import { SocketDataItem } from 'multiplayer-tetris-types'
import ElectronApp from '../ElectronApp'
import { ClientToElectronActions, SocketDataItemDgram, UserId } from 'multiplayer-tetris-types/shared/types'
import chalk = require('chalk')
const { ipcMain } = require('electron')

class DatagramClient {

  protected app: ElectronApp
  protected socketClient: dgram.Socket
  protected destinationAddress: string
  protected destinationPort: number
  protected userId: UserId

  constructor(electronApp: ElectronApp) {
    this.app = electronApp
    this.socketClient = null
    this.destinationAddress = null
    this.destinationPort = null
    this.userId = null
  }

  setServerPortTarget(port: number) {
    this.destinationPort = port
  }

  setAddressTarget(address: string) {
    this.destinationAddress = address
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
    if (this.socketClient) {
      this.socketClient.disconnect()
      this.socketClient = null
    }
  }


  initListeners() {
    this.socketClient.on('message', (msg, rinfo) => {
      const socketDataItem = JSON.parse(msg.toString())
      this.app.getWindow().webContents.send('dgram:in', socketDataItem)
    })
  }

  sendData(socketDataItem: SocketDataItemDgram<any>) {
    this.socketClient.send(JSON.stringify(socketDataItem), this.destinationPort, this.destinationAddress)
  }


  async kill() {
    if (this.socketClient) {
      console.log(chalk.yellow('Killing Dgram connection...'))
      await this.socketClient.disconnect()
      this.socketClient = null
    }
  }
}

export default DatagramClient