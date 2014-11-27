var gulp =  require('gulp');
var react = require('gulp-react');
var header = require('gulp-header');
var browserify = require('browserify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');

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
  src: ['src/**/*.jsx'],
  playground: ['playground/**/*.jsx'],
  examples:  ['examples/**/*.jsx']
};
gulp.task('watch', ['default'], function() {
  gulp.watch(paths.src, ['default']);
  gulp.watch(paths.playground, ['playground']);
  gulp.watch(paths.examples, ['examples']);
});

// ------------------------------------
// default (main task for releases)
// ------------------------------------
gulp.task('default', ['src', 'examples', 'playground']);

gulp.task('src', function(){
  return gulp.src('src/index.jsx')
    .pipe(react())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('.'));
});

gulp.task('playground', function(){
  browserify('./playground/playground.jsx', {
    transform: [reactify],
    detectGlobals: true
  })
  .bundle()
  .pipe(source('playground/playground.jsx'))
  .pipe(rename('playground.js'))
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('playground'));
});

gulp.task('examples', function(){
  browserify('./examples/basic/index.jsx', {
    transform: [reactify],
    detectGlobals: true
  })
  .bundle()
  .pipe(source('examples/basic/index.jsx'))
  .pipe(rename('index.js'))
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('examples/basic'));
});
