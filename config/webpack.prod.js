const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

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
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    }),
    new CssMinimizerPlugin()
  ],
  mode: 'production',
}