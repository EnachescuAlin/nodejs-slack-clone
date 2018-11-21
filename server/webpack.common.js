const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractPlugin = new ExtractTextPlugin({
  filename: 'css/style.css'
});

module.exports = {
  entry: {
    main: "./index.js"
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist/client/public'),
    publicPath: '/public/'
  },
  context: path.resolve(__dirname, '../client/src'),
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }]
    }, {
      test: /\.(jpg|png|gif|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './',
        }
      }]
    }, {
      test: /\.css$/,
      use: extractPlugin.extract({
        use: ["css-loader", "sass-loader", "postcss-loader"],
        fallback: 'style-loader'
      })
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: '../index.html',
      inject: true
    }),
    extractPlugin
  ]
}