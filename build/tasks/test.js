var gulp = require('gulp'),
    karma = require('karma'),
    path = require('path');

gulp.task('test', ['build'], function(callback) {
  new karma.Server({
    configFile: path.resolve('karma.conf.js')
  }).start(callback);
});
