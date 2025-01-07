
import * as React from "react"



const App = () => {


  const sendDgramMessage = async () => {
    const message = "Hello World!";
    const win = (window as any)
    win.electronBridge.sendToElectron('dgram', message)
  }

  React.useEffect(() => {
    const win = (window as any)
    win.electronBridge.receiveFromElectron('dgram:in', (data: any) => {
      console.log(data)
    })
  }, [])


  return (
    <>
      <button onClick={sendDgramMessage}>Send DGRAM message</button>
    </>
  )
}



export default App

