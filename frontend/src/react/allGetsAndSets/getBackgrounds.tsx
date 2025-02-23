
const bodyTag = document.querySelector('body')
const backgroundDiv = document.getElementById('background')

let ranOnce = 0 //TODO: this is a hack

const backgrounds = {
  gameActive_singleplayer: () => {

    //This gets run often during this phase, whenever setState is used.  consider moving background changing to useEffect-ish thing
    //We can also use this as an opportunity to change backgrounds for different levels!

    if (ranOnce) return //TODO: this is a hack
    ranOnce++ //TODO: this is a hack
    backgroundDiv.childNodes.forEach((child) => {
      backgroundDiv.removeChild(child)
    })

    bodyTag.style.margin = '0'
    bodyTag.style.height ='100vh'
    bodyTag.style.fontWeight = '100'
    bodyTag.style.background = 'radial-gradient(#a23982,#1f1013)'
    bodyTag.style.overflowY ='hidden'
    bodyTag.style.animation = 'fadeIn 1 1s ease-out'

    for (let i = 0; i < 9; i++) {
      const lightDiv = document.createElement('div')
      lightDiv.classList.add('light')
      lightDiv.classList.add('behind-app')
      lightDiv.classList.add(`x${i}`)
      
      backgroundDiv.appendChild(lightDiv)
    }
    
  },
  gameActive_multiplayer: () => {},
  matchFound() {
    backgroundDiv.childNodes.forEach((child) => {
      backgroundDiv.removeChild(child)
    })

    const overlayDiv = document.createElement('div')
    overlayDiv.classList.add('behind-app')
    overlayDiv.style.position = 'fixed'
    overlayDiv.style.top = '0'
    overlayDiv.style.margin = '0'
    overlayDiv.style.backgroundColor = 'black'
    overlayDiv.style.height = '100vh'
    overlayDiv.style.width = '100vw'
    overlayDiv.style.opacity = '1'
    overlayDiv.style.background = 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(1, 0, 120, .7), rgba(0, 0, 0, 0.7))'

    backgroundDiv.appendChild(overlayDiv)

  },
  multiplayerGameLoading() {
    this.matchFound()
  },
  menu_main: () => {
    backgroundDiv.childNodes.forEach((child) => {
      backgroundDiv.removeChild(child)
    })

    const blocksDiv = document.createElement('div')
    const overlayDiv = document.createElement('div')
    const overlayDiv2 = document.createElement('div')
    blocksDiv.setAttribute('id', 'blocks-menuscreen')
    overlayDiv.setAttribute('id', 'overlayDiv-menuscreen')
    overlayDiv2.setAttribute('id', 'overlayDiv2-menuscreen')

    backgroundDiv.appendChild(blocksDiv)
    blocksDiv.appendChild(overlayDiv)
    blocksDiv.appendChild(overlayDiv2)
    

    blocksDiv.classList.add('behind-app')
    overlayDiv.classList.add('behind-app')
    overlayDiv.classList.add('shine-bar-left-slow')
    overlayDiv2.classList.add('shine-bar-right-medium')

    
    overlayDiv.style.position = 'fixed'
    overlayDiv.style.top = '0'
    overlayDiv.style.margin = '0'
    overlayDiv.style.backgroundColor = 'black'
    overlayDiv.style.height = '100vh'
    overlayDiv.style.width = '100vw'
    overlayDiv.style.opacity = '1'
    overlayDiv.style.background = 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(1, 0, 120, .7), rgba(0, 0, 0, 0.7))'

    
    blocksDiv.style.position = 'fixed'
    blocksDiv.style.top = '0'
    blocksDiv.style.background = 'url("assets/images/title-background.jpg") repeat 0 0'
    blocksDiv.style.width = '100vw'
    blocksDiv.style.margin = '0'
    blocksDiv.style.height = '100vh'
    blocksDiv.style.margin = '0';
    blocksDiv.style.padding = '0';
    blocksDiv.style.color = '#999';
    blocksDiv.style.font = '400 16px/1.5 exo, ubuntu, "segoe ui", helvetica, arial, sans-serif'
    blocksDiv.style.textAlign = 'center';
    blocksDiv.style.filter = 'brightness(50%)'
    
    /* img size is 50x50 */
    
    blocksDiv.style.backgroundSize = '50px'
    blocksDiv.style.backgroundPosition = ''
    blocksDiv.style.animation = 'bg-scrolling-reverse 3s infinite'
    blocksDiv.style.animationTimingFunction = 'linear'
  },

  menu_multiplayer: () => {
    const overlayDiv = document.getElementById('overlayDiv-menuscreen')
    if (!overlayDiv) return
    overlayDiv.style.background = 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(203, 149, 43, 0.7), rgba(0, 0, 0, 0.7))'
  },
  
  menu_singleplayer: () => {
    const overlayDiv = document.getElementById('overlayDiv-menuscreen')
    if (!overlayDiv) return
    overlayDiv.style.background = 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 84, 14, 0.7), rgba(0, 0, 0, 0.7))'
  },
  
  menu_singleplayer_options: () => "#252525",
  menu_singleplayer_highscore: () => "#252525",
  menu_singleplayer_help: () => "#252525",
  highScore: () => "#252525",
  help: () => "#252525",
  loadGame_singleplayer: () => "black",
  loadGame_multiplayer: () => "black"
}

const activate = (backgroundColor: string) => {
  console.log('right here')
  const htmlTag = document.querySelector('html')
  htmlTag.style.background = backgroundColor
  htmlTag.style.backgroundPosition = 'center'
}

const getBackgrounds = () => {
  return backgrounds
}

export { getBackgrounds }

// bodyTag.style.backgroundPosition = 'center'
// bodyTag.style.background = 'url("https://img.freepik.com/free-photo/cool-geometric-triangular-figure-neon-laser-light-great-backgrounds_181624-11068.jpg?w=2000&t=st=1668228722~exp=1668229322~hmac=1e4c1bc515bd4d2d6c9146bb3d43b26bc08bc676904b90c0e8c9f24b026de6ea") repeat 0 0'
// bodyTag.style.background = 'url("https://img.freepik.com/free-photo/cosmic-background-with-colorful-laser-lights_181624-26496.jpg?w=2000&t=st=1668447035~exp=1668447635~hmac=e4d8f30a66b1a86dcbf1bc67b5861a51d5b7fa4e2476e173aa8b9dcb26cd45f3") repeat 0 0'