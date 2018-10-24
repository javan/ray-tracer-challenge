const path = require("path")

module.exports = {
  entry: {
    bundle: "./src/index.js"
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public")
  },

  mode: "production",
  devtool: "source-map",

  module: {
    rules: [
      {
           test: /\.js$/,
        exclude: /node_modules/,
            use: "babel-loader",
      },
      {
           test: /\_worker\.js$/,
        exclude: /node_modules/,
            use: "worker-loader",
      }
    ]
  }
}
