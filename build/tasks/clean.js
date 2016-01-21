var gulp = require('gulp'),
    del = require('del');

gulp.task('clean', function() {
  return del(['dist/**', '!dist'], { dryRun: true });

  /*
  return del(['dist/**', '!dist'], { dryRun: true })
    .then(paths => {
      console.log('FILES & FOLDERS TO DELETE:\n', paths.join('\n'));
    });
  */
});
