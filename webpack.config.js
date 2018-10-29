const webpack = require("webpack")
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
  },

  plugins: [
    new webpack.ProvidePlugin(modelMapping())
  ]
}

function modelMapping() {
  const modelPath = path.resolve(__dirname, "src", "models")
  const modelNames = [
    "Camera",
    "Canvas",
    "Checkers",
    "Color",
    "Gradient",
    "Intersection",
    "Intersections",
    "Material",
    "Matrix",
    "Pattern",
    "Plane",
    "Point",
    "PointLight",
    "Position",
    "Ray",
    "Ring",
    "Shape",
    "Sphere",
    "Stripe",
    "Tuple",
    "Vector",
    "World"
  ]

  const result = {}
  modelNames.forEach(modelName => {
    result[modelName] = [modelPath, modelName]
  })
  return result
}
