import * as path from 'path'
import ElectronApp from './ElectronApp'
import { watch } from 'fs/promises'
import * as chalk from 'chalk'

try {
  (async() => {
    const devTestUsernames = new Set([ 'sulwaaan', 'berry', 'jenks', 'buttstuff6969', 'glitch', 'seclusion', 'concerneSquirrel'])
    const isDev = process.argv.includes('-DEV')
    let username = null
    process.argv.some(arg => {
      if (devTestUsernames.has(arg)) {
        username = arg
        return true
      }
    })
      
    if (isDev) {
      const pathResolution = `../multibuild/${username}/index.html`
      const htmlPath = path.resolve(__dirname, pathResolution)
      const app: ElectronApp = new ElectronApp(htmlPath)
      app.init();
      
      (async () => {
        try {
          const distPath = app.getRootHtmlPath().substring(0, app.getRootHtmlPath().length - 10)
          const watcher = watch(distPath, {recursive: true});
          for await (const event of watcher) {

            if (['rename', 'change'].includes(event.eventType)) {
              console.log(chalk.yellow('\nDetected new build in: ') + distPath)
              await app.restart()
            }
          }
        } catch (err) {
          throw err;
        }
      })(); 
    }
  })()
} catch (e) {
  console.error(e)
}
