'use strict';

var gulp = require('gulp');
var project = require('./project');
var $ = require('gulp-load-plugins')();
var nodemon = require('nodemon');

gulp.task('lint', function () {
  gulp.src([
      project.path.server + '/**/*.js',
      project.path.server + '/*.js',
      '!' + project.path.npm
    ])
    .pipe($.cached('linting-server'))
    .pipe($.jshint(project.path.server + '/.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('server', function () {
  nodemon('-e "js json" --watch server --harmony ' + project.path.server);
});

gulp.task('default', ['lint'], function () {
  nodemon('-e "js json" --watch server --harmony ' + project.path.server);

  gulp.watch([
      project.path.server + '/**/*.js',
      project.path.server + '/*.js',
      '!' + project.path.npm
    ], ['lint']);
});
