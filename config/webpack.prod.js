const path = require('path');
const os = require('os');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const threads = os.cpus().length;
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// 定义一个名为 getStyleLoader 的函数，接受一个参数 pre
function getStyleLoader(pre){
  // 返回一个数组，包含多个 loader 配置
  return [
    // 使用 MiniCssExtractPlugin.loader 提取 CSS 到单独的文件
    MiniCssExtractPlugin.loader,
    // 使用 css-loader 解析 CSS 文件
    'css-loader',
    // 使用 postcss-loader 进行 CSS 处理
    {
      loader: 'postcss-loader',
      // 配置 postcss-loader 的选项
      options: {
        // 配置 postcss 的选项
        postcssOptions: {
          // 使用 postcss-preset-env 插件，自动添加浏览器前缀等
          plugins: [
            'postcss-preset-env'
          ]
        }
      }
    },
    // 将传入的 pre 参数作为最后一个 loader
    pre
  // 使用 filter(Boolean) 过滤掉数组中的 false、null、0、""、undefined 和 NaN
  ].filter(Boolean)
}

module.exports = {
  entry:'./src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    clean: true,
    filename: 'static/js/main.js',
  },
  module:{
    rules:[
      {
        oneOf: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/, //排除node_modules
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
            use: getStyleLoader(),
          },
          {
            test: /\.less$/,
            use: getStyleLoader("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader"),
          },
          {
            test: /\.jp?eg|png|gif$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片自动转base64
              }
            },
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
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    }),
   
  ],
  optimization: { // 优化配置对象
    minimizer: [ // 优化插件列表，用于压缩和优化资源
      new CssMinimizerPlugin(), // 实例化CssMinimizerPlugin插件，用于压缩CSS文件
      new TerserWebpackPlugin({ // 实例化TerserWebpackPlugin插件，用于压缩JavaScript文件
        parallel: threads, // 开启多进程压缩，提高压缩效率，threads为进程数
      }),
       // 创建一个新的 ImageMinimizerPlugin 实例
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminGenerate, // 使用 imagemin 作为图片压缩工具
        // 配置图片优化选项
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            ['svgo', {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'removeEmptyAttrs',
                  active: false,
                },
              ],
            }],
          ],
        },
      }
    }),
    ]
  },
  mode: 'production',
  devtool: 'source-map',
}