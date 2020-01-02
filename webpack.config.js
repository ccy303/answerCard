const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
module.exports = (env) => {
   return {
      mode: env,
      entry: './src/index.ts',
      output: {
         filename: 'index.js',
         path: path.resolve(__dirname, 'dist'),
         libraryExport: "default",
         library: "AnswerCard",
         libraryTarget: "umd",
         publicPath: '/'
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
         port: 2048,
         host: '192.168.6.94'
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
            },
            {
               test: /\.(png|svg|jpg|gif)$/,
               use: {
                  loader: 'url-loader',
                  options: {
                     limit: 100000,
                     outputPath: 'assets/'
                  },
               }
            },
         ]
      },
      resolve: {
         extensions: ['.tsx', '.ts', '.js']
      }
   }
};