var gulp = require('gulp');

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist/'));
});
