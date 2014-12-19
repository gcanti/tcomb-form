var gulp =  require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// ------------------------------------
// watch
// ------------------------------------
var lib = ['lib/**/*.js'];
var docs = ['docs/**/src.js'];
var dev = ['dev/**/*.jsx'];

gulp.task('watch', ['dev', 'docs'], function () {
  gulp.watch(dev, ['dev']);
  gulp.watch(docs, ['docs']);
  gulp.watch(lib, ['dev', 'docs']);
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

// ------------------------------------
// builds the docs
// ------------------------------------
gulp.task('default', ['react', 'docs']);

gulp.task('docs', ['guide', 'demo:bootstrap', 'demo:gridforms', 'demo:ionic', 'playground']);

gulp.task('react', function () {

  browserify({
    require: ['react']
  })
  .bundle()
  .pipe(source('react.js'))
  .pipe(gulp.dest('./docs/js'));

});

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

// ------------------------------------
// uglify (to see the dimensions)
// ------------------------------------
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
gulp.task('dist', function() {

  var b = browserify('./lib', {
  })
  .external('react')
  .bundle()
  .pipe(source('dist.js'))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest('./dist'));
})
