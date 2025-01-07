import { formatAddress } from './utils.js'

export default class ClientPool {

  constructor() {
    this.server = null
    this.pool = {}
  }

  init(serverInstance) {
    this.server = serverInstance
  }

  getPool() {
    return this.pool
  }

  getCurrentClients() {
    return Object.keys(this.pool)
  }

  setStillActive(rinfo) {
    this.pool[`${formatAddress(rinfo)}`].timedOut = false
  }

  checkIfClientExists(rinfo) {
    return this.pool[`${formatAddress(rinfo)}`] || null
  }

  addToClientPool(rinfo) {
    this.pool[formatAddress(rinfo)] = {
      pollId: this._initPolling(rinfo),
      timedOut: false
    }
  }

  _polling(rinfo) {
    const address = formatAddress(rinfo)
    if (this.pool[`${address}`].timedOut) {
      return this._removeFromClientPool(rinfo)
    }

    this.pool[`${address}`].timedOut = true
    const dataToSend = JSON.stringify({
      action: 'poll',
      data: null
    })
    this.server.dgram.send(dataToSend, 
      rinfo.port, 
      rinfo.address, (err, bytes) => {
      if (err)  return console.error(err)
    })
  }

  _initPolling(rinfo) {
    return setInterval(this._polling.bind(this, rinfo), 2000)
  }

  _removeFromClientPool(rinfo) {
    const address = formatAddress(rinfo)
    console.log(`Client ${address} no longer active`)
    clearInterval(this.pool[`${address}`].pollId)  
    delete this.pool[`${address}`]
  }

}