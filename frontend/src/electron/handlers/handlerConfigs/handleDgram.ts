import { HandlerConfig, SocketDataItem }  from "multiplayer-tetris-types"
import { DgramServerToClient } from "multiplayer-tetris-types/shared/types"
import DatagramClient from "../../dgramClient/DatagramClient"

const sendDgramData: HandlerConfig = {
  name: 'dgram',
  callback: function (e: Event, data: SocketDataItem<any>) {
    if (data.action === 'initSocket') {
      (this.dgramClient as DatagramClient).initSocket(data)
      return
    }
    if (data.action === 'killSocket') {
      (this.dgramClient as DatagramClient).killSocket()
      return
    }
    
    this.dgramClient.sendData(data)
  }
}

export default sendDgramData
