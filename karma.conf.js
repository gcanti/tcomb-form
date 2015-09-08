module.exports = function (config) {
  config.set({
    browserNoActivityTimeout: 30000,
    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],
    singleRun: true,
    frameworks: ['browserify', 'tap'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': [ 'browserify' ]
    },
    reporters: ['dots']
  });
};
