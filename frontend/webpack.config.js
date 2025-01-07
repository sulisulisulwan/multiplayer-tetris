
import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import path from "path"
import { fileURLToPath } from "url"
// import nodeExternals from "webpack-node-externals"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  target: "node",
  entry: {
    main: __dirname + "/src/main.tsx",
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "electronTest React App",
      header: "electronTest React App",
      metaDesc: "electronTest React App",
      template: "./src/index.html",
      filename: "index.html",
      inject: "body"
    }),
    new CopyPlugin({
      patterns: [
        // CSS 
        {
          from: 'src/assets/css/*',
          to: '[name][ext]',
          force: false,
        },
        //AUDIO FILES
        {
          from: 'src/assets/sound/*',
          to: 'assets/sound/[name][ext]',
          force: false,
        },
        //IMAGE FILES
        {
          from: 'src/assets/images/*',
          to: 'assets/images/[name][ext]',
          force: false,
        },
      ]
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
  mode: "development",
  output: {
    clean: true,
    filename: "[name].cjs",
    path: path.resolve(__dirname, "dist"),
    publicPath: path.resolve(__dirname, "./dist/"),

  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"]
  },
	// externals: [nodeExternals()]
}


