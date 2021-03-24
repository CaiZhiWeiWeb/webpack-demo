//将index.html打包并引入js
const HtmlWebpackPlugin = require('html-webpack-plugin')
//打包分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');
const path = require('path');
// const devMode = process.env.NODE_ENV !== 'production'//不需要cross-env
const resolve = (dir) => path.join(__dirname, dir);

let devServer = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 8081,
  writeToDisk: false//true为开启磁盘
}

module.exports = (env) => {
  const devMode = env.NODE_ENV !== 'production';
  const include = path.resolve(__dirname, 'src');

  return {
    mode: env.NODE_ENV,
    // entry: path.join(__dirname, './src/main.js'),
    entry: {
      app: path.join(__dirname, './src/main.js'),
      adminApp: path.join(__dirname, './src/adminApp.js')
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './js/[name]-[fullhash:8].bundle.js',//name为entry入口的名字，不写默认为文件名
      clean: true, //清除/dist
      // publicPath: '/main/' //这个为html引入资源的相对路径
    },
    module: {
      rules: [{
        test: /\.(css|scss)$/,
        include,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.(js|jsx)$/,
        include,
        use: 'babel-loader'
      }, {
        test: /\.(svg|png|jpe?g|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images',
            esModule: false,
            limit: 8 * 1024,
            name: '[name].[hash:8].[ext]',
          },
        }
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }, {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            esModule: false
          }
        }
      }]
    },
    resolve: {
      //可省略的格式
      extensions: ['.js', '.scss', '.css'],
      alias: {
        'src': resolve('src'),
        'assets': resolve('src/assets')
      }
    },
    devServer,
    plugins: [
      //进度条
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: './css/[name].[chunkhash:8].css',
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({ template: './public/index.html' })//打包到js的同目录并引入js
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    performance: {
      maxEntrypointSize: 400000,
      maxAssetSize: 100000,
    },
    // externals: {
    //   jquery: 'jQuery',
    // },
  }
}
