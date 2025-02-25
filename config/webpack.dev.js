const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry:'./src/main.js',
  output: {
    path: undefined,
    filename: 'static/js/main.js',
  },
  module:{
    rules:[
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/, //排除node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,'css-loader'],

      },
      {
        test: /\.jp?eg|png|gif$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[hash:10][ext][query]',
        }
      }
    ]
  },
  plugins:[
    new ESLintPlugin(
      {
        fix: true,
        extensions: ['js', 'jsx', 'vue'],
        context: path.resolve(__dirname, '../src'),
      }
    ),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin()
  ],
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
  }
}