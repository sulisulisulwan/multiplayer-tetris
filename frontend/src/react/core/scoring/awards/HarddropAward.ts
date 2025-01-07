import { genericObjectIF } from "../../../types";
import { BaseAward } from "./BaseAward";

export class HarddropAward extends BaseAward {
  public calculateScore(currentScore: number, scoringData: genericObjectIF): number {

    console.log(currentScore, scoringData)
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }
}