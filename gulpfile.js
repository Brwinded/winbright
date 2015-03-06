'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect');

 //error msg
function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}


 //connect server
gulp.task('connect', function() {
  connect.server({
    port: 9000,
    root: 'build',
    livereload: true
  });
});

// scss
gulp.task('sass', function () {
    gulp.src('src/scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(plumber.stop())
        .pipe(autoprefixer({browsers: ['last 3 versions']}))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload())
});

 //js
gulp.task('js', function () {
    gulp.src('src/js/*.js')
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload())
});

 //jade
gulp.task('jade', function() {
    gulp.src(['src/jade/*.jade', '!src/jade/_*.jade'])
        .pipe(plumber())    
        .pipe(jade({
            pretty: true
        }))
        .on('error', log)
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload())
}); 

//watch
gulp.task('watch' , function() {
  gulp.watch('src/scss/*.scss', ['sass'])
  gulp.watch('src/jade/*.jade', ['jade'])
  gulp.watch('src/js/*.js', ['js'])
})



gulp.task('default', ['connect', 'sass', 'jade', 'js', 'watch']);