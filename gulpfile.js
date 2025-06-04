const { src, dest, watch, parallel, series } = require("gulp");
// конвертация sass-css
const scss = require("gulp-sass")(require("sass"));

//переименование и объединиение сжатие css
const concat = require("gulp-concat");
// сжатие js
const uglify = require("gulp-uglify-es").default;
// добавление префиксов в старіе версии браузеров
const autoprefixer = require("gulp-autoprefixer");
// очистка папок
const clean = require("gulp-clean");
//  сжатие и конвертация картинок
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const svgSprite = require("gulp-svg-sprite");

// Конвертер шрифтов
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

const include = require("gulp-include");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");

function fonts() {
  return src("fonts/src/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(src("fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("fonts"));
}

// function includeh() {
//   return src( "app/*.html")
//     .pipe(
//       include({
//         includePaths: "app/html"
//       })
//     )
//     .pipe(dest("app"));
// }

function styles() {
  // return (
  //   src("scss/style.scss") // Главный файл SCSS
  return src([
    "./css/modern-normalize.min.css",
    "./css/ion.rangeSlider.css",
    "./css/jquery.formstyler.css",
    "./css/jquery.formstyler.theme.css",
    "./node_modules/nouislider/dist/nouislider.css",
    "./node_modules/swiper/swiper-bundle.css",
    "./node_modules/glightbox/dist/css/glightbox.css",
    "./node_modules/aos/dist/aos.css",
    "./css/jquery.rateyo.min.css",
    "./scss/style.scss",
  ])
    .pipe(plumber()) // Предотвращение остановки сборки при ошибках
    .pipe(sourcemaps.init()) // Инициализация Source Maps
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        overrideBrowsersList: ["last 10 version, 'Safari >= 11"],
        grid: true,
      })
    )
    .pipe(sourcemaps.write(".")) // Запись Source Maps в текущую папку
    .pipe(dest("css"));
}

function vendorScripts() {
  return src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/transfer-elements/dist/transfer-elements.js",
    "node_modules/swiper/swiper-bundle.min.js", // ✅ min.js
    "node_modules/nouislider/dist/nouislider.min.js", // ✅
    "node_modules/glightbox/dist/js/glightbox.min.js", // ✅
    "node_modules/siema/dist/siema.min.js",
    "node_modules/aos/dist/aos.js",
    "libs/inputmask.js",
    "js/jquery.formstyler.min.js",
    "js/ion.rangeSlider.min.js",
  ])
    .pipe(concat("vendor.min.js"))
    .pipe(uglify())
    .pipe(dest("js"));
}

function projectScripts() {
  return src([
    "js/button.js",
    "js/scroll.js",
    // "js/modal.js",
    // "js/slider.js",
    // "js/aside.js",
    "js/counter.js",
    "js/scroll.js",
    // "js/range-my.js",
    // "js/read-more.js",
    "js/more-btn.js",
    // "js/render.js",
    "js/main.js",

    // Для подключения многих (всех) файлов js? Обязательно исключать main.min.js
    // 'app/js/*.js',
    // '!app/js/main.min.js'
    "!/js/main.min.js",
  ])
    .pipe(concat("main.min.js"))
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglify())
    .pipe(dest("js"));
}

function images() {
  // return src(["app/images/**/*.*", "!app/images/**/*.svg"])
  return (
    src(["images/src/*.*", "!images/src/*.svg"])
      // .pipe(newer("app/images"))
      // .pipe(avif({ quality: 50 }))

      // .pipe(src("app/images/**/*.*"))
      .pipe(src("images/src/*.*"))
      .pipe(newer("images"))
      .pipe(webp())

      .pipe(src("images/src/*.*"))
      .pipe(newer("images"))
      .pipe(imagemin())

      .pipe(dest("images/articles/"))
  );
}

function sprite() {
  return src("app/images/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest("app/images"));
}

// функция удаления папок
function cleanDist() {
  return src("dist").pipe(clean("*.*"));
}

// функция переноса файлов в чистую папку для сдачи
function building() {
  // прописывать всё что есть - картинки, шрифты..
  return src(
    [
      "app/css/style.min.css",
      "app/js/main.min.js",
      "app/**/*.html",
      "app/fonts/*.*",
      "app/images/*.*",
      "!app/images/*.svg",
      "!app/images/stack",
      "app/images/sprite.svg",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

// слешение за обновлениями файлов
// Слежение за изменениями
function watching() {
  watch(["scss/**/*.scss"], styles);
  watch(["images/src/**/*.*"], images);
  watch(["js/**/*.js", "!js/main.min.js"], projectScripts);
}

// Экспортируем задачи
exports.fonts = fonts;
// exports.includeh = includeh;
exports.styles = styles;
exports.images = images;
exports.sprite = sprite;
exports.build = series(cleanDist, building);
exports.watching = watching;

exports.vendorScripts = vendorScripts;
exports.projectScripts = projectScripts;
exports.scripts = parallel(vendorScripts, projectScripts);

exports.build = series(cleanDist, building);

exports.default = parallel(styles, exports.scripts, watching);
