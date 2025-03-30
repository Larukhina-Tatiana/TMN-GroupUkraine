if (document.querySelector(".popular__slider")) {
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
}
