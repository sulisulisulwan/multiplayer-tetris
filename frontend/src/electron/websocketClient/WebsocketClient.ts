import { io, Socket } from 'socket.io-client'
import { SocketDataItem } from 'multiplayer-tetris-types'
import ElectronApp from '../ElectronApp'
import chalk = require('chalk')
import { ClientToElectronActions, ClientToServerActions } from 'multiplayer-tetris-types/shared/types'
class WebsocketClient {
  protected app: ElectronApp
  protected socketClient: Socket
  
  constructor(electronApp: ElectronApp) {
    this.app = electronApp
    this.socketClient = null
  }

  getSocket() {
    return this.socketClient
  }

  initSocket(request: SocketDataItem<ClientToElectronActions>) {
    const { data } = request
    console.log(chalk.yellow('Initializing Websocket connection...'))
    this.socketClient = io(`ws://localhost:3001?userId=${data}`)
    this.initListeners()
  }

  killSocket() {
    if (this.socketClient) {
      this.socketClient.disconnect()
      this.socketClient = null
    }
  }

  initListeners() {

    this.socketClient.on('connect', () => {
      console.log(`Socket connected on ${chalk.green(this.socketClient.id)}`)
    })


    this.socketClient.on('confirmConnected', (socket) => {
      console.log('Server confirms client is connected')
    })

    this.socketClient.on('disconnect', () => {
      console.log(chalk.red('Websocket disconnected'))
    })

    this.socketClient.on('messageFromServer', (data) => {
      this.app.getWindow().webContents.send('websocket:in', data)
    })

    this.socketClient.on('playerDisconnected', (playerAddress) => {
      console.log('A player disconnected: ', playerAddress)
    })
  }

  sendData(dataToSend: SocketDataItem<ClientToServerActions>) {
    const { action, data } = dataToSend
    this.socketClient.send(action, data)
  }

  async kill() {
    if (this.socketClient) {
      console.log(chalk.yellow('Killing Websocket connection...'))
      await this.socketClient.disconnect()
      this.socketClient = null
    }
  }
}

export default WebsocketClient