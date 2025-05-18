export function slider() {
  if (document.querySelector(".popular__slider")) {
    new Swiper(".popular__slider", {
      loop: true,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: ".popular__slider-dotts",
        clickable: true,
      },
      breakpoints: {
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
        },
      },
    });
  } else {
    console.error("Элемент .popular__slider не найден");
  }
}
