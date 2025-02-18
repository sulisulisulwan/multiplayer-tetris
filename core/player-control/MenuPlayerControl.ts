import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { Dispatch } from 'redux'
import { 
  getChatState,   
  activateChat,
  activateChatToWhisper,
  deactivateChat, 
} from "multiplayer-tetris-redux";

type State = {
  chatState: AppState['chat']
}

export default class MenuPlayerControl {
  protected keystrokeMap: Map<string, string>
  protected playerActions: any
  
  constructor() {
    this.keystrokeMap = new Map([
      ['Enter','activateChat'],
      ['Escape','deactivateChat'],
    ])
    this.playerActions = {
      activateChat: { execute: this.activateChat.bind(this) },
      deactivateChat: { execute: this.deactivateChat.bind(this) },
      activateChatWhisper: { execute: this.activateChatWhisper.bind(this) }
    }

  }

  keystrokeHandler(e: any, state: State, dispatch: Dispatch) {
    const action = this.keystrokeMap.get(e.key)
    const playerActionHandler = this.playerActions[action]
    if (playerActionHandler) playerActionHandler.execute(e, state, dispatch)
  }

  activateChat(e: any, state: State, dispatch: Dispatch) {
    const { chatState } = state
    if (e.type === 'keyup') return
    if (e.type === 'keydown') {
      if (!chatState.inputFocused) {
        dispatch(activateChat({ shiftKey: e.shiftKey, ctrlKey: e.ctrlKey }))
      }
    }
  }

  activateChatWhisper(e: any, state: State, dispatch: Dispatch) {
    const { chatState } = state
    if (e.type === 'keyup') return
    if (e.type === 'keydown') {
      if (chatState.to.chatType !== 'whisper') {
        e.preventDefault()
      }

      if (!chatState.inputFocused) {
        dispatch(activateChatToWhisper(undefined))
      }
    }
  }

  deactivateChat(e: any, state: State, dispatch: Dispatch) {
    if (e.type === 'keyup') return
    if (e.type === 'keydown') {
      const { chatState } = state
      if (chatState.inputFocused) {
        dispatch(deactivateChat(undefined))
      }
    }
  }
}

