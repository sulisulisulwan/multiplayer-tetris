import { HandlerConfig, SocketDataItem }  from "multiplayer-tetris-types"
import { DgramServerToClient } from "multiplayer-tetris-types/shared/types"

const sendDgramData: HandlerConfig = {
  name: 'dgram',
  callback: function (e: Event, data: SocketDataItem<DgramServerToClient>) {
    this.dgramClient.sendData(data)
  }
}

export default sendDgramData
