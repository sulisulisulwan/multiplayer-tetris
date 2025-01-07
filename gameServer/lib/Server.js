import Dgram from 'dgram'
import ClientPool from './ClientPool.js'
import MessageHandler from './MessageHandler.js'
export default class Server {
  constructor() {
    this.dgram = Dgram.createSocket('udp4')
    this.clientPool = new ClientPool()
    this.messageHandler = new MessageHandler()
  }

  init(port) {
    this.clientPool.init(this)
    this.messageHandler.init(this)

    this.dgram
      .on('error', (err) => console.error(err))
      .on('message', this.messageHandler.handleMessage.bind(this.messageHandler))
      .on('listening', () => {
        const { address, port } = this.dgram.address()
        console.log(`gameServer listening on ${address}:${port}`)
      })
      .bind(port)
  }

  sendMessage(rinfo, data) {
    const { port, address } = rinfo
    this.dgram.send(data, port, address)
  }
}

