if (document.querySelector(".nav__linkbtn-arrow")) {
  $(".nav__linkbtn-arrow").on("click", function () {
    $(".nav__linkbtn-arrow").toggleClass("active");
    $(".nav__submenu-list").toggleClass("active");
  });
}
if (document.querySelector(".phone__arrow")) {
  $(".phone__arrow").on("click", function () {
    $(".phone__arrow").toggleClass("active");
    $(".phone__list").toggleClass("active");
  });
}

if (document.querySelector(".lang")) {
  new TransferElements({
    sourceElement: document.querySelector(".lang"), // что переносим
    breakpoints: {
      890: {
        targetElement: document.querySelector(".nav__inner"), // куда переносим
        targetPosition: 1,
      },
    },
  });
}

if (document.querySelector(".menu__btn")) {
  const btn = document.querySelector(".menu__btn");
  const nav = document.querySelector(".nav__inner");

  btn.addEventListener("click", () => {
    nav.classList.toggle("menu-open");
    btn.classList.toggle("menu-open");
  });
}
if (document.querySelector("[data-modal-search]")) {
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
}

// page-basket
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
if (document.querySelector(".tabs__link")) {
  $(".tabs__link").on("click", function (e) {
    e.preventDefault();

    $($(this).siblings()).removeClass("tabs__link--active");

    $($(this).closest(".tabs-wrapper").siblings().find("li")).removeClass(
      "tabs__content--active"
    );

    $(this).addClass("tabs__link--active");
    $($(this).attr("href")).addClass("tabs__content--active");
  });
}

if (document.querySelector(".sertificates__list")) {
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
}

if (document.querySelector('input[type="tel"]')) {
  const telSelector = document.querySelector('input[type="tel"]');
  const inputMask = new Inputmask("+380 (99) 999-99-99");
  inputMask.mask(telSelector);
}
AOS.init();
