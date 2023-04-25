const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  return {
    entry:'./src/index.js',
    output: {
      filename: 'index.bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    performance : {
      hints : false
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          chunks: 'all'
        }
      },
      minimize: argv.mode === 'development' ? false : true
    },
    devServer: {historyApiFallback: true},
    devtool : argv.mode === 'development' ? 'source-map' : 'source-map',
    module: {
      rules: [
        { test: /\.(ttf|eot|woff2|woff|png|gif|svg)$/,
            use: {
                loader: 'file-loader',
                options: { name: '[name].[ext]',
                  outputPath:'./assets/fonts/',
                  publicPath: './assets/fonts'
                }
            }
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    "@babel/env",
                    {
                      targets: {
                        chrome: "58"
                      },
                    },
                  ],
                  ["@babel/preset-react"]
                ],
                plugins: ["@babel/plugin-syntax-dynamic-import"]
              }
            }
          ]
        },
        { test: /\.(scss|sass|css)$/i,
          use:[
            {loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
            {loader: 'css-loader', 
              options: {
                sourceMap: true, 
                importLoaders: 1, 
                modules: true , 
                modules:{
                  localIdentName: "[local]",
                }
              }
            },
            {loader: 'resolve-url-loader',
              options: {
                root: __dirname
              }
            },
            {loader: 'sass-loader',
            options: {
              sourceMap: true
            }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: "./src/favicon.ico"
      }),
      new MiniCssExtractPlugin({
        filename: 'bundle.css',
      })
    ]
}};