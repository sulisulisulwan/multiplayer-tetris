// import GameEngine from './dgram/GameEngine.js'
import WebsocketServer from './websocket/WebsocketServer.js'
import DBApiServer from './http/server'

// const gameEngine = new GameEngine()
new WebsocketServer()
DBApiServer.listen(3002, () => {
  console.log('Database API Server listening on port 3002')
})
