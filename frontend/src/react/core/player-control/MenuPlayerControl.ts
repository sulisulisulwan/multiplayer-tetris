import { AppState, SetAppState } from "multiplayer-tetris-types/frontend/shared";


export default class MenuPlayerControl {
  protected setAppState: SetAppState
  protected keystrokeMap: Map<string, string>
  protected playerActions: any
  
  constructor(setAppState: SetAppState) {
    this.keystrokeMap = new Map([
      ['Enter','activateChat'],
      ['Escape','deactivateChat'],
    ])
    this.playerActions = {
      activateChat: { execute: this.activateChat.bind(this) },
      deactivateChat: { execute: this.deactivateChat.bind(this) },
      activateChatWhisper: { execute: this.activateChatWhisper.bind(this) }
    }
    this.setAppState = setAppState

  }

  keystrokeHandler(appState: AppState, e: any) {
    const action = this.keystrokeMap.get(e.key)
    const playerActionHandler = this.playerActions[action]
    if (playerActionHandler) playerActionHandler.execute(e, appState)
  }

  activateChat(e: any, appState: AppState) {
    if (e.type === 'keyup') return
    if (e.type === 'keydown') {
      if (!appState.chat.inputFocused) {

        this.setAppState((prevState) => ({ 
          ...prevState, 
          chat: { 
            ...prevState.chat, 
            inputFocused: true,
            to: {
              chatType: e.shiftKey ? 'all' : e.ctrlKey ? 'whisper' : 'party',
              recipient: null
            }
          } 
        }))
      }
    }
  }

  activateChatWhisper(e: any, appState: AppState) {
    if (e.type === 'keyup') return
    if (e.type === 'keydown') {
      if (appState.chat.to.chatType !== 'whisper') {
        e.preventDefault()
      }

      if (!appState.chat.inputFocused) {

        this.setAppState((prevState) => ({ 
          ...prevState, 
          chat: { 
            ...prevState.chat, 
            inputFocused: true,
            to: {
              chatType: 'whisper',
              recipient: null
            }
          } 
        }))
      }
    }
  }

  deactivateChat(e: any, appState: AppState) {
    if (e.type === 'keyup') return
    if (e.type === 'keydown') {
      if (appState.chat.inputFocused) {
        this.setAppState((prevState) => ({ 
          ...prevState, 
          chat: { 
            ...prevState.chat, 
            inputFocused: false,
            to: {
              chatType: 'party',
              recipient: null
            }
          } 
        }))
      }
    }
  }
}

