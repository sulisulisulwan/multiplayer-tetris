/**
 * BUILDS ALL BUILD FILES: /electronBuild /multibuild/** /*
 * IN BROWSER DIST FOLDERS THIS ALSO COPIES ALL ASSETS
 * 
 * RUN THIS AT THE BEGINNING OF ALL DEVELOPMENT SESSIONS
 */


import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import path from "path"
import { fileURLToPath } from "url"
import nodeExternals from "webpack-node-externals"
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// COMPOSE ELECTRONG WEBPACK CONFIG

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

// COMPOSE REACT WEBPACK CONFIG

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

const copyPatterns = users.reduce((allCopyPatterns, currUser) => {
  const css = {
    from: path.resolve(__dirname, `../src/assets/css/*`),
    to: `${currUser}/[name][ext]`,
    force: false,
  }
  const audio = {
    from: path.resolve(__dirname, `../src/assets/sound/*`),
    to: `${currUser}/assets/sound/[name][ext]`,
    force: false,
  }
  const images = {
    from: path.resolve(__dirname, `../src/assets/images/*`),
    to: `${currUser}/assets/images/[name][ext]`,
    force: false,
  }
  allCopyPatterns.push(css, audio, images)
  return allCopyPatterns
}, [])

const htmlPlugins = users.reduce((allHtmlPlugins, username) => {
  allHtmlPlugins.push(
    new HtmlWebpackPlugin({
      hash: true,
      title: "electronTest React App",
      header: "electronTest React App",
      metaDesc: "electronTest React App",
      template: "./src/index.html",
      filename: `${username}/index.html`,
      publicPath: path.resolve(__dirname, `../multibuild`),
      inject: "body"
    })
  )

  return allHtmlPlugins
}, [])

const reactConfig = {
  target: "node",
  entry: entryPoints,
  plugins: [
    ...htmlPlugins,
    new CopyPlugin({
      patterns: copyPatterns
    })
  ],
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
  watch: false,
  devtool: 'eval',
  mode: "development",
  output: {
    clean: true,
    path: path.resolve(__dirname, '../multibuild'),
    publicPath: path.resolve(__dirname, '../multibuild'),
    filename: "[name].cjs",
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"]
  },
}


// EXECUTE WEBPACK

webpack(electronConfig, (err, stats) => {
  if (err) {
    console.log(err)
    console.error(err)
    return
  }
  console.log(stats.toString({ colors: true }))

  webpack(reactConfig, (err, stats) => {
    if (err) {
      console.log(err)
      console.error(err)
      return
    }
    console.log(stats.toString({ colors: true }))
  })
  
  
  
})


