
interface soundEffectsConfigIF {
  [key: string]: string
}

const soundEffectsConfig: soundEffectsConfigIF = {
  // SOUND EFFECTS
  one: './assets/sound/mixkit-arcade-mechanical-bling-210.wav',
  levelUp: './assets/sound/mixkit-game-bonus-reached-2065.wav',
  tetriminoMove: './assets/sound/mixkit-player-jumping-in-a-video-game-2043.wav',
  four: './assets/sound/mixkit-quick-positive-video-game-notification-interface-265.wav',
  five: './assets/sound/mixkit-sci-fi-positive-notification-266.wav',
  lineClear: './assets/sound/mixkit-video-game-health-recharge-2837.wav',
  eight: './assets/sound/mixkit-winning-a-coin-video-game-2069.wav',
  tetriminoLand: './assets/sound/mixkit-short-bass-hit-2299.wav',

}

const musicConfig: soundEffectsConfigIF = {
  'Korobeiniki': './assets/sound/music-korobeiniki.mp3',
  'CrossCode: Raid': './assets/sound/music-crosscoderaid.mp3',
  'Chrome Gadget': './assets/sound/music-chromegadget.mp3',
  'Death Egg': './assets/sound/music-deathegg.mp3',
  'Ice Cap': './assets/sound/music-icecap.mp3',
  // 'Let\s Go!': './assets/sound/music-starfox-training.mp3',
  'Let\s Go!': './assets/sound/starfox-loop.mp3',
  'Zombie Attack': './assets/sound/music-zombieattack.mp3',
}

export { soundEffectsConfig, musicConfig, soundEffectsConfigIF }