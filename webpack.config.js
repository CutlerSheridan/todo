const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: "inline-source-map",
  devServer: {
      client: {
          overlay: {
          warnings: false,
          errors: true
      },
    },
      static: "./dist",
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};