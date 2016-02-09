var toc    = require('gulp-doctoc');
var marked = require('gulp-marked');
var gulp = require('gulp');
var styleguide = require('sc5-styleguide');
var sass = require('gulp-sass');
var outputPath = 'output';

gulp.task('markdown', function(){

  gulp.src('README.md')
    .pipe(toc())
    .pipe(marked())
    .pipe(gulp.dest('.'));

});

gulp.task('styleguide:generate', function() {
  return gulp.src('sass/**/*.scss')
    .pipe(styleguide.generate({
        title: 'Probo CI Style Guide',
        server: true,
        rootPath: outputPath,
        overviewPath: 'README.md'
      }))
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src('scss/styles.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(outputPath));
});

gulp.task('watch', ['styleguide'], function() {
  // Start watching changes and update styleguide whenever changes are detected
  // Styleguide automatically detects existing server instance
  gulp.watch(['sass/**/*.scss'], ['styleguide']);
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);
gulp.task('default', ['watch']);
