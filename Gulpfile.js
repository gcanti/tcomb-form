var gulp =  require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default', ['examples']);

// ------------------------------------
// builds the examples
// ------------------------------------
gulp.task('examples', function (){

  // bootstrap
  browserify('./examples/bootstrap/bootstrap.jsx', {
    transform: [reactify],
    detectGlobals: false
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

  // gridforms
  browserify('./examples/gridforms/gridforms.jsx', {
    transform: [reactify],
    detectGlobals: false
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

  // ionic
  browserify('./examples/ionic/ionic.jsx', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .on('error', function (err) {
    gutil.beep();
    console.log(String(err));
    this.end();
  })
  .pipe(source('./examples/ionic/ionic.jsx'))
  .pipe(rename('ionic.js'))
  .pipe(gulp.dest('./examples/ionic'));


});

// ------------------------------------
// watch
// ------------------------------------
var src = ['lib/**/*.js'];
var dev = src.concat('dev/**/*.jsx');
var examples = src.concat('examples/**/*.jsx');

gulp.task('watch', ['dev', 'examples'], function () {
  gulp.watch(dev, ['dev']);
  gulp.watch(examples, ['examples']);
});

// ------------------------------------
// lint
// ------------------------------------

gulp.task('lint', function() {
  return gulp.src('./lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// ------------------------------------
// development
// ------------------------------------
gulp.task('dev', function (){
  browserify('./dev/dev.jsx', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .on('error', function (err) {
    gutil.beep();
    console.log(String(err));
    this.end();
  })
  .pipe(source('dev/dev.jsx'))
  .pipe(rename('dev.js'))
  .pipe(gulp.dest('dev'));
});

