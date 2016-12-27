const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const closure = require('google-closure-compiler').compiler;
const through = require('through2');
const htmlMinifier = require('gulp-html-minifier');

gulp.task('build-css', _ =>
  gulp.src('app/*.css')
    .pipe(postcss([cssnext]))
    .pipe(gulp.dest('dist'))
);

function closureCompile(file) {
  return new Promise((resolve, reject) => {
    const compiler = new closure({
      js: file,
      compilation_level: 'WHITESPACE_ONLY',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT6_STRICT'
    })
    .run((exitCode, stdOut, stdErr) => {
      if (exitCode === 0) return resolve(stdOut);
      reject(stdErr);
    });
  });
}

gulp.task('build-js', _ =>
  gulp.src('app/*.js')
    .pipe(through.obj((file, enc, cb) => {
      closureCompile(file.path)
        .then(output => {
          file.contents = new Buffer(output);
          cb(null, file);
        })
        .catch(err => console.error(err));
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