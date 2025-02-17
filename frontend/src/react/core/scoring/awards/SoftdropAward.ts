import { GenericObject } from "multiplayer-tetris-types/frontend";

export class SoftdropAward {
  public calculateScore(currentScore: number, scoringData: GenericObject): number {
    return currentScore + 1
  }
}