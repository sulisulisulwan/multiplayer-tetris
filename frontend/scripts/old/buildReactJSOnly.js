import webpack from 'webpack'
import { getReactBrowserAppJSBundleOnly } from '../webpack-config-react.js'
const name = process.argv[2]
const multibuild = process.argv[3]
const watch = process.argv[4] === 'false' ? false : process.argv[4] === 'true' ? true : false
const reactOnlyJSConfig = getReactBrowserAppJSBundleOnly(name, multibuild, watch)

webpack(reactOnlyJSConfig, (err, stats) => {
  if (err) {
    console.log(err)
    console.error(err)
    return
  }
  
  console.log(stats.toString({ colors: true }))
})
