var gulp = require('gulp'),
    babel = require('gulp-babel')
    runSequence = require('run-sequence');

gulp.task('build-es6', function() {
  return gulp.src('src/**/*.js').pipe(gulp.dest('dist/es6'));
});

gulp.task('build-common', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      filename: '',
      filenameRelative: '',
      sourceMap: true,
      sourceRoot: '',
      moduleIds: false,
      comments: true,
      compact: false,
      code: true,
      plugins: ['transform-es2015-modules-commonjs']
    }))
    .pipe(gulp.dest('dist/common'));
});

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['build-es6', 'build-common'],
    callback
  );
});
