'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
//var sass = require('gulp-ruby-sass');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var newer = require('gulp-newer');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var pngquant = require('imagemin-pngquant');
var csso = require('gulp-csso');
var uncss = require('gulp-uncss');
var coffee = require('gulp-coffee');
//var connect = require('gulp-connect');
//var compass = require('gulp-compass');
var webp = require('gulp-webp');


//=====================
// ERROR MSG
//=====================
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


// sass to css
//gulp.task('scss', function () {
//    gulp.src('src/sass/index.sass')
//        .pipe(plumber())
//        .pipe(changed('build/css'))
//        .pipe(sass({indentedSyntax: true}))
//        .pipe(plumber.stop())
//        .pipe(autoprefixer("last 10 versions"))
//        .pipe(gulp.dest('build/css'))
//        .pipe(minifycss())
//        .pipe(gulp.dest('build/css'))
//        .pipe(browserSync.reload({stream:true}));
//});

//=====================
// SASS
//=====================

gulp.task('sass', function () {
    gulp.src('src/index.sass')
        .pipe(plumber())
        .pipe(sass.sync().on('error', sass.logError))
//        .pipe(sass({indentedSyntax: true}))
        .pipe(plumber.stop())
        .pipe(autoprefixer('last 15 version'))
        .pipe(minifycss())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream:true}));
});

//=====================
// JS
//=====================
gulp.task('js', function () {
    gulp.src('src/*.js')
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
});

//=====================
// COFFEE
//=====================
//gulp.task('coffee', function() {
//	return gulp.src('src/index.coffee')
//		.pipe(plumber())
//		.pipe(coffee({bare: true}).on('error', gutil.log))
//		.pipe(gulp.dest("build/js"));
//});

//=====================
// JADE
//=====================
gulp.task('jade', function() {
  return gulp.src('src/index.jade')
    .pipe(plumber())
    .pipe(newer('build/'))
    .pipe(jade({
        pretty: true
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/'));
});

//=====================
// IMAGE
//=====================
gulp.task('img', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

//=====================
// Уменьшаем html
//=====================
gulp.task('minify', function() {
  return gulp.src('build/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'))
});

//=====================
//GULP BROWSER SYNC
//=====================
gulp.task('browser-sync', function() {
    browserSync.init(["/css/*.css", "js/*.js"], {
        server: {
            baseDir: "build"
        },
        notify: false
    });
});


//=====================
// Удаляем не используемое в .css
//=====================
gulp.task('unuse', function() {
    return gulp.src('build/css/index.css')
        .pipe(uncss({
            html: ['build/index.html']
        }))
        .pipe(csso())
        .pipe(gulp.dest('build/new_css/'));
});


//=====================
// Делаем CSS меньше (.min.css)
//=====================
gulp.task('csso', function() {
    return gulp.src('build/css/*.css')
        .pipe(csso())
        .pipe(gulp.dest('/out/'));
});

//=====================
// Делаем из картинок - .webP
//=====================
gulp.task('webp', function () {
    return gulp.src(['src/img/*.jpg', 'src/img/*.png'])
        .pipe(webp())
        .pipe(gulp.dest('build/webp'));
});

//=====================
// Выборочная оптимизация картинок
//=====================
gulp.task('imgsel', function () {
    return gulp.src('imgsrc/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('imgdone/'));
});

//=====================
// Делаем из картинок - .webP
//=====================
gulp.task('webpsel', function () {
    return gulp.src(['imgsrc/*.jpg', 'imgsrc/*.png'])
        .pipe(webp())
        .pipe(gulp.dest('imgdone/'));
});

//=====================
// Reload all Browsers
//=====================
gulp.task('bs-reload', function () {
    browserSync.reload();
});


//=====================
// Default task
//=====================
gulp.task('default', ['sass', 'jade', 'js', 'img', 'browser-sync'], function() {
  gulp.watch(["src/**/*.sass", "src/**/*.scss"], ['sass']);
  gulp.watch("src/**/*.jade", ['jade']);
  gulp.watch("src/{,*/}*.js", ['js']);
  gulp.watch("src/img/*", ['img']);
  gulp.watch("build/*.html", ['bs-reload']);
});
