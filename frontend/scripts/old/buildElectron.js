import { getElectronFullWebpackBuild } from "../webpack-config-electron.js";
import webpack from 'webpack'


webpack(getElectronFullWebpackBuild(false), (err, stats) => {
  if (err) {
    console.log(err)
    console.error(err)
    return
  }
  console.log(stats.toString({ colors: true }))
  resolve()
})


