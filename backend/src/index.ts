import DgramServer from './dgram/DgramServer.js'
import WebsocketServer from './websocket/WebsocketServer.js'
import DBApiServer from './http/server'

new DgramServer()
new WebsocketServer()
DBApiServer.listen(3002, () => {
  console.log('Database API Server listening on port 3002')
})
