export class VariableGoalSpecs {

  public getClearedLinesGoals(level: number, totalLinesCleared: number): number {
    const newGoal = totalLinesCleared + (level * 5)
    return newGoal
  }

}