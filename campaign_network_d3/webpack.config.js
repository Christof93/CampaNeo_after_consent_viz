const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
      fallback: {
        'stream': require.resolve('stream-browserify'),
        'util': require.resolve('util/'),
        'crypto': false
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      sourceMapFilename: '[name].js.map',
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, path.join('src', 'index.html')),
      }),
      new CopyPlugin({
        patterns: [
          { from: '../SampleCampaign.json' },
          { from: '../icons' },
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
        {
          test: /\.svg$/,
          use: 'raw-loader',
        }
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
      port: 3000,
      overlay: true,
      stats: 'minimal',
      host: '0.0.0.0',
    }
  }
}
