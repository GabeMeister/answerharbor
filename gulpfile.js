const src = 'answerharbor_app/static/js/main.js';
const jsDir = 'answerharbor_app/static/js/';
const cssDir = 'answerharbor_app/static/css/';
const sassDir = 'answerharbor_app/static/sass/';

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var gulp_if = require('gulp-if');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var argv = require('yargs').argv;

gulp.task('sass', function() {
    return gulp.src('answerharbor_app/static/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('answerharbor_app/static/css/'))
        .pipe(gulp_if(argv.production, cleanCss()))
        .pipe(gulp_if(argv.production, rename('style.min.css')))
        .pipe(gulp.dest('answerharbor_app/static/css/'));
});

gulp.task('js', function(cb) {
    pump([
        gulp.src('answerharbor_app/static/js/main.js'),
        browserify({
            insertGlobals: true
        }),
        rename('build.js'),
        gulp.dest('answerharbor_app/static/js/'),
        gulp_if(argv.production, uglify()),
        gulp_if(argv.production, rename('build.min.js')),
        gulp_if(argv.production, gulp.dest('answerharbor_app/static/js/'))
    ], cb);
});

gulp.task('default', function() {
    if(argv.production) {
        gulp.start('sass');
        gulp.start('js');
    }
    else {
        gulp.watch('answerharbor_app/static/sass/**/*.scss', ['sass']);
        gulp.watch('answerharbor_app/static/js/**/*.js', ['js']);
    }
});
