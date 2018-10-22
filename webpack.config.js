const path = require("path")

module.exports = {
  entry: {
    bundle: "./src/index.js",
    chapter_06_worker: "./src/workers/chapter_06_worker.js",
    chapter_07_worker: "./src/workers/chapter_07_worker.js",
    chapter_08_worker: "./src/workers/chapter_08_worker.js",
    chapter_09_worker: "./src/workers/chapter_09_worker.js",
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
        exclude: [
          /node_modules/
        ],
        use: [
          { loader: "babel-loader" }
        ]
      }
    ]
  }
}
