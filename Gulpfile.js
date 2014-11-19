var gulp =  require('gulp');
var react = require('gulp-react');
var header = require('gulp-header');

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
// default (main task for releases)
// ------------------------------------
gulp.task('default', ['build']);

gulp.task('build', function(){
  return gulp.src('./src/index.jsx')
    .pipe(react())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('.'));
});

