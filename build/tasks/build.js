var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    browserifyConfig = require('../browserify-config'),
    babel = require('gulp-babel'),
    babelConfig = require('../babel-config'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    paths = require('../paths');

gulp.task('compile', function() {
  return gulp
    .src(paths.source)
    .pipe(plumber())
    .pipe(babel(babelConfig.options))
    .pipe(gulp.dest(paths.output_commonjs));
});

gulp.task('bundle', ['compile'], function() {
  return browserify(browserifyConfig.options)
    .bundle()
    .pipe(source('trackable.js'))
    .pipe(gulp.dest(paths.output));
});

gulp.task('clean', function() {
  return gulp
    .src([paths.output_commonjs + '**/*.js'])
    .pipe(vinylPaths(del));
});

gulp.task('build', function() {
  return gulp
    .src(paths.source)
    .pipe(plumber())
    .pipe(babel(babelConfig.options))
    .pipe(browserify().bundle())
    .pipe(source('trackable.js'))
    .pipe(gulp.dest(paths.output));
});
