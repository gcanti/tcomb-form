var gulp =  require('gulp');
var react = require('gulp-react');
var header = require('gulp-header');
var browserify = require('browserify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var path = require('path');

var pkg = require('./package.json');
var version = pkg.version;
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// ------------------------------------
// watch (main task for development)
// ------------------------------------
var paths = {
  jsx: ['src/**/*.jsx'],
};
gulp.task('watch', ['build'], function() {
  gulp.watch(paths.jsx, ['build']);
});

// ------------------------------------
// default (main task for releases)
// ------------------------------------
gulp.task('default', ['build', 'examples', 'playground']);

gulp.task('build', function(){
  return gulp.src('./src/index.jsx')
    .pipe(react())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('.'));
});

gulp.task('playground', function(){
  browserify('./playground/playground.jsx', {
    transform: [reactify],
    cache: {},
    packageCache: {},
    fullPaths: true
  })
  .bundle()
  .pipe(source(path.basename('./playground/playground.jsx')))
  .pipe(rename('playground.js'))
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('./playground'));
});

gulp.task('examples', function(){
  browserify('./examples/basic/index.jsx', {
    transform: [reactify],
    cache: {},
    packageCache: {},
    fullPaths: true
  })
  .bundle()
  .pipe(source(path.basename('./examples/basic/index.jsx')))
  .pipe(rename('index.js'))
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('./examples/basic'));
});
