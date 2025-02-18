import { AutoRepeat, LocalGameState, SharedHandlersMap } from "multiplayer-tetris-types/frontend";
import { EventData } from "multiplayer-tetris-types/frontend/core";
import { AppState } from "multiplayer-tetris-types/frontend/shared";
import { SharedScope } from "../../SharedScope";
import { soundEffects } from "../../../App";
import { Dispatch } from "redux";
import { updateMultipleGameStateFields } from "../../../redux/reducers/gameState";

export default class ActionLeftAndRight extends SharedScope {

    constructor(sharedHandlers: SharedHandlersMap) {
      super(sharedHandlers)
    }

    execute(
      gameState: AppState['gameState'],
      dispatch: Dispatch,
      eventData: EventData, 
    ) {
      let { playerAction, playfield, currentTetrimino } = gameState
      const { autoRepeat } = playerAction
      let { override } = autoRepeat
      const { strokeType, action } = eventData
      
      const newGameState: any = {
        playerAction: {
          autoRepeat: {
            left: gameState.playerAction.autoRepeat.left,
            right: gameState.playerAction.autoRepeat.right,
            override: gameState.playerAction.autoRepeat.override,
          },
          softdrop: gameState.playerAction.softdrop,
          harddrop: gameState.playerAction.harddrop,
          flipClockwise: gameState.playerAction.flipClockwise,
          flipCounterClockwise: gameState.playerAction.flipCounterClockwise,
          hold: gameState.playerAction.hold
        }
      }
    
      if (strokeType === 'keyup') {
        clearInterval(gameState[`${action}IntervalId` as keyof LocalGameState] as number)
        if (gameState.autoRepeatDelayTimeoutId) {
          clearTimeout(gameState.autoRepeatDelayTimeoutId)
        }
    
        newGameState.playerAction.autoRepeat.override = null
    
        action === 'left' ? newGameState.leftIntervalId = null : newGameState.rightIntervalId = null
        action === 'left' ? newGameState.playerAction.autoRepeat.left = false : newGameState.playerAction.autoRepeat.right = false  
      }
    
    
      // Determine what action will be taken.  Override always determines this.
      if (strokeType === 'keydown') {
        if (gameState.playerAction.autoRepeat[action as keyof AutoRepeat] && override === action) {
          return
        }
    
        const oppositeAction = action === 'left' ? 'right' : 'left'
    
        // If there is a preexisting action in motion and override will switch to opposite action
        if (gameState[`${oppositeAction}IntervalId`]) {
          clearInterval(gameState[`${oppositeAction}IntervalId`])
          newGameState[`${oppositeAction}IntervalId`] = null
        }
    
        if (action === 'left') {
          newGameState.playerAction.autoRepeat.left = true  
        } else if (action === 'right') {
          newGameState.playerAction.autoRepeat.right = true
        }
        newGameState.playerAction.autoRepeat.override = newGameState.playerAction.autoRepeat[oppositeAction] ? action : null
      } 
    
      // Execute the action if there is an action to be executed
      if (newGameState.playerAction.autoRepeat.override 
        || newGameState.playerAction.autoRepeat.left 
        || newGameState.playerAction.autoRepeat.right
      ) {
    
        const { override, left } = newGameState.playerAction.autoRepeat
        let direction = override ? override : (left ? 'left' : 'right')
    
        if (gameState.gameOptions.ghostTetriminoOn) {
          playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(gameState.ghostCoords, playfield)
        }
    
        const { 
          newPlayfield, 
          newTetrimino, 
          successfulMove
        } = this.tetriminoMovementHandler.moveOne(direction, playfield, currentTetrimino)
      
        if (successfulMove)  {
          soundEffects.play('tetriminoMove')
          
          newGameState.currentTetrimino = newTetrimino
    
          if (gameState.gameOptions.ghostTetriminoOn) {
            const newGhostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
            newGameState.ghostCoords = newGhostCoords
            newGameState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(newGhostCoords, newPlayfield, '[g]')
          } else {
            newGameState.playfield = newPlayfield
          }
    
          //TODO: This should account for movements that occur only after lockdown, not before.  This current logic will mistake pre lockdown scenarios as post lockdown
          // Think, at every point in time, the newTetriminoBaseRowIdx will === appState.lowestLockSurfaceRow
          const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
          if (
            newTetriminoBaseRowIdx <= gameState.lowestLockSurfaceRow && 
            gameState.postLockMode &&
            gameState.extendedLockdownMovesRemaining > 0
          ) {
            clearTimeout(gameState.lockTimeoutId)
            newGameState.lockTimeoutId = null
            newGameState.extendedLockdownMovesRemaining = gameState.extendedLockdownMovesRemaining - 1
          }
        }
      
      }
    
      dispatch(updateMultipleGameStateFields({ ...newGameState }))
    }
    
}