import { genericObjectIF } from "../../../types";

export class TSpinNoLineClearAward {
  public calculateScore(currentScore: number, scoringData: genericObjectIF): number {
    const { currentLevel } = scoringData
    const tSpinAward =  400 * currentLevel
    return currentScore + tSpinAward
  }
}