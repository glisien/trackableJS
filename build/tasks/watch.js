var gulp = require('gulp'),
    paths = require('../paths');

gulp.task('watch', ['build'], function() {
  return gulp.watch([paths.source], ['build']);
});
