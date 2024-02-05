const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    content: './content.js',
    background: './background.js',
    popup: './popup.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        './manifest.json',
        './popup.*',
        './images/**/*',
        './_locales/**/*',
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new HtmlMinimizerPlugin(),
      new JsonMinimizerPlugin(),
    ],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
};
