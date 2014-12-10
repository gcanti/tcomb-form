var gulp =  require('gulp');
var react = require('gulp-react');
var header = require('gulp-header');
var browserify = require('browserify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

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
var src = ['lib/**/*.js', 'lib/**/*.jsx'];
var dev = src.concat('dev/**/*.js');
var examples = src.concat('examples/**/*.jsx');
gulp.task('watch', ['dev', 'examples'], function () {
  gulp.watch(dev, ['dev']);
  gulp.watch(examples, ['examples']);
});

// ------------------------------------
// development
// ------------------------------------
gulp.task('dev', function (){
  browserify('./dev/index.js', {
    transform: [reactify],
    detectGlobals: true
  })
  .external('react')
  .bundle()
  .on('error', function (err) {
    gutil.beep();
    console.log(String(err));
    this.end();
  })
  .pipe(source('dev/index.js'))
  .pipe(rename('bundle.js'))
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('dev'));
});

// ------------------------------------
// examples
// ------------------------------------
gulp.task('examples', function (){

  browserify('./examples/gridforms/gridforms.jsx', {
    transform: [reactify],
    detectGlobals: true
  })
  .external('react')
  .bundle()
  .on('error', function (err) {
    gutil.beep();
    console.log(String(err));
    this.end();
  })
  .pipe(source('./examples/gridforms/gridforms.jsx'))
  .pipe(rename('gridforms.js'))
  .pipe(gulp.dest('./examples/gridforms'));

  browserify('./examples/bootstrap/bootstrap.jsx', {
    transform: [reactify],
    detectGlobals: true
  })
  .external('react')
  .bundle()
  .on('error', function (err) {
    gutil.beep();
    console.log(String(err));
    this.end();
  })
  .pipe(source('./examples/bootstrap/bootstrap.jsx'))
  .pipe(rename('bootstrap.js'))
  .pipe(gulp.dest('./examples/bootstrap'));

});

// ------------------------------------
// lint task
// ------------------------------------

gulp.task('lint', function() {
  return gulp.src('./lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
