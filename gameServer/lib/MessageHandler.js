export default class MessageHandler {

  constructor() {
    this.server = null
    this.actions = null
  }

  init(serverInstance) {
    this.server = serverInstance
  }
  
  handleMessage(msg, rinfo) {
    const clientExists = this.server.clientPool.checkIfClientExists(rinfo)
    if (!clientExists) this.server.clientPool.addToClientPool(rinfo)
    const {action, data} = JSON.parse(msg)
    const handler = this[`_handle_${action}`].bind(this)
    handler(rinfo, data)
  }

  _handle_poll_OK(rinfo) {
    this.server.clientPool.setStillActive(rinfo)
  }

  _handle_updateServerGameState(rinfo, data) {

    //Update Game state with this player's personal game data
    //Send most updated data. WE SHOULD HAVE THE CLIENT UPDATE STATE UPON RECEIVING SERVER UPDATE

    const dataPayload = JSON.stringify({
      action: 'updateClientGameState',
      data: 'this data hasnt been set yet'
    })
    this.server.sendMessage(rinfo, dataPayload)
  }
}