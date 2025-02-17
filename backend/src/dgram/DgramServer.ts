import * as Dgram from 'node:dgram'
import ClientPool from './ClientPool.js'
import MessageHandler from './MessageHandler.js'

export default class Server {

  protected dgram: Dgram.Socket
  protected clientPool: ClientPool
  protected messageHandler: MessageHandler

  constructor() {
    this.dgram = Dgram.createSocket('udp4')
    this.clientPool = new ClientPool()
    this.messageHandler = new MessageHandler()
  }

  init(port: number) {
    this.clientPool.init(this)
    this.messageHandler.init(this)

    this.dgram
      .on('error', (err: Error) => console.error(err))
      .on('message', this.messageHandler.handleMessage.bind(this.messageHandler))
      .on('listening', () => {
        const { address, port } = this.dgram.address()
        console.log(`gameServer listening on ${address}:${port}`)
      })
      .on('connect', () => {
        console.log('CONNECTING DGRAM')
      })
      .bind(port)
  }

  getSocket() {
    return this.dgram
  }

  getClientPool() {
    return this.clientPool
  }

  sendMessage(rinfo: Dgram.RemoteInfo, data: string) {
    const { port, address } = rinfo
    console.log('sending to client ', `${address + port} message: ${data}`)
    this.dgram.send(data, port, address)
  }
}

