var webpack = require('webpack') // eslint-disable-line
var path = require('path') // eslint-disable-line

module.exports = function getConfig(config) {
  config.set({
    browserNoActivityTimeout: 30000,
    // TODO: This should include "Firefox" for CI. It is currently turned off because
    //       of https://github.com/travis-ci/travis-ci/issues/8242 When this issue is
    //       resolved, this should be updated to include firefox
    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Chrome' : 'Chrome'],
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
        preLoaders: [
          {
            test: /\.js$/,
            exclude: [
              path.resolve('src/'),
              path.resolve('node_modules/')
            ],
            loader: 'babel'
          },
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            loader: 'isparta'
          }
        ]
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
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type: 'text'
    }
  })
}
