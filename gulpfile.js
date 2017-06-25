// 载入外挂
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    order = require("gulp-order"),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    fileinclude = require('gulp-file-include'),
	sourcemap = require( 'gulp-sourcemaps')
	rev = require('gulp-rev'); //- 对文件名加MD5后缀


// 样式
gulp.task('styles', function() {
  return gulp.src('src/css/*.css')
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest('dist/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
	  //.pipe(rev())
      .pipe(gulp.dest('dist/css'))
      .pipe(notify({ message: 'Styles task complete' }))
		.pipe(browserSync.reload({
			stream: true
		}));
});




// 脚本
gulp.task('scripts', function() {
  return gulp.src(['src/**/*.js'])
      .pipe(order([
        "lib/jquery-2.0.3.min.js",
        "lib/*.js",
        "js/*.js"
      ]))
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('main.js'))
      //.pipe(gulp.dest('dist/js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
      .pipe(notify({ message: 'Scripts task complete' }))
		.pipe(browserSync.reload({
			stream: true
		}));
});

//js合并 压缩 混淆
/*var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
gulp.task('scripts', function() {
	gulp.src('src/js/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});*/

// 图片
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('dist/images'))
      .pipe(notify({ message: 'Images task complete' }))
		.pipe(browserSync.reload({
			stream: true
		}));
});
//html
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('dist/'))
      .pipe(notify({ message: 'html task complete' }))
		.pipe(browserSync.reload({
			stream: true
		}));
});
// 清理
gulp.task('clean', function() {
  return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
      .pipe(clean())
		.pipe(browserSync.reload({
			stream: true
		}));
});

// 预设任务
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'html')
		.pipe(browserSync.reload({
			stream: true
		}));
});

//创建本地服务器,并监听文件变化
var browserSync = require('browser-sync');
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: ['dist']
		}
	}, function(err, bs) {
	    console.log(bs.options.getIn(["urls", "local"]));
	});

	// 看守所有.scss档
	  gulp.watch('src/css/**/*.css', ['styles']);

	  // 看守所有.js档
	  gulp.watch('src/js/**/*.js', ['scripts']);

	  // 看守所有图片档
	  gulp.watch('src/images/**/*', ['images']);

	  //看守html
	  gulp.watch('src/**/*.html', ['html']) ;
});