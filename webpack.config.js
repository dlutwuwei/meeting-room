const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const I18nPlugin = require("i18n-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const path = require('path')

const isDev = process.env.NODE_ENV != 'production'

var languages = {
	"en": require('./src/locale/en.json'),
	"cn": require("./src/locale/cn.json")
};

const mockserver = "http://mt.ig66.com"
module.exports = Object.keys(languages).map(lan => {
  return {
    entry: {
        lib: [ 'react', 'react-dom', 'babel-polyfill' ],
        app: ['./src/app.js'],
        board: ['./src/board.js'],
        admin: ['./src/admin.js']
    },
    output: {
        publicPath: isDev ? '/' : '/static/',
        path: path.join(__dirname, 'dist'),
        filename: isDev ? `js/[name]-${lan}.js` : `js/[name]-${lan}-[hash:6].js`
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
          '/api/*': {
              target:  `${mockserver}`,
              changeOrigin: true,
              bypass: function(req, res, proxyOptions) {
                console.log(req.url)
                if (req.headers.accept.indexOf('html') !== -1) {
                  if(req.url.startsWith('/board')) {
                    return '/index-board.html';
                  } else if (req.url.startsWith('/admin')) {
                    return '/index-admin.html';
                  }
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
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 10000,
                    name: 'iconfont/[name].[hash:8].[ext]',
                  }
                },
                {
                  loader: 'css-loader',
                  options: {
                      modules: true,
                      localIdentName: '[name]_[local]_[hash:base64:5]',
                  }
                },{
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true,
                    plugins: function () {
                      return [
                        require('autoprefixer')({
                          browsers: ['iOS >= 7', 'android >= 4', 'ie >= 9'],
                        }),
                      ];
                    },
                  },
                }
              ]
            })
          },
          {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
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
            title: '会议室预定',
            inject: true
        }),
        new HtmlWebpackPlugin({
          template: 'public/index.html',
          filename: 'index-board.html',
          chunks: [ 'lib', 'board'],
          title: '会议室看板',
          inject: true
        }),
        new HtmlWebpackPlugin({
          template: 'public/index.html',
          filename: 'index-admin.html',
          title: '会议室管理',
          chunks: [ 'lib', 'admin'],
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
        modules: [ path.resolve(__dirname, 'src/'), 'node_modules']
    }
  };
});