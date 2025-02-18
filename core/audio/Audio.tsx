
import { Audio as AudioAbstract } from "multiplayer-tetris-types/frontend/core"

export default abstract class Audio implements AudioAbstract{

  protected sounds: Record<string, any>
  protected mountId: string

  constructor(sounds: any[], mountId: string) {
    this.sounds = this.loadSounds(sounds)
    this.mountId = mountId
  }

  public abstract play(soundName: string): void

  public setVolume(volume: number): void {
    for (const sound in this.sounds) {
      this.sounds[sound].audioTag.volume = volume
    }
  }

  public addSoundsToDOM(): this {
    const mountEl = document.getElementById(this.mountId)
    for (const soundname in this.sounds) {
      const sound = this.sounds[soundname]
      mountEl.appendChild(sound.audioTag)
    }
    return this
  }
  
  protected abstract loadSounds(sounds: any[]): any

}