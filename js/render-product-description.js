import { createBreadcrumbs } from "./breadcrumbs.js";
import { renderProductDescriptions } from "./product-descriptions.js"; //Рендер описания товара
import { productDetails } from "./product-details.js";
import { initLazyImageFade } from "./lazy-image-fade.js";

async function fetchData() {
  const response = await fetch("./js/data/data.json");
  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }
  return await response.json();
}

function getProductFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("productId"); // Извлекаем значение параметра productId
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const productId = getProductFromUrl(); // Получаем productId из URL
    const data = await fetchData(); // Загружаем данные
    const product = data.find((item) => item.id === parseInt(productId)); // Ищем товар по productId

    if (product) {
      createBreadcrumbs(product); // Создание хлебных крошек
      renderProductDescriptionFull(product); // Рендерим описание
      initLazyImageFade(); // Инициализация ленивой загрузки изображенийтовара
    } else {
      console.error("Товар не найден");
      const container = document.querySelector(".card-product");
      container.innerHTML = "<p>Товар не найден</p>"; // Сообщение об ошибке
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
});

// Функция рендера описания товара
function renderProductDescriptionFull(product) {
  const container = document.querySelector(".card-product__container");
  container.innerHTML = `
    <h2 class="visually-hidden">${product.title}</h2>
    <article class="card-product__item" id="${product.id}">
    ${renderProductImage(product)}
    ${renderProductDescriptions(product, true, false)}
    </article>
  `;

  // initTabs(); // Инициализация переключения табов
}

// рендера изображения
function renderProductImage(product) {
  return `
    <div class="card-product__img-cover">
        <picture>
          <source srcset="${product.galery[0]}" type="image/webp">
          <img class="card-product__img" src="${product.galery[1]}" loading="lazy" decoding="async" alt="${product.title}">
        </picture>
      </div>`;
}

// Функция генерации текста для блока "Додаткова інформація"
// function generateAdditionalInfo() {
//   return `
//     <strong>Локації вимірювань:</strong><br>
//     <ul>
//       <li>Пальці (15 мм від крайньої точки): 0.16 ± 0.03 мм</li>
//       <li>Долоня (середина долоні): 0.14 ± 0.03 мм</li>
//       <li>Манжета (25 мм від краю манжети): 0.11 ± 0.03 мм</li>
//     </ul>
//     <strong>Розміри і параметри:</strong><br>
//     <p>Різні розміри рукавичок, вага, ширина долоні та довжина згідно стандартів.</p>
//     <p>Деталізовані артикули та стандарти відповідності CE, EN, ASTM.</p>
//   `;
// }

// Функция генерации текста для блока "Застосування / Зберігання"
// function generateUsageStorageInfo() {
//   return `
//     <strong>Застосування:</strong><br>
//     <ul>
//       <li>Як засоби індивідуального захисту для стоматології, діагностичних процедур.</li>
//       <li>Не застосовувати повторно або при пошкодженні рукавички.</li>
//       <li>Не носити більше 2 годин без перерви.</li>
//     </ul>
//     <strong>Зберігання:</strong><br>
//     <ul>
//       <li>Термін придатності – 3 роки.</li>
//       <li>Зберігати при температурі до 40°C, уникати контакту з озоном і маслянистими речовинами.</li>
//     </ul>
//     <strong>Попередження:</strong><br>
//     <p>Натуральний латекс може викликати алергію. У разі алергії використовувати синтетичні рукавички.</p>
//   `;
// }

// Функция инициализации табов
// function initTabs() {
//   const tabButtons = document.querySelectorAll(".tab-button");
//   const tabContents = document.querySelectorAll(".tab-content");

//   tabButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       const tab = button.getAttribute("data-tab");

//       tabButtons.forEach((btn) => btn.classList.remove("active"));
//       button.classList.add("active");

//       tabContents.forEach((content) => {
//         if (content.id === tab) {
//           content.classList.add("active");
//         } else {
//           content.classList.remove("active");
//         }
//       });
//     });
//   });
// }

// Загружаем данные при загрузке страницы
// document.addEventListener("DOMContentLoaded", fetchProductData);
