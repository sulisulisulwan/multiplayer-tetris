import * as React from 'react'
import SingleplayerPlayView from "../ui/views/game-active/SingleplayerPlayView"
import MainMenuView from '../ui/views/MainMenuView'
import MatchFoundView from '../ui/views/MatchFoundView'
import MultiplayerGameLoading from '../ui/views/MultiplayerGameLoading'
import SinglePlayerMenu from '../ui/views/singleplayer-menu/SinglePlayerMenu'
import MultiPlayerMenu from '../ui/views/multiplayer-menu/MultiPlayerMenu'
import SinglePlayerOptions from '../ui/views/singleplayer-menu/singleplayer-options/SinglePlayerOptions'
import SinglePlayerHighScore from '../ui/views/singleplayer-menu/singleplayer-highscore/SinglePlayerHighscore'
import SinglePlayerHelp from '../ui/views/singleplayer-menu/singleplayer-help/SinglePlayerHelp'

export function getView (viewState: string) {
  console.log(viewState)
  const viewMap = new Map([
    [ 'gameActive_singleplayer', <SingleplayerPlayView/> ],
    [ 'matchFound', <MatchFoundView/> ],
    [ 'multiplayerGameLoading', <MultiplayerGameLoading/> ],
    [ 'menu_main', <MainMenuView/> ],
    [ 'menu_singleplayer', <SinglePlayerMenu/> ],
    [ 'menu_singleplayer_options', <SinglePlayerOptions/> ],
    [ 'menu_singleplayer_highscore', <SinglePlayerHighScore/> ],
    [ 'menu_singleplayer_help', <SinglePlayerHelp/> ],
    [ 'menu_multiplayer', <MultiPlayerMenu/> ],
    [ 'loadGame_singleplayer', <div>LOADING</div> ],
  ])

  return viewMap.get(viewState)
}
