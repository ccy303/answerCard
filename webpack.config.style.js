const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
console.log(123)
module.exports = (env) => {
  return {
    mode: env,
    entry: output + '/' + 'index.scss',
    output: {
      filename: 'pack.css',
      path: path.resolve(__dirname, 'packStyle'),
    },
    // plugins: [
    //   new MiniCssExtractPlugin({
    //     filename: 'index.css',
    //     allChunks: true,
    //   })
    // ],
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
      ]
    },
  }
};
