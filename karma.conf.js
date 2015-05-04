module.exports = function (config) {
  config.set({
    browserNoActivityTimeout: 30000,
    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],
    singleRun: true,
    frameworks: [ 'tap' ],
    files: [
      'test/browser.js'
    ],
    reporters: [ 'dots' ]
  });
};