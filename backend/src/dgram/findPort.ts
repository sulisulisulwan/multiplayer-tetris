import chalk from 'chalk'
import * as Dgram from 'dgram'

export const findPort = (startPort: number): Promise<number> => {

  return new Promise((resolve, reject) => {
    const testServer = Dgram.createSocket('udp4')
    console.log(chalk.yellow('Checking port ') + startPort + chalk.yellow(' for open port'))

    testServer.on('error', async (e) => {
      if ((e as any).code === 'EADDRINUSE') {
        console.log(chalk.yellow('Port ') + startPort + chalk.yellow(' is in use.'))
        return resolve(findPort(startPort + 1))
      }
      reject(e)
    })

    testServer.bind(startPort, () => {
      console.log('Available port: ', chalk.yellow(startPort))
      testServer.close(() => {
        resolve(startPort)
      })
    })
   
  })
}