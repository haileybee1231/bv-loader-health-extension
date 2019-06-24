const path = require('path');

const ROOT_PATH = path.resolve(__dirname);

const environment = process.env.NODE_ENV || 'production';

module.exports = {
  mode: environment,
  watch: true,
  context: __dirname + '/src',
  entry: {
    getBVScript: __dirname + '/src/scripts/getBVScript',
    popup: __dirname + '/src/scripts/popup',
    background: __dirname + '/src/scripts/background',
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
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
      }
    ],
  },
  plugins: []
}