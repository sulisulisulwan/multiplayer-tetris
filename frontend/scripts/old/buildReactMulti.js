import webpack from 'webpack'
import { getReactBrowserAppWebpackBuild } from '../webpack-config-react.js'

const usernames = [
  'sulwaaan',
  'berry',
  'buttstuff6969', 
  'jenks',
  'glitch',
  'concernedSquirrel',
  'seclusion'
]

usernames.forEach(username => {

  const reactWebpackConfig = getReactBrowserAppWebpackBuild(username, true)
  
  webpack(reactWebpackConfig, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(stats.toString({ colors: true }))
  })
})

