import { renderProductSection } from "./utils.js";

console.log("render-sale.js подключен");

/**
 * Универсальный рендер секции товаров
 * @param {Object} options
 * @param {Function} options.filterFn - функция-фильтр для товаров в utils.js
 * @param {string} options.sectionTitle - заголовок секции
 * @param {string} options.sectionLink - ссылка "Усі продукти"
 * @param {string} options.insertAfterSelector - селектор, после которого вставлять секцию
 */

// Рендер секции акционных товаров
// async function renderProductSection({
//   filterFn,
//   sectionTitle,
//   sectionLink,
//   insertAfterSelector,
// }) {
//   try {
//     const data = await fetchData();
//     const items = typeof filterFn === "function" ? data.filter(filterFn) : data;

//     if (!items.length) {
//       console.warn("Нет данных для отображения");
//       return;
//     }

//     const sectionCreate = document.createElement("section");
//     sectionCreate.classList.add("promotion", "section", "popular");
//     sectionCreate.innerHTML = getSectionHTML(sectionTitle, sectionLink);
//     const list = sectionCreate.querySelector(".popular__list");
//     list.innerHTML = items.map(createProductCard).join("");
//     // saleItems.forEach((product) => {
//     //   list.innerHTML += createProductCard(product);
//     // });

//     // Вставляем секцию после .
//     insertAdjacentElement(insertAfterSelector, sectionCreate);

//     slider(); // Инициализация слайдера
//   } catch (error) {
//     console.error("Ошибка при рендеринге:", error);
//   }
// }

// Вызов для акционных товаров
document.addEventListener("DOMContentLoaded", () => {
  renderProductSection({
    filterFn: (item) => item.discount > 0 && item.availability === true,
    sectionTitle: "Акційні товари",
    sectionLink: "./catalog.html?filter=sale",
    insertAfterSelector: ".about-us",
    selector: ".sale",
  });
});
