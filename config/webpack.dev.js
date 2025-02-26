const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require('os');
const threads = os.cpus().length;
module.exports = {
  entry:'./src/main.js',
  output: {
    path: undefined,
    filename: 'static/js/main.js',
  },
  module:{
    rules:[
      {
        oneOf: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/, //排除node_modules
            // include: path.resolve(__dirname, '../src')
            use: [
              {
              loader: 'babel-loader',
              options: {
                // presets: ['@babel/preset-env'],
                cacheDirectory: true, //开启babel缓存
                cacheCompression: false, //关闭缓存文件压缩
                plugins: ['@babel/plugin-transform-runtime'], //减少代码体积
              },
              },
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  workers: threads, // 开启几个 worker
                }
              }
            ]
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
      }
    ]
  },
  plugins:[
    new ESLintPlugin(
      {
        fix: true,
        extensions: ['js', 'jsx', 'vue'],
        context: path.resolve(__dirname, '../src'),
        exclude: 'node_modules',
        cache: true,
        cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        threads, //开启多进程
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
  },
  devtool: 'cheap-module-source-map',
}