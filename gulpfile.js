var gulp = require('gulp');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');

gulp.task('sass', function() {
  //root scss file (import all your partials into here)
  return gulp.src('./sass/styles.scss')
      .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
      .pipe(postcss([
        // add vendor prefixes - might need to add IE rule
        require('autoprefixer')({
          browsers: ['last 5 versions', '> 2%']
        }),
        // optimise but don't compress as it won;t be readable in shopify editor
        require('cssnano')({
          safe: true,
          discardComments: true,
          core: false,
          styleCache: false
        }),
        require('css-mqpacker')({
          sort: true
        })
      ]))
      // change the file name to be styles.scss.liquid file
      .pipe(rename('styles.scss.liquid'))
      // remove the extra set of quotations used for escaping the liquid string (we'll explain this in a sec)
      .pipe(replace('"{{', '{{'))
      .pipe(replace('}}"', '}}'))
      // save the file to the theme assets directory
      .pipe(gulp.dest('./assets/'));
});

gulp.task('default', function() {
    // this assumes your sass is in a directory named sass
    gulp.watch(['./sass/**/*.scss'], ['sass']);
});
