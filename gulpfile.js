const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss');

/*
--TOP LEVEL FUNCTIONS
gulp.tasks - Define tasks
gulp.src - Point to files to use
gulp.dest - Point to the folder to output,
gulp.watch - Watch files and folders for changes

*/

gulp.task('autoprefixer', () => {
    return gulp.src('src/style.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'))
})


// Copy All Html files
gulp.task('copyHtml', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Compile Sass
gulp.task('sass', function () {
    gulp.src('src/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

// Minify Js
gulp.task('minify', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('dist/js'));
});


gulp.task('watch', function () {
    gulp.watch('src/*.html', ['copyHtml']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['minify']);
});

gulp.task('package', ['copyHtml', 'sass', 'minify']);

gulp.task('default', ['copyHtml', 'sass', 'minify']);

