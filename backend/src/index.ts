import DgramServer from './dgram/DgramServer.js'
import WebsocketServer from './websocket/WebsocketServer.js'
import DBApiServer from './http/httpserver.js'
import GamesDB from './remotegamedemo/GamesDB.js'

const gameDb = new GamesDB()
export { gameDb }
new WebsocketServer()
DBApiServer.listen(3002, () => {
  console.log('Database API Server listening on port 3002')
})
