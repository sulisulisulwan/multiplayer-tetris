import { genericObjectIF } from "../../../types";

export class TSpinMiniNoLineClearAward {
  public calculateScore(currentScore: number, scoringData: genericObjectIF): number {
    const { currentLevel } = scoringData
    const tSpinMiniAward =  100 * currentLevel
    return currentScore + tSpinMiniAward
  }
}