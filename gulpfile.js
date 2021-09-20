const gulp = require('gulp');
const minify = require("gulp-babel-minify");
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const babel = require('gulp-babel');
const through = require('through2');
const htmlMinifier = require('gulp-html-minifier');
const replace = require('gulp-replace');

const pkg = require('./package.json');

gulp.task('build-css', _ =>
  gulp.src('app/*.css')
    .pipe(postcss([cssnext]))
    .pipe(gulp.dest('dist'))
);

gulp.task('build-js', _ =>
  gulp.src('app/*.js')
    .pipe(replace('{%VERSION%}', pkg.version))
    .pipe(minify({
      builtIns: false,  // Fixes "Couldn't find intersection" gulp-babel-minify bug at build
      mangle: {
        keepClassName: true
      }
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

gulp.task('copy', _ =>
  gulp.src(['app/images/**/*', 'app/manifest.json'], {base: 'app'})
    .pipe(gulp.dest('dist'))
)

gulp.task('default', gulp.series('build-css', 'build-js', 'build-html', 'copy'));
