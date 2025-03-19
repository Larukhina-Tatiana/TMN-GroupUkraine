$(".nav__linkbtn-arrow").on("click", function () {
  $(".nav__linkbtn-arrow").toggleClass("active");
  $(".nav__submenu-list").toggleClass("active");
});

$(".phone__arrow").on("click", function () {
  $(".phone__arrow").toggleClass("active");
  $(".phone__list").toggleClass("active");
});

if ($(window).width() < 890.99) {
  $(".lang").appendTo($(".header__nav"));

  const btn = document.querySelector(".menu__btn");
  const nav = document.querySelector(".nav__list");

  btn.addEventListener("click", () => {
    nav.classList.toggle("menu-open");
    btn.classList.toggle("menu-open");
  });

  (() => {
    const refs = {
      openModalBtn: document.querySelector("[data-modal-search]"),
      closeModalBtn: document.querySelector("[data-modal-close]"),
      modal: document.querySelector("[data-modal]"),
    };

    refs.openModalBtn.addEventListener("click", toggleModal);
    refs.closeModalBtn.addEventListener("click", toggleModal);

    function toggleModal() {
      refs.modal.classList.toggle("is-hidden");
    }
  })();

  const btnSort = document.querySelector(".menu__sort");
  console.log(btnSort);

  const aside = document.querySelector(".aside");

  btnSort.addEventListener("click", () => {
    aside.classList.toggle("open");
    btnSort.classList.toggle("open");
  });
}

// ==================================
// Counter
// ==================================
function increaseCount(e, el) {
  var input = el.previousElementSibling;
  var value = parseInt(input.value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  input.value = value;
}
function decreaseCount(e, el) {
  var input = el.nextElementSibling;
  var value = parseInt(input.value, 10);
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}

$(".js-range-slider").ionRangeSlider({
  type: "double",
  min: 250,
  max: 800,
});

const rangeSliderInit = () => {
  // создаем функцию инициализации слайдера
  const range = document.getElementById("range"); // Ищем слайдер
  const inputMin = document.getElementById("min"); // Ищем input с меньшим значнием
  const inputMax = document.getElementById("max"); // Ищем input с большим значнием

  if (!range || !inputMin || !inputMax) return; // если этих элементов нет, прекращаем выполнение функции, чтобы не было ошибок

  const inputs = [inputMin, inputMax]; // создаем массив из меньшего и большего значения

  noUiSlider.create(range, {
    // инициализируем слайдер
    start: [250, 800], // устанавливаем начальные значения
    tooltips: [true, true],
    connect: true, // указываем что нужно показывать выбранный диапазон
    range: {
      // устанавливаем минимальное и максимальное значения
      min: 0,
      max: 2000,
    },
    step: 1, // шаг изменения значений
  });

  range.noUiSlider.on("update", function (values, handle) {
    // при изменений положения элементов управления слайдера изменяем соответствующие значения
    inputs[handle].value = parseInt(values[handle]);
  });

  inputMin.addEventListener("change", function () {
    // при изменении меньшего значения в input - меняем положение соответствующего элемента управления
    range.noUiSlider.set([this.value, null]);
  });

  inputMax.addEventListener("change", function () {
    // при изменении большего значения в input - меняем положение соответствующего элемента управления
    range.noUiSlider.set([null, this.value]);
  });
};

const init = () => {
  rangeSliderInit(); // запускаем функцию инициализации слайдера
};

window.addEventListener("DOMContentLoaded", init); // запускаем функцию init, когда документ будет загружен и готов к взаимодействию
// end rangeslider

$(".filter-style").styler();

// Страница catalog
// const counterText = document.querySelector(".card__counter-input");
// const counterBtn = document.querySelectorAll(".card__counter-arrow");
// let counter = 1;

// counterBtn.forEach((el, index) => {
//   el.addEventListener("click", () => {
//     if (index === 1 && counter > 1) {
//       counter--;
//     } else if (index === 0 && counter < 8) {
//       counter++;
//     }
//     counterText.textContent = counter;
//     setDisabled(counter);
//   });
// });

// function setDisabled(counter) {
//   if (counter === 1) {
//     counterBtn[1].disabled = true;
//   } else if (counter === 8) {
//     counterBtn[0].disabled = true;
//   } else {
//     counterBtn[1].disabled = false;
//     counterBtn[0].disabled = false;
//   }
// }

// ! Tabs
$(".tabs__link").on("click", function (e) {
  e.preventDefault();

  $($(this).siblings()).removeClass("tabs__link--active");

  $($(this).closest(".tabs-wrapper").siblings().find("li")).removeClass(
    "tabs__content--active"
  );

  $(this).addClass("tabs__link--active");
  $($(this).attr("href")).addClass("tabs__content--active");
});

const swiper = new Swiper(".popular__slider", {
  loop: true,
  observer: true,
  observeParents: true,
  watchOverflow: true,
  slidesPerView: 4,
  spaceBetween: 30,
  // speed: 800,
  // autoplay: {
  //   delay: 3000,
  //   disableOnInteraction: false,
  // },
  pagination: {
    el: ".popular__slider-dotts",
    clickable: true,
    dinamicBullets: true,
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      // spaceBetween: 40,
      // autoHeight: true,
    },

    600: {
      slidesPerView: 2,
    },

    885: {
      slidesPerView: 3,
      spaceBetween: 30,
    },

    1200: {
      slidesPerView: 4,
      spaceBetween: 30,
      // autoHeight: true,
    },
    on: {
      init: function (swiper) {},
    },
  },
});

const slider = document.querySelector(".sertificates__list");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

const mySiema = new Siema({
  selector: slider,
  perPage: 4,
  perPage: {
    570: 2,
    870: 3,
    1170: 4,
  },
  loop: true,
  duration: 1000,
  easing: "cubic-bezier(.17,.67,.32,1.34)",
});
next.addEventListener("click", onNextClick);
prev.addEventListener("click", onPrevClick);

function onNextClick() {
  mySiema.next();
}

function onPrevClick() {
  mySiema.prev();
}

const lightbox = new SimpleLightbox(".sertificates__item a", {
  // closeText: "&#128514;",
  fadeSpeed: 1000,
});

// AOS.init();
