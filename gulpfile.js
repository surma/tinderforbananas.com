const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const babel = require('gulp-babel');
const through = require('through2');
const htmlMinifier = require('gulp-html-minifier');

gulp.task('build-css', _ =>
  gulp.src('app/*.css')
    .pipe(postcss([cssnext]))
    .pipe(gulp.dest('dist'))
);

gulp.task('build-js', _ =>
  gulp.src('app/*.js')
    .pipe(babel({
      presets: ['babili']
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('build-html', _ =>
  gulp.src('app/index.html')
    .pipe(htmlMinifier({
      minifyCSS: true,
      minifyJS: false,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      customAttrCollapse: /^d$/
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('copy-images', _ =>
  gulp.src('app/images/**', {base: 'app'})
    .pipe(gulp.dest('dist'))
)

gulp.task('default', ['build-css', 'build-js', 'build-html']);