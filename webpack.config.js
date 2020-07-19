const webpack = require('webpack');

module.exports = {
  entry: {
    app: "./examples/Router/index.js"
  },
  stats: 'verbose',
  context: __dirname,
  output: {
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    disableHostCheck: true,
    host: 'localhost',
    hot: true,
    inline: true,
    port: 5050,
    stats: 'errors-warnings'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("development"),
      }
    })
  ]
};
