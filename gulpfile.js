var del             = require('del');
var gulp            = require('gulp');
var util            = require('gulp-util');
var stylus          = require('gulp-stylus');
var gulpif          = require('gulp-if');
var concat          = require('gulp-concat');
var filter          = require('gulp-filter');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var merge          = require('gulp-merge');
var prefixer        = require('gulp-autoprefixer');
var minifyCss       = require('gulp-minify-css');
var minifyHtml      = require('gulp-minify-html');
var sourcemaps      = require('gulp-sourcemaps');
var mainBowerFiles  = require('main-bower-files');

// Setup environment
// util.env.env     = util.env.env ? util.env.env : 'development';
var isProduction    = true; // util.env.env.toLowerCase() === 'production';

var config          = require('./gulp-config.json');
var paths           = config.paths;

config.production   = isProduction;
config.sourcemaps   = !isProduction;

/**
 * Log and supress errors occuring in the
 * Gulp stream
 *
 * @param  {Error} error
 */
function suppressErrors(error) {
    console.error(error);
    this.emit('end');
}

/**
 * Copy 3rd party JS files
 *
 * @return {Stream}
 */
gulp.task('vendor-js', function vendorJs() {
    var mainFiles = mainBowerFiles(); //.concat(paths.source.javascript);
    var jsFilter = filter(['*.js']);

    if (!mainFiles.length) {
        return;
    }

    return gulp.src(mainFiles)
        .pipe(jsFilter)
        .pipe(concat(config.filenames.vendor.js))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.destination.javascript));
});

/**
 * Copy 3rd party CSS files
 *
 * @return {Stream}
 */
gulp.task('vendor-css', function vendorCss() {
    var mainFiles = mainBowerFiles();
    var cssFilter = filter(['*.css']);

    if (!mainFiles.length) {
        return;
    }

    return gulp.src(mainFiles)
        .pipe(cssFilter)
        .pipe(concat(config.filenames.vendor.css))
        // .pipe(prefixer())
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.destination.css));
});

/**
 * Copy and bundle Javascript files
 *
 * @return {Stream}
 */
gulp.task('javascript', function javascript() {
    return gulp.src(paths.source.javascript)
        .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
            .pipe(concat(config.filenames.app.js))
            .pipe(gulpif(config.production, uglify()))
        .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
        .pipe(gulp.dest(paths.destination.javascript));
});

/**
 * Compile and bundle app CSS files
 *
 * @return {Stream}
 */
gulp.task('css', function css() {
    return gulp.src(paths.source.css)
        .pipe( gulpif(config.sourcemaps, sourcemaps.init()) )
            .pipe(stylus())
            .pipe( gulpif(config.production, prefixer()) )
            .pipe( gulpif(config.production, minifyCss()) )
            .pipe(rename(config.filenames.app.css))
        .pipe( gulpif(config.sourcemaps, sourcemaps.write()) )
        .pipe(gulp.dest(paths.destination.css));
});

/**
 * Copy font files
 *
 * @return {Stream}
 */
gulp.task('fonts', function fonts() {
    var mainFiles = mainBowerFiles().concat(paths.source.fonts);
    var fontFilter = filter(['*.eot', '*.ttf', '*.woff', '*.woff2', '*.otf']);

    if (!mainFiles.length) {
        return;
    }

    return gulp.src(mainFiles)
        .pipe(fontFilter)
        .pipe(gulp.dest(paths.destination.fonts));
});

/**
 * Copy HTML files
 *
 * @return {Stream}
 */
gulp.task('html', function html() {
    return gulp.src(paths.source.html)
        // .pipe(gulpif(config.production, minifyHtml({
        //     spare: true,
        //     empty: true
        // })))
        .pipe(gulp.dest(paths.destination.html));
});

/**
 * Copy image files
 *
 * @return {Stream}
 */
gulp.task('images', function images() {
    return gulp.src(paths.source.images)
        .pipe(gulp.dest(paths.destination.images));
});

/**
 * Copy Chrome extension config files
 * 
 * @return {Stream}
 */
gulp.task('chrome', function() {
    var chromeJs = gulp.src(paths.source.chrome.js)
        .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
            .pipe(concat('chrome.js'))
            .pipe(gulpif(config.production, uglify()))
        .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
        .pipe(gulp.dest(paths.destination.chrome));

    var manifestSrc = config.production ? paths.source.chrome.manifest : paths.source.chrome.manifestDev;

    var chromeManifest = gulp.src(manifestSrc)
        .pipe(rename('manifest.json'))
        .pipe(gulp.dest(paths.destination.chrome));

    return merge(chromeJs, chromeManifest);
});

/**
 * Watch source files to trigger build tasks
 */
gulp.task('watch', function watch() {
    gulp.watch(paths.watch.css, ['css']);
    gulp.watch(paths.watch.fonts, ['fonts']);
    gulp.watch(paths.watch.images, ['images']);
    gulp.watch(paths.watch.html, ['html']);
    gulp.watch(paths.watch.javascript, ['javascript']);
});

/**
 * Build and setup watcher
 */
gulp.task('default', [
    'css',
    'html',
    'fonts',
    'images',
    'chrome',
    'javascript',
    'watch',
]);

/**
 * Build without watching
 */
gulp.task('build', [
    'build:full',
]);

/**
 * Build with 3rd party files without watching
 */
gulp.task('build:full', [
    'css',
    'html',
    'fonts',
    'images',
    'chrome',
    'javascript',

    'vendor-js',
    'vendor-css',
]);

/**
 * Clean build directory
 */
gulp.task('clean', function clean(callback) {
    del(paths.build, callback);
});
