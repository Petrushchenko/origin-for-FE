'use ctrict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    cssmin = require('gulp-clean-css'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');
    var browserSync = require('browser-sync').create();
    
var path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: { 
        html: 'src/index.html', 
        js: 'src/js/*.js',
        style: 'src/style/main.less',
        css: 'src/style/*.css',
        img: 'src/images/*.*', 
        fonts: 'src/fonts/*.*'
    },
    watch: { 
        html: 'src/index.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img: 'src/images/*.*',
        fonts: 'src/fonts/*.*'
    },
    clean: './build'
};

function html() {
    return gulp.src(path.src.html) 
        .pipe(gulp.dest(path.build.html));
};

function scripts(){
    return gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js));
};

// function styles(){
//     return gulp.src(path.src.style)
//         .pipe(sass())
//         .pipe(autoprefixer())
//         .pipe(cssmin())
//         .pipe(gulp.dest(path.build.css));
// };

gulp.task('less', () => {
    return gulp.src(path.src.style)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'safari 5',
                'ie 10',
                'ie 11'
            ],
            cascade: true
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css));
});
function css(){
    return gulp.src(path.src.css)
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css));
};

function images(){
   	return gulp.src(path.src.img)
        .pipe(imagemin([
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({
        		plugins: [
	           		 {removeViewBox: true},
	           		 {cleanupIDs: false}
       			]		
   			})
		]))
        .pipe(gulp.dest(path.build.img));
};

function fonts() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
};

function clean() {
    return del([path.clean]); 
};

gulp.task('build', gulp.series(clean, gulp.parallel('less', html, scripts, css, fonts, images)));

 function browser() {
   browserSync.init({
        server: {
            baseDir: "build"
        }
    });
    gulp.watch(path.watch.style, gulp.series('less')).on("change", browserSync.reload); 
    gulp.watch(path.watch.html, html).on("change", browserSync.reload); 
    gulp.watch(path.watch.img, images).on("change", browserSync.reload);
    gulp.watch(path.watch.js, scripts).on("change", browserSync.reload);
}

gulp.task('default', gulp.series("build", browser));
