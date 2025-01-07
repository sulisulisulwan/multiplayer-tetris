import Server from "./lib/Server.js"
export default class GameEngine {

  constructor() {
    this.dgramServer = new Server()
    this.dgramServer.init(41234)
    this.playerData = {

    }
  }

  serverErrorHandler() {
    this.dgramServer.on('error', (err) => {
      console.error(`server error:\n${err.stack}`)
    })
  }



}