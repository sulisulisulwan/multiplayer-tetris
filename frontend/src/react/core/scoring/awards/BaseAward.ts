import { genericObjectIF } from "../../../types";

export abstract class BaseAward {
  public abstract calculateScore(currentScore: number, scoringData: genericObjectIF): number
}