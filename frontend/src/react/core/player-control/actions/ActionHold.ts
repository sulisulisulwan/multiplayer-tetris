import { LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend"
import { EventData } from "multiplayer-tetris-types/frontend/core"
import { AppState } from "multiplayer-tetris-types/frontend/shared"
import { SharedScope } from "../../SharedScope"
import { TetriminoFactory } from "../../tetrimino/TetriminoFactory"
import { Dispatch } from "redux"
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState"

export default class ActionHold extends SharedScope {

  constructor(sharedHandlers: SharedHandlersMap) {
    super(sharedHandlers)
  }

  execute(
    gameState: AppState['gameState'],
    dispatch: Dispatch,
    eventData: EventData, 
  ) {

      const { strokeType } = eventData
    
      // If player is holding down key after initial press, negate keydown event fires
      if (strokeType === 'keydown' && gameState.playerAction.hold) {
        return
      }
    
      let { swapStatus } = gameState.holdQueue
      if (swapStatus === 'swapAvailableNextTetrimino') {
        return
      }
    
      const newGameState = {} as LocalGameState
      newGameState.playerAction = gameState.playerAction
    
      if (strokeType === 'keyup') {
        newGameState.playerAction.hold = false

        dispatch(updateMultipleGameStateFields({ ...newGameState }))
      }
      /**
       * Two swapStatus states exist:
       *   'swapAvailableNow' (default) - Hitting swap key will trigger swap
       *   'justSwapped' - Interim state between hold event and the Generation phase it triggers
       *   'swapAvailableNextTetrimino' - State during the falling phase of the generatec tetrimino after swap occured 
       */
    
      if (swapStatus === 'swapAvailableNow') {
    
        let { heldTetrimino } = gameState.holdQueue
        let { currentTetrimino, playfield } = gameState
    
        // Remove the ghost tetrimino
        if (gameState.gameOptions.ghostTetriminoOn) {
          playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield)
        }
    
        // Remove the swapped out tetrimino from the playfield
        const currentTetriminoCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(currentTetrimino)
        newGameState.playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(currentTetriminoCoordsOnPlayfield, playfield)
    
        // Generate a new tetrimino of the current one to put in the hold queue
        newGameState.currentGamePhase = 'generation'
        newGameState.playerAction.hold = strokeType === 'keyup' ? false : true
        newGameState.holdQueue = {
          swapStatus: 'justSwapped',
          heldTetrimino: TetriminoFactory.resetTetrimino(currentTetrimino),
          available: true
        }
        newGameState.currentTetrimino = heldTetrimino
        
        return dispatch(updateMultipleGameStateFields({ ...newGameState }))
      }
    
      // For all other cases...
      newGameState.playerAction.hold = false
      dispatch(updateMultipleGameStateFields({ ...newGameState }))
  }
}
