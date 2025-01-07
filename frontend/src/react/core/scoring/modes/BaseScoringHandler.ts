import { genericObjectIF, scoreItemIF, scoringHistoryPerCycleIF, scoringMethodsIF } from "../../../types"

export abstract class BaseScoringHandler {


  protected scoringMethods: scoringMethodsIF
  
  constructor() {
    this.scoringMethods = {}
  }

  public abstract handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: scoreItemIF[], 
    scoringHistoryPerCycle: scoringHistoryPerCycleIF
  ): number

  // scoreContext can be passed from any part of the Application for any reason
  public updateScore(currentScore: number, scoreItem: scoreItemIF) {

    const { type, data } = scoreItem
    const scoringMethod = this.scoringMethods[type as keyof scoringMethodsIF]
    return scoringMethod(currentScore, data)
  }
  // Executed within PlayerAction or Falling Phase
  protected abstract softdrop(currentScore: number, scoringData: genericObjectIF): number

  protected abstract harddrop(currentScore: number, scoringData: genericObjectIF): number

  protected abstract lineClear(currentScore: number, scoringData: genericObjectIF): number

  protected abstract tSpinNoLineClear(currentScore: number, scoringData: genericObjectIF): number
  
  protected abstract tSpinMiniNoLineClear(currentScore: number, scoringData: genericObjectIF): number
  

}
