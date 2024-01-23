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
