function renderRecentlyViewed() {
  const key = "recentlyViewed";
  const viewed = JSON.parse(localStorage.getItem(key)) || [];

  if (!viewed.length) {
    document.querySelector(".popular.recently-viewed")?.classList.add("hidden");
    return;
  }

  const wrapper = document.querySelector(
    ".popular.recently-viewed .popular__list"
  );
  if (!wrapper) return;

  wrapper.innerHTML = ""; // очистка предыдущего

  viewed.forEach((product) => {
    const slide = document.createElement("div");
    slide.className = "popular__item swiper-slide products-card__item";

    slide.innerHTML = `
      <article class="products-card__box">
        <a class="products-card__img-link" href="${product.link}">
          <div class="products-card__img-cover">
            <img class="products-card__img" src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
        </a>
        <div class="products-card__body">
          <a class="products-card__title-link" href="${product.link}">
            <h3 class="products-card__title title-h3">${product.title}</h3>
          </a>
          <span class="products-card__price">${product.price} ₴</span>
        </div>
      </article>
    `;

    wrapper.appendChild(slide);
  });

  // Инициализация слайдера (если нужно)
  if (typeof Swiper !== "undefined") {
    if (window.recentlyViewedSlider) {
      window.recentlyViewedSlider.update();
    } else {
      window.recentlyViewedSlider = new Swiper(
        ".popular.recently-viewed .popular__slider",
        {
          slidesPerView: 2,
          spaceBetween: 16,
          navigation: {
            nextEl: ".popular.recently-viewed .popular__button--next",
            prevEl: ".popular.recently-viewed .popular__button--prev",
          },
          breakpoints: {
            768: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
          },
        }
      );
    }
  }
}

// Запуск при DOMContentLoaded
document.addEventListener("DOMContentLoaded", renderRecentlyViewed);
