import { SocketDataItem } from "multiplayer-tetris-types"
import { ClientToElectronActions, ClientToServerActions } from "multiplayer-tetris-types/shared/types"
import WebsocketClient from "../../websocketClient/WebsocketClient"

const sendWebsocketData = {
  name: 'websocket',
  callback: function(e: Event, data: SocketDataItem<ClientToElectronActions>) {
    if (data.action === 'initSocket') {
      (this.websocketClient as WebsocketClient).initSocket(data)
      return
    }
    if (data.action === 'killSocket') {
      (this.websocketClient as WebsocketClient).killSocket()
      return
    }
    this.websocketClient.sendData(data)
  }
}

export default sendWebsocketData