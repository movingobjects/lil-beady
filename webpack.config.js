
const path                           = require('path');

const CopyWebpackPlugin              = require('copy-webpack-plugin'),
      HtmlWebpackPlugin              = require('html-webpack-plugin'),
      MiniCssExtractPlugin           = require('mini-css-extract-plugin'),
      HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {

  entry: {
    app: './src/entry.js'
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'resources/[name].bundle.js',
    publicPath: ''
  },

  module: {
    rules: [
      {
        test: /\.(jsx?)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/varyd-utils')
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
                'lodash',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties'
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
            loader: 'file-loader',
            options: {
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

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [ ],
      append: false
    }),
    new MiniCssExtractPlugin({
      filename: 'resources/styles/[name].css',
      chunkFilename: '[id].css'
    })
  ]

};
