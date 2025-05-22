import { filterRecentlyViewed, renderProductSection } from "./utils.js";

/**
 * Универсальный "ожидатель" появления .card-product__item и вызова нужного рендера
 * @param {Function} callback - функция, которую нужно вызвать после появления .card-product__item
 * @param {number} retries - количество попыток
 */
export function waitForCardAndRenderViewed(
  callback = renderRecentlyViewed,
  retries = 10
) {
  const card = document.querySelector(".card-product__item");
  if (card) {
    callback();
  } else if (retries > 0) {
    setTimeout(() => waitForCardAndRenderViewed(callback, retries - 1), 200);
  } else {
    console.warn(
      "Элемент .card-product__item не найден после нескольких попыток"
    );
  }
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
  if (!viewed.length) return;

  renderProductSection({
    filterFn: (item, data) => filterRecentlyViewed(data, viewed).includes(item),
    sectionTitle: "Ви нещодавно переглядали",
    sectionLink: "./catalog.html",
    insertAfterSelector: ".blog", // или ".footer"
    // чтобы сохранить порядок
    customSort: (products) => filterRecentlyViewed(products, viewed),
    selector: ".recently-viewed",
  });
}
