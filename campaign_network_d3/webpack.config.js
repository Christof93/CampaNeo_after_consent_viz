const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = (env, argv) => {
  return {
    mode: argv.mode || 'development',
    entry: {
      main: path.resolve(__dirname, path.join('src', 'index.ts')),
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      sourceMapFilename: '[name].js.map',
      publicPath: '/dist/'
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, path.join('src', 'index.html')),
      }),
      new CopyPlugin({
        patterns: [
          { from: "../SampleCampaign.json" },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
      port: 3000,
      overlay: true,
      stats: 'minimal'
    }
  }
}

