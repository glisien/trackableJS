var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    paths = require('../paths');

gulp.task('build', function() {
  return browserify({
    entries: paths.root + 'index.js',
    debug: true
  })
  .transform(babelify, {
    presets: ['es2015'],
    comments: true,
    compact: false
  })
  .bundle()
  .pipe(source('trackable.js'))
  .pipe(gulp.dest(paths.output));
});
