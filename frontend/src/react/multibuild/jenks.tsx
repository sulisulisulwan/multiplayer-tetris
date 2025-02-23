(window as any).global = window
import * as React from "react"
import * as ReactDom from "react-dom/client"
import App from "../App"
import buildUserEnv from "../dummydata/buildUserEnv"
import { Provider } from "react-redux"
import { frontendStore }from "multiplayer-tetris-redux"

const container = document.getElementById("app")
const root = ReactDom.createRoot(container)

const { thisUserId } = buildUserEnv('jenks')
//We dont use otherPlayers as we want that to be dynamically fetched from server
root.render(
  <Provider store={frontendStore}>
    <App thisUserId={thisUserId}/>
  </Provider>
)