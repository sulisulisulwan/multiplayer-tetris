import { GoalSpecs as GoalSpecsAbstract} from "multiplayer-tetris-types"

export class VariableGoalSpecs implements GoalSpecsAbstract {

  public getClearedLinesGoals(level: number, totalLinesCleared: number): number {
    const newGoal = totalLinesCleared + (level * 5)
    return newGoal
  }

}