import chalk from 'chalk'
import { spawn } from 'child_process'
import { watch } from 'fs/promises'
import * as url from 'url'
import * as path from 'path'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const watchDirectory = path.resolve(__dirname, './src/');

class DevServer {

  constructor(directoryToBuildMap) {
    this.electronExeProcess = null
    this.directoryToBuildMap = directoryToBuildMap
    this.defaultBuildTasks = ['buildElectron', 'buildReact', 'runApplication']
    this.currBuildTasks = {
      killApp: true,
      tasks: this.defaultBuildTasks
    }
    this.taskIndex = 0
  }

  init() {
    this.runTasks()
    this.executeWatcher()
  } 

  runTasks() {    
    this.taskIndex = 0
    this.nextTask()
  }

   nextTask() {
    const taskIsArray = Array.isArray(this.currBuildTasks.tasks)
    const singleTaskAndDone = !taskIsArray && this.taskIndex >= 1 
    const arrayOfTasksAndDone = taskIsArray && this.taskIndex >= this.currBuildTasks.tasks.length

    if (singleTaskAndDone || arrayOfTasksAndDone ) {
      console.log('ALL TASKS DONE')
      return
    }

    const next = taskIsArray ? this[this.currBuildTasks.tasks[this.taskIndex]].bind(this) : this[this.currBuildTasks.tasks].bind(this)
    this.taskIndex++
    next()
  }

  executeWatcher() {
    (async()=> {
      try {
        console.log(chalk('Watching directory: ', watchDirectory))
        const watcher = watch(watchDirectory, { recursive: true })
        
        for await(const event of watcher) {
          if (['change', 'rename'].includes(event.eventType)) {
            const directories = event.filename.split('/')
            this.currBuildTasks = this.directoryToBuildMap[directories[0]] || this.defaultBuildTasks
            if (this.electronExeProcess && this.currBuildTasks.killApp) {
              this.electronExeProcess.kill();
            }
            this.runTasks()
          }
        }
      } catch(e) {
        console.error(e)
      }
    })()
  }

  buildElectron() {

    console.log(chalk.cyan(`
    /*******************\\
      BUILDING ELECTRON
    \\*******************/     
    
      `))

    const buildElectronScript = path.resolve(__dirname, './scripts/buildElectron.js')    
    const buildElectronProcess = spawn('node',[buildElectronScript], { cwd: __dirname, env: { ...process.env, FORCE_COLOR: 'true' }})

    buildElectronProcess.stderr.on('error', (error) => {
      console.error(error)
    })
    buildElectronProcess.stdout.on('data', (data) => console.log(data.toString()))
    buildElectronProcess.on('exit', this.nextTask.bind(this))
  }

  buildReact() {
    console.log(chalk.cyan(`
      /********************\\
          BUILDING REACT
      \\********************/     
      
        `))
    const username = process.argv[2]
    const multibuild = process.argv[3]
    const buildReactScript = path.resolve(__dirname, './scripts/buildReact.js')
    const buildReactProcess = spawn('node', [buildReactScript, username, multibuild, false], { cwd: __dirname, env: { ...process.env, FORCE_COLOR: 'true' }})

    buildReactProcess.on('error', (e) => {
      console.error(e)
    })
    buildReactProcess.stdout.on('data', data => console.log(data.toString()))
    buildReactProcess.on('exit', this.nextTask.bind(this))
  }

  buildReactOnlyJS() {
    console.log(chalk.cyan(`
      /****************************\\
          BUILDING REACT ONLY JS
      \\***************************/     
      
        `))

    console.log('bypassing... check code to cancel this behaviour')
    return
    const username = process.argv[2]
    const multibuild = process.argv[3]
    const buildReactScript = path.resolve(__dirname, './scripts/buildReactJSOnly.js')
    const buildReactProcess = spawn('node', [buildReactScript, username, multibuild, false], { cwd: __dirname, env: { ...process.env, FORCE_COLOR: 'true' }})

    buildReactProcess.on('error', (e) => {
      console.error(e)
    })
    buildReactProcess.stdout.on('data', data => console.log(data.toString()))
    buildReactProcess.on('exit', this.nextTask.bind(this)) 
  }

  runApplication() {
    console.log(chalk.green(`
      /***********************\\
      ( STARTING ELECTRON APP )
      \\***********************/     
      
        `))
    this.electronExeProcess = spawn('npm', ['run','start:sulwaaan'], { env: { ...process.env, FORCE_COLOR: 'true' }})
    this.electronExeProcess.stdout.on('data', data => console.log(data.toString()))
    this.electronExeProcess.on('error', (e) => { console.log(e) })
    this.electronExeProcess.on('exit', () => { 
      console.log(chalk.red(`
      /**********************\\
      ( KILLING ELECTRON APP )
      \\**********************/      
      `))
    })
  }

}

const directoryToBuildMap = {
  electron: {
    killApp: true,
    tasks: ['buildElectron', 'runApplication']
  },
  react: {
    killApp: false,
    tasks: ['buildReactOnlyJS']
  },
  reactFull: {
    killApp: false,
    tasks: ['buildReact']
  },
  assets:  {
    killApp: false,
    tasks: ['buildReact']
  },
}

const test = new DevServer(directoryToBuildMap)

test.init()
