import * as React from 'react'
import PlayView from "./ui/PlayView/PlayView"
import { 
  SinglePlayer,
  SinglePlayerOptions, 
  SinglePlayerHighscore,
  SinglePlayerHelp, 
  MultiPlayer, 
} from "./ui/MenuView"
import MainMenuView from './ui/MenuView/MainMenuView'

export function getView () {
  
  const viewMap = new Map([
    [
      'gameActive', 
      <PlayView 
        appState={this.state} 
        startQuitClickHandler={this.startQuitClickHandler} 
        playerKeystrokeHandler={this.playerKeystrokeHandler}
      />
    ],
    [
      'mainMenu', 
      <MainMenuView 
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      />
    ],
    [
      'singleplayer',
      <SinglePlayer
        appState={this.state}
        setAppState={this.setState.bind(this)}
      /> 
    ],
    [
      'multiplayer',         
      <MultiPlayer
        appState={this.state}
        setAppState={this.setState.bind(this)} 
      />
    ],
    [
      'singleplayer_options',
      <SinglePlayerOptions
        appState={this.state}
        setAppState={this.setState.bind(this)} 
      />
    ],
    [ 
      'singleplayer_highscore',
      <SinglePlayerHighscore
        appState={this.state}
        setAppState={this.setState.bind(this)}
      />
    ],
    [
      'singleplayer_help',
      <SinglePlayerHelp
        appState={this.state}
        setAppState={this.setState.bind(this)}
      />
    ],
    [
      'loadGame',         
      <div>LOADING</div>
    ],
  ])

  return viewMap.get(this.state.view)
}
