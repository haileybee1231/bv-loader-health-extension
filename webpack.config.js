const path = require('path');

const ROOT_PATH = path.resolve(__dirname);

const environment = process.env.NODE_ENV || 'production';

module.exports = {
  mode: environment,
  watch: true,
  context: __dirname + '/src',
  entry: {
    content: __dirname + '/public/content',
    popup: __dirname + '/src/popup',
    background: __dirname + '/public/background',
  },
  output: {
    path: ROOT_PATH + '/public/dist',
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: []
}