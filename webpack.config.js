const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const I18nPlugin = require("i18n-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const path = require('path')

const isDev = process.env.NODE_ENV != 'production'

var languages = {
	"en": require('./src/locale/en.js'),
	"cn": require("./src/locale/cn.js")
};

module.exports = Object.keys(languages).map(lan => {
  return {
    entry: {
        lib: [ 'react', 'react-dom', 'babel-polyfill' ],
        app: ['./src/app.js'],
        board: ['./src/board.js']
    },
    output: {
        publicPath: isDev ? '/' : '/static/',
        path: path.join(__dirname, 'dist'),
        filename: `js/[name]-${lan}-[chunkhash:6].js`
    },
    devServer: {
        hot: false,
        inline: false,
        host: "0.0.0.0",
        port: 8001,
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        proxy: {
          '/api': {
              target: 'https://8e2a6ecd-1216-48bd-9bc2-77f6b24e1485.mock.pstmn.io/',
              changeOrigin: true,
              bypass: function(req, res, proxyOptions) {
                if (req.headers.accept.indexOf('html') !== -1) {
                  console.log('Skipping proxy for browser request.');
                  return '/index.html';
                }
              }
          }
        }
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
          },
          {
            test: /\.(svg|ttf|woff|eot)|\.otf/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'iconfont/[name].[hash:8].[ext]',
                }
              }
            ]
          },
          {
            test: /\.(jpe?g|gif|png|svg)$/i,
            use: [
              {
                loader: 'image-webpack-loader',
                options: {
                  byPassOnDebug: true,
                  mozjpeg: { progressive: true },
                  optipng: { optimizationLevel: 3 },
                  pngquant: { quality: '65-80' },
                },
              },
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'img/[name].[ext]',
                },
              },
            ],
          },
          {
            test: /\.css/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [{
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                }
              },{
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      require('autoprefixer')({
                        browsers: ['iOS >= 7', 'android >= 4', 'ie >= 9'],
                      }),
                    ];
                  },
                },
              }]
            })
          },
          {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', {
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      require('autoprefixer')({
                        browsers: ['iOS >= 7', 'android >= 4', 'ie >= 9'],
                      }),
                    ];
                  },
                },
              }, 'resolve-url-loader', 'less-loader']
            })
          },
        ],
      },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'lib' }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['lib', 'app'],
            inject: true
        }),
        new HtmlWebpackPlugin({
          template: 'public/index.html',
          filename: 'board.html',
          chunks: [ 'lib', 'board'],
          inject: true
      }),
        new ExtractTextPlugin({
            filename: 'css/app-[contenthash:6].css',
            allChunks: true
        }),
        new I18nPlugin(
          languages['cn']
        )
    ].concat(!isDev ? [
        new webpack.HashedModuleIdsPlugin(),
        new UglifyJSPlugin({
          test: /\.js($|\?)/i,
          uglifyOptions: {
            compress: {
              warnings: false
            },
            minimize: true
          }
        })
    ] : [ ]),
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          '~': path.resolve(__dirname, './src/'),
          img: path.resolve(__dirname, './src/img'),
          app: path.resolve(__dirname, './src/app'),
          utils: path.resolve(__dirname, './src/utils'),
          components: path.resolve(__dirname, './src/components'),
        }
    }
  };
});