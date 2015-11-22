var webpack = require('webpack') // eslint-disable-line

module.exports = function getConfig(config) {
  config.set({
    browserNoActivityTimeout: 30000,
    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],
    singleRun: true,
    frameworks: ['tap'],
    files: [
      'test/index.js'
    ],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    webpack: {
      node: {
        fs: 'empty'
      },
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        }]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['dots']
  })
}
