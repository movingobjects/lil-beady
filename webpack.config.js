
const path    = require('path'),
      package = require('./package.json');

const CopyWebpackPlugin     = require('copy-webpack-plugin'),
      HtmlWebpackPlugin     = require('html-webpack-plugin'),
      MiniCssExtractPlugin  = require('mini-css-extract-plugin'),
      HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin'),
      DotEnvPlugin          = require('dotenv-webpack');

const isDev = (process.env.NODE_ENV !== 'production');

module.exports = {

  entry: {
    app: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'resources/[name].bundle.js',
    publicPath: ''
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.(jsx?)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
              ]
            }
          }
        ]
      },
      {
        test: /\.(html)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          isDev ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev
            }
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader',
              name: 'resources/images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp3|aif|aiff|wav)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/audio/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/video/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },

  plugins: [
    new DotEnvPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/static',
        to: './'
      },
      {
        from: `node_modules/react/umd/react.${isDev ? 'development' : 'production.min'}.js`,
        to: './resources/vendor/react/'
      },
      {
        from: `node_modules/react-dom/umd/react-dom.${isDev ? 'development' : 'production.min'}.js`,
        to: './resources/vendor/react/'
      }
    ]),
    new HtmlWebpackPlugin({
      template: './src/templates/index.ejs',
      filename: 'index.html',
      title: package.productName
    }),
    new HtmlWebpackTagsPlugin({
      tags: [
        `resources/vendor/react/react.${isDev ? 'development' : 'production.min'}.js`,
        `resources/vendor/react/react-dom.${isDev ? 'development' : 'production.min'}.js`
      ],
      append: false
    }),
    new MiniCssExtractPlugin({
      filename: 'resources/styles/[name].css',
      chunkFilename: '[id].css'
    })
  ]

};
