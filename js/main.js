// !Спойлер
// $(document).ready(function () {
//   $(".nav__item-linkbtn").click(function (event) {
//     $(this).toggleClass("active").next().slideToggle(300);
//   });
// });

$(".nav__linkbtn-arrow").on("click", function () {
  $(".nav__linkbtn-arrow").toggleClass("active");
  $(".nav__submenu-list").toggleClass("active");
});

$(".phone__arrow").on("click", function () {
  $(".phone__arrow").toggleClass("active");
  $(".phone__list").toggleClass("active");
});

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

if ($(window).width() < 890.99) {
  $(".lang").appendTo($(".nav__list"));
}

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
    // breakpoints: {
    //   320: {
    //     slidesPerView: 1,
    //     // spaceBetween: 40,
    //     // autoHeight: true,
    //   },

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

// if ($(window).width() < 570.01) {
//   $(".search__btn").appendTo($(".nav__list"));
// }

// открытие-закрытие заголовков footer__info-list
// $(".nav__linkbtn-arrow").on("click", function () {
//   $(this).next().slideToggle();
//   $(this).toggleClass("active");
// });
