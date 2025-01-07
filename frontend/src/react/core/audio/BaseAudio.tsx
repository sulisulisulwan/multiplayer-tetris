
export default abstract class BaseAudio {

  protected sounds: Record<string, any>
  protected mountId: string

  constructor(sounds: any[], mountId: string) {
    this.sounds = this.loadSounds(sounds)
    this.mountId = mountId
  }

  public setVolume(volume: number): void {
    for (const sound in this.sounds) {
      this.sounds[sound].audioTag.volume = volume
    }
  }

  public addSoundsToDOM() {
    const mountEl = document.getElementById(this.mountId)
    for (const soundname in this.sounds) {
      const sound = this.sounds[soundname]
      mountEl.appendChild(sound.audioTag)
    }
  }
  
  protected abstract loadSounds(sounds: any[]): any

}