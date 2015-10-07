var gulp = require('gulp');
var concat = require('gulp-concat');

// Concat task
gulp.task('js', function() {
	return gulp.src('src/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist'))
		;
});