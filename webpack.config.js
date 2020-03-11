var path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/PhoneInput.js",
  output: {
    path: path.resolve("dist"),
    filename: "main.js",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: "url-loader"
        }
      }
    ]
  }
};
