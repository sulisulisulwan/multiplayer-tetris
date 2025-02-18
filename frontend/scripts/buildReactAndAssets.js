import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import path from "path"
import { fileURLToPath } from "url"
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

const reactAndAssetsConfig = {
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
  watch: true,
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

webpack(reactAndAssetsConfig, (err, stats) => {
  if (err) {
    console.log(err)
    console.error(err)
    return
  }
  console.log(stats.toString({ colors: true }))
})

