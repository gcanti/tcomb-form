var gulp =  require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default', ['lint', 'docs'], function() {

});

// ------------------------------------
// lint
// ------------------------------------

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// ------------------------------------
// builds the docs
// ------------------------------------
gulp.task('docs', ['guide', 'demo:bootstrap', 'demo:gridforms', 'demo:ionic', 'playground']);

gulp.task('guide', function () {

  browserify('./docs/guide/src.js', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./docs/guide'));

});

gulp.task('demo:bootstrap', function () {

  browserify('./docs/demo/bootstrap/src.js', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./docs/demo/bootstrap'));

});

gulp.task('demo:gridforms', function () {

  browserify('./docs/demo/gridforms/src.js', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./docs/demo/gridforms'));

});

gulp.task('demo:ionic', function () {

  browserify('./docs/demo/ionic/src.js', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./docs/demo/ionic'));

});

gulp.task('playground', function () {

  browserify('./docs/playground/src.js', {
    transform: [reactify],
    detectGlobals: false
  })
  .external('react')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./docs/playground'));

});

