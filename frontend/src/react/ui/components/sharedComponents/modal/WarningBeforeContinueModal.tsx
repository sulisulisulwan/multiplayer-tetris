import * as React from 'react'
import HoverButton from '../HoverButton'

const WarningBeforeContinueModal = ({ setModalClosed, title, text, onClickConfirm }: any) => {

  return (
    <div
      style={{
        borderTop: 'solid white 1px',
        borderBottom: 'solid darkgray 1px',
        minHeight: 200,
        minWidth: 450,
        background: '#202020'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 50,
          paddingTop: 20,
          fontSize: 20,
          fontWeight: 700,
          fontFamily: 'Exo',
          color: '#d84356'
        }}
      >
        {title}
      </div>
      <div 
        className="modal-message"
        style={{
          color: 'white', 
          fontFamily: 'Exo',
          paddingTop: 5,
          paddingBottom: 10,
          paddingRight: 30,
          paddingLeft: 30,
          textAlign: 'center'
        }}>
        {text}
      </div>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          height: 50,
          paddingTop: 20,
          paddingBottom: 20
      }}>
        <HoverButton
          style={{
            width: 100,
            marginRight: 10,
            backgroundColor: '#d84356'
          }}
          onClick={onClickConfirm}
          opacityMax={1}
          opacityMin={.8}
          children='CONFIRM'
        />
        <HoverButton
          style={{
            marginLeft: 10,
            width: 100,
          }}
          onClick={() => {
            setModalClosed()
          }}
          opacityMax={1}
          opacityMin={.8}
          children='CANCEL'
        />
      </div>
    </div>
  )
}

export default WarningBeforeContinueModal