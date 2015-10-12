'use strict';

var gulp              = require('gulp'),
		sass              = require('gulp-sass'),
		jshint            = require('gulp-jshint'),
		rename            = require('gulp-rename'),
		sourcemaps        = require('gulp-sourcemaps'),
		wiredep           = require('wiredep').stream,
		useref            = require('gulp-useref'),
		gulpif            = require('gulp-if'),
		uglify            = require('gulp-uglify'),
		minifyCss         = require('gulp-minify-css'),
		del               = require('del'),
		browserSync       = require('browser-sync'),
		autoprefixer      = require('gulp-autoprefixer')
;

// Scss task
gulp.task('sass', function() {
	return gulp.src('./app/scss/app.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream())
		;
});

// Foundation CSS task
gulp.task('sass-zf', function() {
	return gulp.src('./app/bower_components/foundation/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./app/css'))
		;
});

// JSHint task
gulp.task('lint', function() {
	return gulp.src('./app/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		;
});

// Reload browser after lint task complete
gulp.task('js-watch', ['lint'], browserSync.reload);

// Bower task
gulp.task('bower', function() {
	return gulp.src('./app/*.html')
		.pipe(wiredep({
			exclude: ['./app/bower_components/modernizr/dist/modernizr-build.js']
		}))
		.pipe(gulp.dest('./app'))
		;
});

// Useref task
gulp.task('useref', ['del'], function() {
	var assets = useref.assets();

	return gulp.src('./app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('./dist'))
		;
});

// Delete files task
gulp.task('del', function() {
	return del('./dist/**');
});

// BrowserSync task
gulp.task('serve', function() {
	browserSync.init({
		server: './app'
	});

	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch('app/js/*.js', ['js-watch']);
});

// Autoprefixer CSS
gulp.task('autoprefix', function() {
	return gulp.src('./app/css/app.css')
		.pipe(autoprefixer())
		.pipe(gulp.dest('./app/css'))
		;
});

// Build task
gulp.task('build', ['useref']);

// Default task
gulp.task('default', ['serve']);