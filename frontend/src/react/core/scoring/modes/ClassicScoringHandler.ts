import { genericObjectIF, scoreItemIF, scoringHistoryPerCycleIF } from "../../../types"
import { 
  LineClearAward,
  SoftdropAward,
  HarddropAward,
  TSpinMiniNoLineClearAward,
  TSpinNoLineClearAward
} from "../awards"
import { BaseScoringHandler } from "./BaseScoringHandler"


export class ClassicScoringHandler extends BaseScoringHandler {

  private awardLineClear: LineClearAward
  private awardSoftdrop: SoftdropAward
  private awardHarddrop: HarddropAward
  private awardTSpinNoLineClear: TSpinNoLineClearAward
  private awardTSpinMiniNoLineClear: TSpinMiniNoLineClearAward

  constructor() {
    super()

    this.awardLineClear = new LineClearAward()
    this.awardSoftdrop = new SoftdropAward()
    this.awardHarddrop = new HarddropAward()
    this.awardTSpinNoLineClear = new TSpinNoLineClearAward()
    this.awardTSpinMiniNoLineClear = new TSpinMiniNoLineClearAward()

    this.scoringMethods = {
      lineClear: this.lineClear.bind(this),
      softdrop: this.softdrop.bind(this),
      harddrop: this.harddrop.bind(this),
      tSpinNoLineClear: this.tSpinNoLineClear.bind(this),
      tSpinMiniNoLineClear: this.tSpinMiniNoLineClear.bind(this)
    }
    
  }

  public handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: scoreItemIF[], 
    scoringHistoryPerCycle: scoringHistoryPerCycleIF
  ): number {

    const filteredScoringContexts = scoreItemsForCompletion.filter((scoreItem: scoreItemIF) => {
      const { type } = scoreItem

      if (type === 'tSpinNoLineClear' || type === 'tSpinMiniNoLineClear') {
        // skip this context as lineClear is the priority
        return scoringHistoryPerCycle.lineClear ? false : true
      }
      return true

    })

    const newTotalScore = filteredScoringContexts.reduce((runningScore: number, scoreItem: scoreItemIF) => {
      return this.updateScore(runningScore, scoreItem)
    }, currentScore)

    return newTotalScore

  }

  // Executed within PlayerAction or Falling Phase
  softdrop(currentScore: number, scoringData: genericObjectIF) {
    const newTotalScore = this.awardSoftdrop.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  harddrop(currentScore: number, scoringData: genericObjectIF) {
    const newTotalScore = this.awardHarddrop.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  // Executed in Completion Phase
  lineClear(currentScore: number, scoringData: genericObjectIF) {
    const newTotalScore = this.awardLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  tSpinNoLineClear(currentScore: number, scoringData: genericObjectIF) {
    const newTotalScore = this.awardTSpinNoLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore
  }
  
  tSpinMiniNoLineClear(currentScore: number, scoringData: genericObjectIF) {
    const newTotalScore = this.awardTSpinMiniNoLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore  
  }

}
