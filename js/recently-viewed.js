import { createProductCard } from "./render-cards.js";
import { slider } from "./utils.js";

// Функция-шаблон для секции
function getSectionHTML(title, link) {
  return `
    <div class="container">
      <div class="popular__title-box">
        <h2 class="popular__title section-title">${title}</h2>
        <a class="popular__link-more buttons-more" href="${link}">Усі продукти </a>
      </div>
      <div class="popular__slider swiper products-card">
        <ul class="popular__list products-card__list swiper-wrapper"></ul>
        <div class="popular__slider-dotts dotts"></div>
      </div>
    </div>
  `;
}

// Универсальный рендер секции с карточками
function renderSection({ selector, title, link, products }) {
  const section = document.querySelector(selector);
  if (!section) return;

  section.innerHTML = getSectionHTML(title, link);

  const list = section.querySelector(".popular__list");
  products.forEach((product) => {
    list.innerHTML += createProductCard(product);
  });

  slider(); // Инициализация слайдера
}

// Рендер похожих товаров по материалу
function renderSimilarProducts(currentId, data) {
  const currentCard = data.find(
    (item) => Number(item.id) === Number(currentId)
  );
  if (!currentCard) return;

  const currentMaterial = currentCard.material;
  const matchingCards = data.filter(
    (item) => item.material === currentMaterial && item.id !== currentCard.id
  );

  if (!matchingCards.length) return;

  const section = document.createElement("section");
  section.classList.add("similar", "section", "popular");
  section.innerHTML = getSectionHTML("Схожі товари", "#");

  const list = section.querySelector(".popular__list");
  matchingCards.forEach((product) => {
    list.innerHTML += createProductCard(product);
  });

  const benefitsSection = document.querySelector(".benefits");
  if (benefitsSection) {
    benefitsSection.insertAdjacentElement("afterend", section);
  } else {
    console.warn(
      "Секция .benefits не найдена. Схожі товари не будут добавлены."
    );
  }
  slider();
}

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

// Выбор и рендер просмотренных товаров
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

      renderSection({
        selector: ".js-recently-viewed",
        title: "Ви нещодавно переглядали",
        link: "./catalog.html",
        products: sortedProducts,
      });

      //  Поиск и рендер похожих(по материалу) товаров
      const article = document.querySelector(".card-product__item");
      console.log("article", article);

      if (article) {
        const currentId = article.getAttribute("id");
        renderSimilarProducts(currentId, data);
        slider();
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке данных:", error);
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
