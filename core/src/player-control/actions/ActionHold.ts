import { AppState, EventData, Tetrimino, TetriminoMovementHandler, OnePlayerLocalGameState } from "multiplayer-tetris-types"
import { updateMultipleGameStateFieldsSingleplayer } from "multiplayer-tetris-redux"
import { Dispatch } from "redux"
import { TetriminoFactory } from "../../tetrimino/TetriminoFactory.js"
import BaseAction from './BaseAction.js'
export default class ActionHold extends BaseAction {


  constructor(tetriminoMovementHandler: TetriminoMovementHandler) {
    super(tetriminoMovementHandler)
  }

  execute(
    gameState: OnePlayerLocalGameState,
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
    
      const newGameState = {} as OnePlayerLocalGameState
      newGameState.playerAction = gameState.playerAction
    
      if (strokeType === 'keyup') {
        newGameState.playerAction.hold = false

        dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
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
          playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield as string[][])
        }
    
        // Remove the swapped out tetrimino from the playfield
        const currentTetriminoCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(currentTetrimino as Tetrimino)
        newGameState.playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(currentTetriminoCoordsOnPlayfield, playfield as string[][])
    
        // Generate a new tetrimino of the current one to put in the hold queue
        newGameState.currentGamePhase = 'generation'
        newGameState.playerAction.hold = strokeType === 'keyup' ? false : true
        newGameState.holdQueue = {
          swapStatus: 'justSwapped',
          heldTetrimino: TetriminoFactory.resetTetrimino(currentTetrimino as Tetrimino),
          available: true
        }
        newGameState.currentTetrimino = heldTetrimino
        
        return dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
      }
    
      // For all other cases...
      newGameState.playerAction.hold = false
      dispatch(updateMultipleGameStateFieldsSingleplayer({ ...newGameState }))
  }
}
