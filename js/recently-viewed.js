import { createProductCard } from "./render-cards.js";
import { slider, getSectionHTML, renderProductSection } from "./utils.js";

import { filterRecentlyViewed } from "./utils.js";

export function waitForCardAndRenderViewed(retries = 10) {
  const card = document.querySelector(".card-product__item");
  if (card) {
    renderRecentlyViewed();
  } else if (retries > 0) {
    setTimeout(() => waitForCardAndRenderViewed(retries - 1), 200);
  } else {
    console.warn(
      "Элемент .card-product__item не найден после нескольких попыток"
    );
  }
}

// Универсальный рендер секции с карточками
// function renderSection({ selector, title, link, products }) {
//   let section = document.querySelector(selector);

//   // Если секции нет — создаём и вставляем перед .blog или .footer
//   if (!section) {
//     section = document.createElement("section");
//     section.className = `popular recently-viewed section ${selector.replace(
//       ".",
//       ""
//     )}`;
//     const blogSection = document.querySelector(".blog");
//     const footer = document.querySelector(".footer");
//     if (blogSection) {
//       // родитель.insertBefore(элемент, перед кем вставить);
//       blogSection.parentNode.insertBefore(section, blogSection);
//       console.log("blogSection", blogSection.parentNode);
//     } else if (footer) {
//       footer.parentNode.insertBefore(section, footer);
//     } else {
//       document.body.appendChild(section);
//     }
//   }

//   section.innerHTML = getSectionHTML(title, link);

//   const list = section.querySelector(".popular__list");
//   list.innerHTML = products.map(createProductCard).join("");
//   // products.forEach((product) => {
//   //   list.innerHTML += createProductCard(product);
//   // });

//   slider(); // Инициализация слайдера
// }

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
  if (!viewed.length) return;

  renderProductSection({
    filterFn: (item, data) => filterRecentlyViewed(data, viewed).includes(item),
    sectionTitle: "Ви нещодавно переглядали",
    sectionLink: "./catalog.html",
    insertAfterSelector: ".blog", // или ".footer"
    // чтобы сохранить порядок
    customSort: (products) => filterRecentlyViewed(products, viewed),
    selector: ".js-recently-viewed",
  });
  // export function renderRecentlyViewed() {
  //   const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]").map(
  //     Number
  //   );

  //   if (!viewed.length) return;

  //   fetch("./js/data/data.json")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const productsToRender = data.filter((product) =>
  //         viewed.includes(product.id)
  //       );
  //       const sortedProducts = viewed
  //         .map((id) => productsToRender.find((p) => p.id === id))
  //         .filter(Boolean);

  //       renderSection({
  //         selector: ".js-recently-viewed",
  //         title: "Ви нещодавно переглядали",
  //         link: "./catalog.html",
  //         products: sortedProducts,
  //       });

  //       //  Поиск и рендер похожих(по материалу) товаров
  //       const article = document.querySelector(".card-product__item");
  //       if (article) {
  //         const currentId = article.getAttribute("id");
  //         renderSimilarProducts(currentId, data);
  //         slider();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Ошибка при загрузке данных:", error);
  //     });
}
