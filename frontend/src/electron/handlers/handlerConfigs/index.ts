import dgramHandler from './handleDgram'
import websocketHandler from './handleWebsocket'
const handlers = [
  dgramHandler,
  websocketHandler
]

export default handlers