const dgram = require('dgram')
const { ipcMain } = require('electron')

class DatagramClient {

  constructor(serverAddress, serverPort, electronApp) {
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

  handleMessage(msg, rinfo) {
    const msgData = JSON.parse(msg.toString())
    const { action, data } = msgData
    const handlerMethodName =`_handle_${action}`
    const handler = this[handlerMethodName].bind(this)
    handler(data)
    const msgString = msg.toString()
    this.app.window.webContents.send('dgram:in', msgString)
  }

  sendData(data) {
    this.client.send(JSON.stringify(data), this.serverPort, this.serverAddress, () => {})
  }

  _handle_updateClientGameState(data) {
    console.log('in the handle update client game state function')
    console.log(data)
  }

  _handle_poll() {
    this.sendData({ action: 'poll_OK', data: null })
  }
}

module.exports = DatagramClient