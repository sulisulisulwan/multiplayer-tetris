import { formatAddress } from '../utils.js'
import Server from './DgramServer.js'
import * as Dgram from 'node:dgram'

export default class ClientPool {

  protected server: Server
  protected pool: Record<string, {
    pollId: NodeJS.Timeout,
    timedOut: boolean
  }>

  constructor() {
    this.server = null
    this.pool = {}
  }

  init(serverInstance: Server) {
    this.server = serverInstance
  }

  getPool() {
    return this.pool
  }

  getCurrentClients() {
    return Object.keys(this.pool)
  }

  setStillActive(rinfo: Dgram.RemoteInfo) {
    this.pool[`${formatAddress(rinfo)}`].timedOut = false
  }

  checkIfClientExists(rinfo: Dgram.RemoteInfo) {
    return this.pool[`${formatAddress(rinfo)}`] || null
  }

  addToClientPool(rinfo: Dgram.RemoteInfo) {
    this.pool[formatAddress(rinfo)] = {
      pollId: this._initPolling(rinfo),
      timedOut: false
    }
  }

  _polling(rinfo: Dgram.RemoteInfo) {
    const address = formatAddress(rinfo)
    if (this.pool[`${address}`].timedOut) {
      return this._removeFromClientPool(rinfo)
    }

    this.pool[`${address}`].timedOut = true
    const dataToSend = JSON.stringify({
      action: 'poll',
      data: this.getCurrentClients()
    })
    this.server.getSocket().send(dataToSend, 
      rinfo.port, 
      rinfo.address, (err, bytes) => {
      if (err)  return console.error(err)
    })
  }

  _initPolling(rinfo: Dgram.RemoteInfo) {
    return setInterval(this._polling.bind(this, rinfo), 2000)
  }

  _removeFromClientPool(rinfo: Dgram.RemoteInfo) {
    const address = formatAddress(rinfo)
    console.log(`Client ${address} no longer active`)
    clearInterval(this.pool[`${address}`].pollId)  
    delete this.pool[`${address}`]

  }

}