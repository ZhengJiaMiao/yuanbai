// �������
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
	rev = require('gulp-rev'); //- ���ļ�����MD5��׺


// ��ʽ
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




// �ű�
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

//js�ϲ� ѹ�� ����
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

// ͼƬ
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
// ����
gulp.task('clean', function() {
  return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
      .pipe(clean())
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Ԥ������
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'html')
		.pipe(browserSync.reload({
			stream: true
		}));
});

//�������ط�����,�������ļ��仯
var browserSync = require('browser-sync');
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: ['dist']
		}
	}, function(err, bs) {
	    console.log(bs.options.getIn(["urls", "local"]));
	});

	// ��������.scss��
	  gulp.watch('src/css/**/*.css', ['styles']);

	  // ��������.js��
	  gulp.watch('src/js/**/*.js', ['scripts']);

	  // ��������ͼƬ��
	  gulp.watch('src/images/**/*', ['images']);

	  //����html
	  gulp.watch('src/**/*.html', ['html']) ;
});