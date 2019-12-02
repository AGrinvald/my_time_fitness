'use strict';

var autoprefixerList = [
  'Chrome >= 45',
  'Firefox ESR',
  'Edge >= 12',
  'Explorer >= 10',
  'iOS >= 9',
  'Safari >= 9',
  'Android >= 4.4',
  'Opera >= 30'
];

var path = {
  build: {
    html: 'assets/build/',
    js: 'assets/build/js/',
    css: 'assets/build/css/',
    img: 'assets/build/img/',
    fonts: 'assets/build/fonts/'
  },
  src: {
    html: 'assets/src/*.html',
    js: ['assets/src/js/index.js', 'assets/src/js/akademicheskaya.js', 
    'assets/src/js/kids.js', 'assets/src/js/kupchino.js', 
    'assets/src/js/komendanskiy.js', 'assets/src/js/promotions.js',
    'assets/src/js/promotion.js', 'assets/src/js/payment-process.js' ],
    style: ['assets/src/style/index.scss', 'assets/src/style/akademicheskaya.scss',
    'assets/src/style/komendanskiy.scss', 'assets/src/style/kupchino.scss', 
    'assets/src/style/kids.scss', 'assets/src/style/promotions.scss', 'assets/src/style/sale.scss', 
    'assets/src/style/fitness-plus-spa.scss', 'assets/src/style/payment-process.scss', 
    'assets/src/style/first-promo.scss', 'assets/src/style/second-promo.scss', 
    'assets/src/style/fourth-promo.scss', 'assets/src/style/fifth-promo.scss'],
    img: 'assets/src/img/**/*.*',
    fonts: 'assets/src/fonts/**/*.*'
  },
  watch: {
    html: 'assets/src/**/*.html',
    js: 'assets/src/js/**/*.js',
    css: 'assets/src/style/**/*.scss',
    img: 'assets/src/img/**/*.*',
    fonts: 'assets/src/fonts/**/*.*'
  },
  clean: './assets/build/*'
};
/* настройки сервера */
var config = {
  server: {
    baseDir: './assets/build'
  },
  notify: false
};

var gulp = require('gulp'),  // подключаем Gulp
  webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
  rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
  sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
  sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
  autoPrefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
  cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
  uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
  rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
  rename = require('gulp-rename');

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
  webserver(config);
});

// сбор html
gulp.task('html:build', function () {
  return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
    //.pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
    .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', function () {
  return gulp.src(path.src.style) 
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(sourcemaps.init()) // инициализируем sourcemap
    .pipe(sass()) // scss -> css
    .pipe(autoPrefixer(autoprefixerList))
    .pipe(gulp.dest(path.build.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS()) // минимизируем CSS
    .pipe(sourcemaps.write('./')) // записываем sourcemap
    .pipe(gulp.dest(path.build.css)) // выгружаем в build
    .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

gulp.task('fonts:build', function () {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

// сбор js
gulp.task('js:build', function () {
  return gulp.src(path.src.js) // получим файл main.js
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(rigger()) // импортируем все указанные файлы в main.js
    .pipe(gulp.dest(path.build.js))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init()) //инициализируем sourcemap
    .pipe(uglify()) // минимизируем js
    .pipe(sourcemaps.write('./')) //  записываем sourcemap
    .pipe(gulp.dest(path.build.js)) // положим готовый файл
    .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// обработка картинок
gulp.task('image:build', function () {
  return gulp.src(path.src.img) // путь с исходниками картинок
  .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// удаление каталога build 
gulp.task('clean:build', function () {
  return gulp.src(path.clean, { read: false })
    .pipe(rimraf());
});

// очистка кэша
// gulp.task('cache:clear', function () {
//   cache.clearAll();
// });

// сборка
gulp.task('build',
  gulp.series('clean:build',
    gulp.parallel(
      'html:build',
      'css:build',
      'js:build',
      'image:build',
      'fonts:build'
    )
  )
);

// запуск задач при изменении файлов
gulp.task('watch', function () {
  gulp.watch(path.watch.html, gulp.series('html:build'));
  gulp.watch(path.watch.css, gulp.series('css:build'));
  gulp.watch(path.watch.js, gulp.series('js:build'));
  gulp.watch(path.watch.img, gulp.series('image:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
  'build',
  gulp.parallel('webserver','watch')      
));