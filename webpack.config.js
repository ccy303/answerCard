const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
module.exports = {
   entry: './src/index.ts',
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
         title: 'answerCard',
         template: './src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: "jquery",
         "window.jQuery": "jquery"
      })
   ],
   devtool: 'inline-source-map',
   devServer: {
      contentBase: './dist',
      hot: true,
      port: 2048
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
         },
         {
            test: /\.scss$/,
            use: [
               "style-loader",
               "css-loader",
               "sass-loader"
            ]
         },
         {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env']
               }
            }
         },
         {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
         }
      ]
   },
   resolve: {
      extensions: ['.tsx', '.ts', '.js']
   },
};