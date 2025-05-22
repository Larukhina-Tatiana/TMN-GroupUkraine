import { createProductCard } from "./render-cards.js";

// Получение данных из JSON
export async function fetchData() {
  const response = await fetch("./js/data/data.json");
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Ошибка данных:", errorText);
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }
  const data = await response.json();
  // console.log("Загруженные данные:", data); // Логирование данных
  return data;
}

//  функция фильтрации просмотренных товаров
export function filterRecentlyViewed(data, viewedIds) {
  // Сохраняет порядок просмотренных
  return viewedIds
    .map((id) => data.find((item) => item.id === id))
    .filter(Boolean);
}

/**
 * Фильтрация похожих товаров по материалу (исключая текущий товар)
 * @param {Array} data - массив всех товаров
 * @param {number|string} currentId - id текущего товара
 * @returns {Array} - массив похожих товаров
 */
export function filterSimilarByMaterial(data, currentId) {
  const currentCard = data.find(
    (item) => Number(item.id) === Number(currentId)
  );
  if (!currentCard) return [];
  const currentMaterial = currentCard.material;
  return data.filter(
    (item) =>
      item.material === currentMaterial && Number(item.id) !== Number(currentId)
  );
}

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

// Функция-шаблон для секции "акционных товаров", "просморенных товаров"
export function getSectionHTML(title, link) {
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

// Вставляем секцию после .about-us
export function insertAdjacentElement(selector, products) {
  console.log("selector", selector);
  console.log("products", products);

  const section = document.querySelector(selector);
  if (section) {
    // опорный элемент.insertAdjacentHTML(способ вставки, код для вставки);
    // опорный элемент.insertAdjacenElement(способ вставки, секция для вставки);
    section.insertAdjacentElement("afterend", products);
    // section.insertAdjacentHTML("afterend", products);
  } else {
    console.warn(
      `Секция ${selector} не найдена. Акционные товары не будут добавлены.`
    );
  }
}

export async function renderProductSection({
  filterFn,
  sectionTitle,
  sectionLink,
  insertAfterSelector,
  customSort,
  selector,
}) {
  try {
    const data = await fetchData();
    let items =
      typeof filterFn === "function"
        ? data.filter((item) => filterFn(item, data))
        : data;
    if (typeof customSort === "function") {
      items = customSort(items);
    }

    if (!items.length) {
      console.warn("Нет данных для отображения");
      return;
    }

    let section = document.querySelector(selector);
    console.log("selector", selector);

    if (!section) {
      section = document.createElement("section");
      section.className = `js-${selector.replace(
        ".",
        ""
      )} popular section ${selector.replace(".", "")}`;
      const afterElem = document.querySelector(insertAfterSelector);
      console.log("afterElem", afterElem);

      if (afterElem) {
        afterElem.insertAdjacentElement("afterend", section);
      } else {
        const afterElem = document.querySelector(".main");
        afterElem.insertAdjacentElement("beforeend", section);
      }
    }

    section.innerHTML = getSectionHTML(sectionTitle, sectionLink);
    const list = section.querySelector(".popular__list");
    list.innerHTML = items.map(createProductCard).join("");

    if (items.length > 4) {
      slider();
    }
  } catch (error) {
    console.error("Ошибка при рендеринге:", error);
  }
}
