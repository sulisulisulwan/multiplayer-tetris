/**
 * BUILDS ELECTRON BUILD FILES AND THEN WATCHES SRC FILES ASSOCIATED WITH THIS BUILD, BUILDING WHEN CHANGES ARE MADE
 */

import path from "path"
import { fileURLToPath } from "url"
import nodeExternals from "webpack-node-externals"
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const electronConfig = {
  target: "node",
  entry: {
    main: path.resolve(__dirname, `../src/electron/index.ts`),
    'preload/preload': path.resolve(__dirname, `../src/electron/preload.ts`)
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  mode: "development",
  output: {
    clean: true,
    filename: "[name].cjs",
    path: path.resolve(__dirname, '../electronBuild'),
    publicPath: path.resolve(__dirname, '../electronBuild'),

  },
  watch: true,
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"]
  },
  externalsPresets: { node: true },   // <-- here
  externals: [nodeExternals()],   
}


webpack(electronConfig, (err, stats) => {
  if (err) {
    console.log(err)
    console.error(err)
    return
  }
  console.log(stats.toString({ colors: true }))
})


