'use strict';

var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var del = require('del');
var sass = require('gulp-sass');
var scss = require('postcss-scss');
var stylelint = require('stylelint');
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var reload = browserSync.reload;
var shell = require('gulp-shell');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag = require('gulp-tag-version');
var spawn = require('child_process').spawn;

// paths
var project = {
  scss: 'scss',
  css: 'probo.css',
  dest: 'styleguide',
  template: 'template',
  styleguide: ['./scss/*.scss', './template/**/*.*'],
  dist: 'dist',
};

// kss generator command
var kssNode = './node_modules/.bin/kss-node scss --template ' + project.template + ' --source ' + project.scss + ' --destination ' + project.dest + ' --css ' + project.css;

// deploy GH pages command
var deployGH = 'git subtree push --prefix=styleguide origin gh-pages';

// error notifications
var handleError = function(task) {
  return function(err) {
    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
    this.emit('end');
  };
};

// specify browser compatibility with https://github.com/ai/browserslist
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
];

// pre CSS processors
var preprocessors = [
  stylelint,
  reporter({clearMessages: true, throwError: true}),
];

// post CSS processors
var postprocessors = [
  autoprefixer({browsers: AUTOPREFIXER_BROWSERS}),
];

// Delete files
gulp.task('clean', function() {
  return del([project.dest, project.dist]);
});

// Lint scss
gulp.task('lint:scss', function() {
  return gulp.src(project.scss)
    .pipe(postcss(preprocessors, {
      syntax: scss,
    }))
    .on('error', function() {
      gutil.log(gutil.colors.bgRed('CSS will not build without fixing linting errors!'));
    });
});

// Build CSS from scss (unminified for development)
gulp.task('scss:dev', ['lint:scss'], function() {
  return gulp.src('./' + project.scss + '/*.scss')
    .pipe(sass())
    .on('error', handleError('Scss Compiling'))
    .pipe(postcss(postprocessors))
    .on('error', handleError('Post CSS Processing'))
    .pipe(gulp.dest('./' + project.dest))    
});

// Build CSS from scss (minified for production)
gulp.task('scss:dist', function() {
  return gulp.src('./' + project.scss + '/probo.scss')
    .pipe(sass())
    .pipe(postcss(postprocessors))
    .pipe(gulp.dest(project.dist))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(project.dist));
});

// generate styleguide
gulp.task('kss', shell.task([kssNode]));

// Use Browsersync to reload on change
gulp.task('browser-sync', ['clean', 'styleguide'], function() {
  browserSync.init({
    ghostMode: false,
    files: project.dest,
    server: {
      baseDir: './' + project.dest,
    },
  });

  gulp.watch(project.styleguide, ['scss:dev', 'kss']);
});

// create a release
gulp.task('dist', ['clean', 'styleguide', 'scss:dist'], function() {
  return gulp.src(['./package.json'])
    // bump the version number in those files 
    .pipe(bump({type: 'patch'}))
    // save it back to filesystem 
    .pipe(gulp.dest('./'))
    // add changes
    .pipe(git.add({args: '-p'}))
    // commit the changed version number 
    .pipe(git.commit('bumps package version'))
    // read only one file to get the version number 
    .pipe(filter('package.json'))
    // **tag it in the repository** 
    .pipe(tag());
});

// publish to npm
gulp.task('npm:publish', function() {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', function() {
    gutil.log(gutil.colors.bgRed('Styleguide has been published!'));
    this.emit('end')
  });
});

// deploy styleguide
gulp.task('deploy', shell.task([deployGH]));

gulp.task('release', ['styleguide', 'dist', 'npm:publish']);
gulp.task('styleguide', ['scss:dev', 'kss']);
gulp.task('default', ['browser-sync']);
