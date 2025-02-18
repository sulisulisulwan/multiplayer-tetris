/**
 * BUILDS ONLY REACT CJS FILES IN ALL DIST FILES: /electronBuild /multibuild/** /*
 */

import webpack from 'webpack'
import path from 'path'
import url from 'url'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const users = [
  'sulwaaan',
  'berry',
  'jenks',
  'buttstuff6969',
  'seclusion',
  'glitch',
  'concernedSquirrel'
]

const entryPoints = users.reduce((allEntryPoints, currUser) => {
  const entryPath = path.resolve(__dirname, `../src/react/multibuild/${currUser}.tsx` )
  const outputPath = `${currUser}/cjs/main` 
  allEntryPoints[outputPath] = entryPath
  return allEntryPoints
},{})


const reactConfig = {
  target: "node",
  entry: entryPoints,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
      },
    ],
  },
  watch: true,
  devtool: 'eval',
  mode: "development",
  output: {
    clean: false,
    path: path.resolve(__dirname, `../multibuild`),
    publicPath: path.resolve(__dirname, '../multibuild'),
    filename: "[name].cjs",
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"]
  },
}


webpack(reactConfig, (err, stats) => {
  if (err) {
    console.log(err)
    console.error(err)
    return
  }
  console.log(stats.toString({ colors: true }))
})
