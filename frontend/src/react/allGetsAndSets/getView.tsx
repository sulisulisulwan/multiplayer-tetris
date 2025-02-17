import * as React from 'react'
import PlayView from "../ui/components/PlayView/PlayView"
import { 
  SinglePlayer,
  SinglePlayerOptions, 
  SinglePlayerHighscore,
  SinglePlayerHelp, 
  MultiPlayer, 
} from "../ui/components/MenuView"
import MainMenuView from '../ui/components/MenuView/MainMenuView'
import MatchFoundView from '../ui/components/MatchFoundView'
import MultiplayerGameLoading from '../ui/components/MultiplayerGameLoading'

export function getView (viewState: string) {
  const viewMap = new Map([
    [ 'gameActive', <PlayView/> ],
    [ 'matchFound', <MatchFoundView/> ],
    [ 'multiplayerGameLoading', <MultiplayerGameLoading/> ],
    [ 'mainMenu', <MainMenuView/> ],
    [ 'singleplayer', <SinglePlayer/> ],
    [ 'multiplayer', <MultiPlayer/> ],
    [ 'singleplayer_options', <SinglePlayerOptions/> ],
    [ 'singleplayer_highscore', <SinglePlayerHighscore/> ],
    [ 'singleplayer_help', <SinglePlayerHelp/> ],
    [ 'loadGame', <div>LOADING</div> ],
  ])

  return viewMap.get(viewState)
}
