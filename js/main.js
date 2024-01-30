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

if ($(window).width() < 825.01) {
  $(".lang").appendTo($(".nav__list"));
}
// if ($(window).width() < 570.01) {
//   $(".search__btn").appendTo($(".nav__list"));
// }

// открытие-закрытие заголовков footer__info-list
// $(".nav__linkbtn-arrow").on("click", function () {
//   $(this).next().slideToggle();
//   $(this).toggleClass("active");
// });
