(window as any).global = window
import * as React from "react"
import * as ReactDom from "react-dom/client"
import App from "./react/App"

const container = document.getElementById("app")
const root = ReactDom.createRoot(container)

root.render(<App/>)