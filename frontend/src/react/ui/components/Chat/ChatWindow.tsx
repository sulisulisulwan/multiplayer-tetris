import * as React from 'react'
import { useOutsideAlerter } from '../../hooks/useOutsideAlerter'
import WebsocketBrowser from '../../../sockets/websocket/WebsocketBrowser'
import { AppState, ChatMessageData } from 'multiplayer-tetris-types'
import { useSelector, useDispatch } from 'react-redux'
import { 
  getChatState, 
  setChatInputToFocus, 
  resetChatRecipientState, 
  setChatRecipientToCommitUserWhisper, 
  setChatRecipientToAll,
  setChatRecipientToTypeUserWhisper
} from '../../../redux/reducers/chat'
import { getUserState } from '../../../redux/reducers/user'
import { getPartyState } from '../../../redux/reducers/party'


const ChatWindow = () => {

  const chatState = useSelector(getChatState)
  const userState = useSelector(getUserState)
  const partyState = useSelector(getPartyState)

  const dispatch = useDispatch()
  
  const [ chatInput, setChatInput ] = React.useState('')
  const [ isHoveringOverChatWindow, setIsHoveringOverChatWindow] = React.useState(false)
  const [ isHoveringOverChatInput, setIsHoveringOverChatInput] = React.useState(false)
  const [ whisperRecipient, setWhisperRecipient ] = React.useState('')

  const setChatInputToFocused = (value: boolean) => dispatch(setChatInputToFocus(value));

  const inputWrapperRef = useOutsideAlerter(() => setChatInputToFocused(false))
  const inputRef = React.useRef(null)
  const chatConvoWindow = React.useRef<HTMLDivElement>(null)
  
  const chatInputIsFocused = chatState.inputFocused
  
  if (inputRef.current) chatInputIsFocused ? inputRef.current.focus() : inputRef.current.blur()

  const backgroundColor = 'rgb(53, 57, 53)'
  const textSize = '1.5vh'
  const typingWhisperRecipient = chatState.to.chatType === 'whisper' && chatState.to.recipient.length === 0

  const handleSendMessageToChat = async (e: any) => {
    let recipient: string[] = []
    if (chatState.to.chatType === 'party') {
      recipient = partyState.users.slice()
    } else if (chatState.to.chatType === 'whisper') {
      recipient = chatState.to.recipient.slice()
    } else if (chatState.to.chatType === 'all') {
      recipient = []
    }

    const newChatMessageData: ChatMessageData = {
      id: null,
      to: {
        chatType: chatState.to.chatType,
        recipient
      },
      userId: userState.id,
      username: userState.name,
      content: e.target.value
    }

    WebsocketBrowser.send({
      action: 'sendChatMessage',
      data: newChatMessageData
    })

    dispatch(resetChatRecipientState())
    setChatInput('')
  }

  React.useEffect(() => {
    WebsocketBrowser.send({ action: 'getAllChatMessages', data: null })
  }, [])

  React.useEffect(() => {
    chatConvoWindow.current.scrollTop = chatConvoWindow.current.scrollHeight
  }, [chatState.messages, isHoveringOverChatInput])

  const chatInputMouseHover = (e: any) => setIsHoveringOverChatInput(e.type === 'mouseenter')
  const chatWindowMouseHover = (e: any) => setIsHoveringOverChatWindow(e.type === 'mouseenter')

  const left = '3vw'
  const bottom = '3vw'
  const chatConvoFrombottom = '5vw'
  const convoHeight = '30vh'

  return (

    <>
      <div
        ref={chatConvoWindow}
        className='chat-convo'
        onMouseEnter={chatWindowMouseHover}
        onMouseLeave={chatWindowMouseHover}
        style={{
          cursor: 'pointer',
          display: isHoveringOverChatWindow || isHoveringOverChatInput || chatInputIsFocused ? '' : 'none',
          position: 'fixed',
          left: left,
          bottom: chatConvoFrombottom,
          height: convoHeight,
          zIndex: 100,
          width: '25%',
          overflow: 'scroll',
          scrollbarColor: 'dimgray black',
          scrollbarWidth: 'thin',
        }}
      >
        <div className='chat-convo-overlay'
          
          style={{
            width: 'calc(100% - 20px)',
            background: 0,
            zIndex: 8,
            display: 'flex',
            height: chatConvoFrombottom,
            paddingLeft: '.5vw',
            paddingRight: '.5vw',
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight:'100%',
            }}
          >
            {
                chatState.messages.map((message) => {
                return (
                  <li 
                    style={{
                      fontFamily: 'Exo',
                      fontSize: textSize,
                      color: 'white', 
                      paddingBottom: 5
                    }}
                    key={'asdf' + message.id + Math.random()}
                  >
                    <span 
                      style={{ 
                        color: message.to.chatType === 'whisper' ? 'pink' : 'lightblue', 
                        fontWeight: 700, 
                        paddingRight: 5, 
                        textTransform: 'capitalize'
                      }}
                    >({message.to.chatType})</span>
                    <span 
                      style={{ 
                        color: 'lightyellow', 
                        paddingRight: 5 
                      }}>{message.to.chatType === 'whisper' ? (message.to.recipient[0] === userState.name ? message.username : 'To ' + message.to.recipient[0]) : message.username}:</span>
                    <span>{message.content}</span>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div
        className='chat-convo-underlay'
        style={{
          position: 'absolute',
          display: isHoveringOverChatWindow || isHoveringOverChatInput || chatInputIsFocused ? '' : 'none',
          left: left,
          width: '25%',
          bottom: chatConvoFrombottom,
          height: convoHeight,
          background: backgroundColor,
          opacity: .5,
          zIndex: 2
        }}
      />
      <div  
        className='chat-input'
        style={{
          color: 'white',
          position: 'fixed',
          left: left,
          bottom: bottom,
          display:'flex',
          width: '25%',
          alignContent: 'center',
          verticalAlign: 'middle',
        }}
      > 
        <div
          onClick={() => setChatInputToFocused(true)}
          ref={inputWrapperRef}
          className='chat-input-overlay'
          style={{
            width: '100%',
            height: '100%',
            background: 0,
            zIndex: 8,
            display: 'flex',
            flexDirection: 'row',
          }}
        > 
          {
              chatState.to.chatType !== 'whisper' ? 
                <span
                  style={{ 
                    paddingTop: 5, 
                    paddingLeft: 10,
                    paddingBottom: 5,
                    fontWeight: 700,
                    color: 'lightblue',
                    fontFamily: 'Exo',
                    fontSize: textSize,
                    textTransform: 'capitalize',
                    opacity: document.activeElement === inputRef.current ? 1 : .5
                  }}
                >{`${chatState.to.chatType}: `}</span> :
              chatState.to.recipient.length === 0 && !whisperRecipient ? 
              <>
                <span
                  style={{ 
                    paddingTop: 5, 
                    paddingLeft: 10,
                    paddingBottom: 5,
                    fontWeight: 700,
                    color: 'pink',
                    fontFamily: 'Exo',
                    fontSize: textSize,
                    textTransform: chatState.to.chatType === 'whisper' ? 'none' : 'capitalize',
                    opacity: document.activeElement === inputRef.current ? 1 : .5
                  }}
                >{'To '}</span>
                <span 
                  style={{ 
                    color: 'pink',
                    fontFamily: 'Exo',
                    paddingTop: 5, 
                    paddingBottom: 5,
                    paddingLeft: 5,
                    opacity: .5,
                    fontWeight: 500,
                    fontSize: textSize,
                    }}>Name</span> 
              </> :
              chatState.to.recipient.length === 0 ? 
              <span
                style={{ 
                  paddingTop: 5, 
                  paddingLeft: 10,
                  paddingBottom: 5,
                  fontWeight: 700,
                  color: typingWhisperRecipient || chatState.to.chatType === 'whisper' ? 'pink' : 'lightblue',
                  fontFamily: 'Exo',
                  fontSize: textSize,
                  textTransform: chatState.to.chatType === 'whisper' ? 'none' : 'capitalize',
                  opacity: document.activeElement === inputRef.current ? 1 : .5
                }}
              >{'To '}{whisperRecipient}</span> :
              <span
                style={{ 
                  paddingTop: 5, 
                  paddingLeft: 10,
                  paddingBottom: 5,
                  fontWeight: 700,
                  color: typingWhisperRecipient || chatState.to.chatType === 'whisper' ? 'pink' : 'lightblue',
                  fontFamily: 'Exo',
                  fontSize: textSize,
                  textTransform: chatState.to.chatType === 'whisper' ? 'none' : 'capitalize',
                  opacity: document.activeElement === inputRef.current ? 1 : .5
                }}
              >{`To ${chatState.to.recipient[0]}:`}</span>

            }
          <input 
            onMouseEnter={chatInputMouseHover}
            onMouseLeave={chatInputMouseHover}
            ref={inputRef}
            style={{
              caretColor: typingWhisperRecipient ? 'transparent' : '',
              color: 'white',
              fontFamily: 'Exo',
              fontSize: textSize,
              background: 0,
              border: 0,
              outline: 'none',
              paddingLeft: 5,
              paddingTop: 5,
              paddingBottom: 5
            }}
            onChange={(e) => { 
              e.preventDefault()
              if (typingWhisperRecipient) {
                return 
              }
              setChatInput(e.target.value) 
            }}
            onKeyDown={(e) => {
              if (chatState.to.chatType === 'whisper' && chatState.to.recipient.length === 0) {
                if (
                  ['ArrowRight', 'ArrowLeft', 'ArrowUp', 
                   'ArrowDown', 'Meta', 'Control', 'Alt', 'CapsLock', 'Shift', 'Enter'
                ].includes(e.key)) return

                if (e.key === 'Backspace') {
                  return setWhisperRecipient(whisperRecipient.substring(0, whisperRecipient.length - 1))
                }

                if (e.key === 'Tab') {
                  e.preventDefault()

                  const existingFriend = userState.friends.find((friend) => friend.name === whisperRecipient)
                  if (whisperRecipient && existingFriend) {
                    dispatch(setChatRecipientToCommitUserWhisper(whisperRecipient))
                    return setWhisperRecipient('')
                  }
                }

                if (e.key === 'Escape') {
                  e.preventDefault()
                  dispatch(resetChatRecipientState())
                  return setWhisperRecipient('')
                }

                setWhisperRecipient(whisperRecipient + e.key)
                return
              }

              if (e.key === 'Enter') { 

                if(e.shiftKey) {
                  return dispatch(setChatRecipientToAll([]))
                }

                if(e.ctrlKey) {
                  return dispatch(setChatRecipientToTypeUserWhisper())
                }

                if (!chatInput) return setChatInputToFocused(false)
                handleSendMessageToChat(e)
              }
            }}
            value={typingWhisperRecipient ? ' [TAB] to complete' : chatInput}
            placeholder={ typingWhisperRecipient ? 'Name' : 'type here...'}
          />
        </div>
        <div
          className='chat-input-underlay'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: backgroundColor,
            opacity: .5,
            zIndex: 5
          }}
        />
      </div>
    </>
  )
}

export default ChatWindow
