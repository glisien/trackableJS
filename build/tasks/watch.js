var gulp = require('gulp');

gulp.task('watch', ['build'], function() {
  return gulp.watch(['src/**/*.js'], ['build']);
});
