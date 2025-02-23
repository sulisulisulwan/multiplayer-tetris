type SetIntervalId = ReturnType<typeof setInterval> 
type SetTimeoutId = ReturnType<typeof setTimeout>
type TimerTypes = 'lockTimeout' | 'autoRepeatDelayTimeout' | 'leftInterval' | 'rightInterval' | 'fallInterval'

class TimerManager {
  protected timerIdsMap = new Map<TimerTypes, SetIntervalId | SetTimeoutId>

  constructor() {
    this.timerIdsMap = new Map<TimerTypes, SetIntervalId | SetTimeoutId>([
      ['lockTimeout', null],
      ['autoRepeatDelayTimeout', null],
      ['leftInterval', null],
      ['rightInterval', null],
      ['fallInterval', null]
    ])
  }

  public clear(type: TimerTypes) {
    const id = this.timerIdsMap.get(type);
    ['lockTimeout', 'autoRepeatDelayTimeout'].includes(type) ? clearTimeout(id) : clearInterval(id)
    this.timerIdsMap.set(type, null)
  }

  public isSet(type: TimerTypes) {
    return this.timerIdsMap.get(type) !== null
  }

  public getId(type: TimerTypes) {
    return this.timerIdsMap.get(type)
  }

  public setTimer(type: TimerTypes, id: SetIntervalId | SetTimeoutId) {
    this.timerIdsMap.set(type, id)
  }

  public clearAllTimers() {
    for (let timer of this.timerIdsMap.keys()) {
      this.timerIdsMap.set(timer, null);
    }
  }
}

export default TimerManager