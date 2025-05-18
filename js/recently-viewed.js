import { createProductCard } from "./render-cards.js";
// import { renderSimilar } from "./render-similar.js";

export function saveRecentlyViewedId(id) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // Удаляем дубликаты по id
  viewed = viewed.filter((itemId) => itemId !== id);

  // Добавляем в начало
  viewed.unshift(id);

  // Ограничение: только последние 10 товаров
  if (viewed.length > 10) viewed = viewed.slice(0, 10);

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

export function renderRecentlyViewed() {
  const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]").map(
    Number
  );

  console.log("viewed", viewed);

  if (!viewed.length) return;

  fetch("./js/data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const productsToRender = data.filter((product) =>
        viewed.includes(product.id)
      );
      const sortedProducts = viewed
        .map((id) => productsToRender.find((p) => p.id === id))
        .filter(Boolean);

      const section = document.querySelector(".js-recently-viewed");
      if (!section) return;

      section.innerHTML = `
        <div class="container">
          <div class="popular__title-box">
            <h2 class="popular__title section-title">Ви нещодавно переглядали</h2>
            <a class="popular__link-more buttons-more" href="./catalog.html">Усі продукти </a>
          </div>
          <div class="popular__slider swiper products-card">
            <ul class="popular__list products-card__list swiper-wrapper"></ul>
            <div class="popular__slider-dotts dotts"></div>
          </div>
        </div>
      `;

      const list = section.querySelector(".popular__list");

      sortedProducts.forEach((product) => {
        list.innerHTML += createProductCard(product);
      });

      slider(); // Инициализация слайдера

      //  Поиск и рендер похожих(по материалу) товаров
      const article = document.querySelector(".card-product__item");
      console.log("article", article);

      const currentId = article.getAttribute("id");
      console.log("currentId ", currentId);

      fetch("./js/data/data.json")
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);

          const currentCard = data.find(
            (item) => Number(item.id) === Number(currentId)
          );
          console.log("currentCard", currentCard);

          const currentMaterial = currentCard.material;

          // Фильтруем карточки с таким же material
          const matchingCards = data.filter(
            (item) => item.material === currentMaterial
          );

          console.log("Карточки с таким же материалом:", matchingCards);

          const saleSection = document.createElement("section");
          saleSection.classList.add("similar", "section", "popular");
          saleSection.innerHTML = `
        <div class="container">
          <div class="popular__title-box">
            <h2 class="popular__title section-title">Схожі товари</h2>
            <a class="popular__link-more buttons-more" href="./sale.html">Усі продукти </a>
          </div>
          <div class="popular__slider swiper products-card">
            <ul class="popular__list products-card__list swiper-wrapper"></ul>
            <div class="popular__slider-dotts dotts"></div>
          </div>
        </div>
      `;

          const list = saleSection.querySelector(".popular__list");

          matchingCards.forEach((product) => {
            list.innerHTML += createProductCard(product);
          });

          // Вставляем секцию после .benefits
          const benefitsSection = document.querySelector(".benefits ");
          if (benefitsSection) {
            benefitsSection.insertAdjacentElement("beforebegin", saleSection);
          } else {
            console.warn(
              "Секция .benefits  не найдена. Акционные товары не будут добавлены."
            );
          }
          slider();
          // renderSimilar();
        })
        .catch((error) => {
          console.error("Ошибка при загрузке данных:", error);
        });
    });
}

export function waitForCardAndRenderViewed(retries = 10) {
  console.log("Проверяем наличие .card-product__item...");
  const card = document.querySelector(".card-product__item");
  if (card) {
    console.log(".card-product__item найден");

    renderRecentlyViewed(); // Вызов функции рендера
    // renderSimilar();
  } else if (retries > 0) {
    console.log(`Осталось попыток: ${retries}`);
    setTimeout(() => waitForCardAndRenderViewed(retries - 1), 200); // Ждем и пробуем снова
  } else {
    console.warn(
      "Элемент .card-product__item не найден после нескольких попыток"
    );
  }
}

export function slider() {
  if (document.querySelector(".popular__slider")) {
    const swiper = new Swiper(".popular__slider", {
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
