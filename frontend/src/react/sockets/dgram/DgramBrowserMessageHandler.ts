import { ClientToDgramServer, SocketDataItemDgram } from "multiplayer-tetris-types/shared/types"
import { DgramBrowser } from "./DgramBrowser"
import { Dispatch } from "@reduxjs/toolkit"
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux"

type DgramSocketHandlerArgs = {
  msgData: any
  socketSend: (data: SocketDataItemDgram<ClientToDgramServer>) => void
  dispatch: Dispatch
}


type DgramSocketHandler = (arg: DgramSocketHandlerArgs) => void

export default class DgramBrowserMessageHandler {

  protected handlerMap: Map<string, DgramSocketHandler>
  
  constructor() {
    this.handlerMap = new Map([
      ['trackingUser', this.trackingUser.bind(this)],
      ['gameStateUpdate', this.gameStateUpdate.bind(this)],
    ])
  }

  public getHandler(action: string) {
    return this.handlerMap.get(action)
  }

  protected trackingUser({ msgData, socketSend }: DgramSocketHandlerArgs) {
    // here we need to somehow send the initial gameState AND gameId to /game http server patch

    if (msgData.activateNewGame) {
      console.log('ACTIVATING NEW GAME')
      socketSend({
        userId: msgData.userId,
        action: 'activateGame',
        data: null
      })
      return
    }

    console.log('not activating new game')
  }



  protected gameStateUpdate({ msgData, dispatch }: DgramSocketHandlerArgs) {
    console.log(dispatch)
    dispatch(updateMultipleGameStateFieldsSingleplayer(msgData))
  }

}