import { GenericObject } from "multiplayer-tetris-types/frontend";

export class TSpinNoLineClearAward {
  public calculateScore(currentScore: number, scoringData: GenericObject): number {
    const { currentLevel } = scoringData
    const tSpinAward =  400 * currentLevel
    return currentScore + tSpinAward
  }
}