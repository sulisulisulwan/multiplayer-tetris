import { SocketDataItem } from "multiplayer-tetris-types"
import Server from "./DgramServer"
import * as Dgram from 'dgram'
import { ClientToDgramServer, ClientToServerActions } from "multiplayer-tetris-types/shared/types"

export default class MessageHandler {

  server: Server
  actions: any

  constructor() {
    this.server = null
    this.actions = null
  }

  init(serverInstance: Server) {
    this.server = serverInstance
  }
  
  handleMessage(msg: string, rinfo: Dgram.RemoteInfo) {
    const clientExists = this.server.getClientPool().checkIfClientExists(rinfo)
    if (!clientExists) this.server.getClientPool().addToClientPool(rinfo)
    const { action, data }: SocketDataItem<ClientToDgramServer> = JSON.parse(msg)
    const handler = this[`_handle_${action}` as keyof MessageHandler].bind(this)

    console.log('DATA FROM CLIENT: ', data)
    handler(rinfo, data)
  }

  _handle_signin(rinfo: Dgram.RemoteInfo) {
    console.log(rinfo + ' signed in')
  }

  _handle_poll_OK(rinfo: Dgram.RemoteInfo) {
    this.server.getClientPool().setStillActive(rinfo)
  }

  _handle_getActivePlayers(rinfo: Dgram.RemoteInfo) {
    const dataPayload = JSON.stringify({
      action: 'getActivePlayers',
      data: this.server.getClientPool().getCurrentClients()
    })
    console.log('SENDING TO CLIENT DATA: ', dataPayload)

    this.server.sendMessage(rinfo, dataPayload)
  }

  _handle_updateServerGameState(rinfo: Dgram.RemoteInfo, data: SocketDataItem<ClientToDgramServer>) {

    //Update Game state with this player's personal game data
    //Send most updated data. WE SHOULD HAVE THE CLIENT UPDATE STATE UPON RECEIVING SERVER UPDATE
    
    const dataPayload = JSON.stringify({
      action: 'updateClientGameState',
      data: 'this will be the newest game data from game server'
    })

    console.log('SENDING TO CLIENT DATA: ', dataPayload)
    this.server.sendMessage(rinfo, dataPayload)
  }
}