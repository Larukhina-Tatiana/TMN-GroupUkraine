import { renderProductDescriptions } from "./product-descriptions.js"; //Рендер описания товара

import { initLazyImageFade } from "./lazy-image-fade.js";

import {
  getCategoryFromUrl,
  filterProductsByCategory,
} from "./category-filter.js";
import { defaultMin, defaultMax } from "./config.js"; // Импортируем min, max для слайдера цена
import { resetRangeSlider } from "./range-my.js"; // Импортируем функцию сброса слайдера

const productList = document.querySelector(".catalog__card-list");
const form = document.getElementById("aside-form");
const quantity = document.querySelector(".catalog__quantity");

// const defaultMin = 20;
// const defaultMax = 500;

const perPage = 6; // Количество товаров на странице
const itemsPerClick = 6; // Количество товаров, отображаемых при каждом клике
let itemsShown = 0; // Количество отображаемых товаров (по умолчанию равно perPage)

let currentPage = 1; // Текущая страница
let data = [];

function loadingData() {
  return fetch("./js/data/data.json").then((res) => {
    if (!res.ok) throw new Error("Не удалось загрузить товары");
    return res.json();
  });
}

// async function loadingData() {
//   try {
//     // Добавляем значок загрузки
//     productList.innerHTML = `<div class="loading-spinner">
//         <div class="spinner"></div>
//         <p>Завантаження даних...</p>
//       </div>`;
//     // Искусственная задержка для проверки анимации
//     // await new Promise((resolve) => setTimeout(resolve, 2000));

//     const response = await fetch("./js/data/data.json");
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const fetchedData = await response.json();
//     data = fetchedData; // Сохраняем данные в глобальную переменную `data`
//     // Убираем значок загрузки после загрузки данных
//     productList.innerHTML = "";

//     // Показываем кнопку "Показати ще", если данные успешно загружены
//     const showMoreButton = document.querySelector(".js-show-more");
//     if (fetchedData.length > 0) {
//       showMoreButton.style.opacity = "1";
//     }

//     return fetchedData;
//   } catch (err) {
//     console.error("Ошибка загрузки данных", err);
//     productList.innerHTML = "<p>Помилка завантаження даних</p>";
//     return [];
//   }
// }

// function handleProductClick(productId) {
//   window.location.href = `./page-card.html?productId=${productId}`;
// }

// Добавляем обработчик клика на карточки товаров
// linkDetails.addEventListener("click", (e) => {
//   const card = e.target.closest(".catalog__card");
//   if (card) {
//     const productId = card.id.replace("product-", "");
//     console.log("Клик по товару с ID:", productId);
//     handleProductClick(productId);
//   }
// });

// Рендер товаров
function renderProducts(data) {
  productList.innerHTML = "";

  if (data.length === 0) {
    quantity.textContent = "Товари не знайдені";
    return;
  }

  // Устанавливаем количество найденных товаров
  const fragment = document.createDocumentFragment();

  data.forEach((product) => {
    const selectedFiltersItem = document.createElement("li");
    selectedFiltersItem.className = "catalog__card-item";
    selectedFiltersItem.innerHTML = getProductMarkup(product);
    fragment.appendChild(selectedFiltersItem);
  });
  productList.appendChild(fragment);
}

function renderCurrentPage(data) {
  if (!data.length) {
    productList.innerHTML = "";
    quantity.textContent = "Товари не знайдені";
    renderPagination([]); // Обновляем пагинацию для пустого результата
    return;
  }
  quantity.textContent = `Знайдено товарів: ${data.length}`;

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const itemsToShow = data.slice(start, end);

  renderProducts(itemsToShow); // Рендерим только текущую страницу
  initLazyImageFade();
  renderPagination(data); // Обновляем пагинацию

  // Скрываем кнопку "Показати ще", якщо текущая страница последняя
  const showMoreButton = document.querySelector(".js-show-more");
  const totalPages = Math.ceil(data.length / perPage);
  if (currentPage === totalPages) {
    showMoreButton.style.opacity = "0";
  } else {
    showMoreButton.style.opacity = "1";
  }
}

function renderPagination(data) {
  if (!data || !perPage) return;

  // Получаем контейнер для пагинации
  const paginationContainer = document.querySelector(".catalog__pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(data.length / perPage); // Общее количество страниц

  if (totalPages <= 1) {
    paginationContainer.innerHTML = ""; // Скрываем пагинацию, если одна страница
    return;
  }

  let html = "";

  // Кнопка «назад»
  html += `
    <li class="pagination__item">
      <button class="pagination__link pagination__link--arrow" data-page="${
        currentPage > 1 ? currentPage - 1 : 1
      }" aria-label="назад" type="button" ${
    currentPage === 1 ? "disabled" : ""
  }>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            d="M7.23 1 1 7.23l6.23 6.228"></path>
        </svg>
      </button>
    </li>`;

  // Цифры страниц
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="pagination__item js-pagination ${
        i === currentPage ? "active" : ""
      }">
        <button class="pagination__link" type="button" data-page="${i}">${i}</button>
      </li>`;
  }

  // Кнопка «вперед»
  html += `
    <li class="pagination__item">
      <button class="pagination__link pagination__link--arrow"data-page="${
        currentPage < totalPages ? currentPage + 1 : totalPages
      }" aria-label="вперед" type="button" ${
    currentPage === totalPages ? "disabled" : ""
  }>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            d="M.77 1 7 7.23.77 13.457"></path>
        </svg>
      </button>
    </li>`;

  paginationContainer.innerHTML = html;

  // Назначаем обработчики
  paginationContainer.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = parseInt(e.currentTarget.dataset.page);
      if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderCurrentPage(data);

        // // Прокрутка к началу списка товаров
        // productList.scrollIntoView({ behavior: "smooth", block: "start" });
        // Прокрутка к началу списка товаров
        scrollToProductList();
      }
    });
  });
  addShowMoreButton(data); // Добавляем кнопку "Показать еще" после рендеринга пагинации
}

// Обработка событий формы

form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateSelectedFilters();
  filterProducts(data, form); // Обновляем товары, пагинацию и количество страниц
});

form.addEventListener("change", () => {
  updateSelectedFilters();
  $(form).find("input").trigger("refresh"); // Обновляем стилизованные элементы
  filterProducts(data, form); // Обновляем товары, пагинацию и количество страниц
});

// рендера изображения
function renderProductImage(product) {
  return `
    <div class="card__img-cover">
      
        <picture>
          <source type="image/avif" srcset="${product.img}@1x.avif 1x, ${
    product.img
  }@2x.avif 2x">
          <source type="image/webp" srcset="${product.img}@1x.webp 1x, ${
    product.img
  }@2x.webp 2x">
          <img class="images-img" src="${
            product.img ? product.img + "@1x.jpg" : "./images/default.jpg"
          }" loading="lazy" decoding="async" alt="${product.title}">
        </picture>

    </div>`;
}

// рендер карточки
function getProductMarkup(product) {
  return `
  <article class="catalog__card card${product.discount ? " card--sale" : ""}" ${
    product.discount ? `data-sale="-${product.discount}%"` : ""
  }" id="product-${product.id}" title="${product.title}">
    ${renderProductImage(product)}
    ${renderProductDescriptions(product, false, true)}
  </article>`;
}

// Сбор значений фильтров
function getFilterValues(form) {
  if (!form) return {};

  const formData = new FormData(form);

  // Получение диапазона цен
  const minPrice = parseFloat(formData.get("min")) || 0;
  const maxPrice = parseFloat(formData.get("max")) || Infinity;

  const discount = [...form.querySelectorAll('input[name="sale"]:checked')].map(
    (el) => el.value
  );
  console.log("discount", discount);

  // Получение выбранных материалов
  const materials = [
    ...form.querySelectorAll('input[name="material"]:checked'),
  ].map((el) => el.value);

  // Получение выбранных брендов
  const brands = [...form.querySelectorAll('input[name="brand"]:checked')].map(
    (el) => el.value
  );

  // Получение характерисик
  const characteristics = [
    ...form.querySelectorAll('input[name="characteristics"]:checked'),
  ].map((el) => el.value);

  // Получение типов
  const types = [...form.querySelectorAll('input[name="type"]:checked')].map(
    (el) => el.value
  );

  console.log(
    discount,
    minPrice,
    maxPrice,
    brands,
    materials,
    characteristics,
    types
  );
  // console.log(types);
  return {
    discount,
    minPrice,
    maxPrice,
    brands,
    materials,
    characteristics,
    types,
  };
}

// Фильтрация товаров
function filterProducts(products, filterForm) {
  if (!products || !filterForm) return;

  // Получаем значения фильтров
  const {
    discount,
    minPrice,
    maxPrice,
    brands,
    materials,
    characteristics,
    types,
  } = getFilterValues(filterForm);
  console.log(types);
  // / Проверяем, выбран ли фильтр "Акція" (чекбокс или параметр в URL)
  const urlParams = new URLSearchParams(window.location.search);
  const saleParam = urlParams.get("sale") || urlParams.get("filter");
  const saleChecked =
    !!form.querySelector('input[name="sale"]:checked') ||
    saleParam === "1" ||
    saleParam === "sale";

  // Сначала фильтруем только акционные товары, если фильтр активен
  let filteredProducts = products;
  if (saleChecked) {
    filteredProducts = filteredProducts.filter(
      (product) => product.discount > 0 && product.availability === true
    );
  }

  // Далее применяем остальные фильтры к уже отфильтрованным товарам
  filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    const matchesDiscount =
      !saleChecked || (product.discount > 0 && product.availability === true);

    const matchesMaterial =
      !materials.length ||
      materials.some((material) =>
        Array.isArray(product.material)
          ? product.material.some(
              (pm) => pm.toLowerCase() === material.toLowerCase()
            )
          : product.material.toLowerCase() === material.toLowerCase()
      );

    const matchesBrand =
      !brands.length ||
      brands.some((brand) =>
        Array.isArray(product.brand)
          ? product.brand.some((br) => br.toLowerCase() === brand.toLowerCase())
          : product.brand.toLowerCase() === brand.toLowerCase()
      );

    const matchesCharacteristics =
      !characteristics.length ||
      characteristics.every((ch) =>
        product.characteristics
          .filter((char) => typeof char === "string") // Фильтруем только строки
          .map((char) => char.toLowerCase())
          .includes(ch.toLowerCase())
      );

    const matchesType =
      !types.length ||
      types.some((type) => type.toLowerCase() === product.type.toLowerCase());

    return (
      matchesDiscount &&
      matchesPrice &&
      matchesMaterial &&
      matchesBrand &&
      matchesCharacteristics &&
      matchesType
    );
  });

  // Обновляем отображение товаров и пагинации
  renderCurrentPage(filteredProducts);
  // Добавляем кнопку "Показати ще", если это необходимо
  addShowMoreButton(filteredProducts);
}

const containerFiltres = document.querySelector(".selected-filters");

// Обновление отображения выбранных фильтров
function updateSelectedFilters() {
  // Проверяем, существуют ли данные и форма
  if (!form || !data || data.length === 0) return;

  if (!containerFiltres) {
    console.error("Элемент .selected-filters не найден в DOM");
    return;
  }
  // Очищаем контейнер
  containerFiltres.innerHTML = "";

  const formData = new FormData(form);
  const fragment = document.createDocumentFragment();

  // Проверяем, есть ли активные фильтры
  let hasActiveFilters = false;

  // --- Кнопка сброса "Акція" при фильтре из URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const saleParam = urlParams.get("sale") || urlParams.get("filter");
  if (saleParam === "1" || saleParam === "sale") {
    hasActiveFilters = true;
    const saleFilterItem = document.createElement("li");
    saleFilterItem.className = "selected-filters__item";
    const saleFilterBtn = document.createElement("button");
    saleFilterBtn.className = "selected-filters__button";
    saleFilterBtn.type = "button";
    saleFilterBtn.textContent = "Акція";
    saleFilterBtn.setAttribute("aria-label", "Скинути фільтр Акція");
    saleFilterBtn.setAttribute("title", "Скинути фільтр Акція");
    saleFilterBtn.addEventListener("click", () => {
      urlParams.delete("sale");
      urlParams.delete("filter");
      window.location.search = urlParams.toString();
    });
    saleFilterItem.appendChild(saleFilterBtn);
    fragment.appendChild(saleFilterItem);
  }
  // --- Конец блока ---

  // Проходим по всем выбранным фильтрам
  formData.forEach((value, key) => {
    // Не показываем фильтр min, если он равен defaultMin
    if (key === "min" && (value.trim() === "" || Number(value) === defaultMin))
      return;
    // Не показываем фильтр max, если он равен defaultMax
    if (key === "max" && (value.trim() === "" || Number(value) === defaultMax))
      return;

    // Пропускаем пустые значения
    if (value.trim() === "") return;

    hasActiveFilters = true;

    // Создаем кнопку для каждого фильтра
    const filterButton = createFilterButton(key, value);
    const selectedFiltersItem = document.createElement("li");

    selectedFiltersItem.className = "selected-filters__item";

    selectedFiltersItem.appendChild(filterButton);
    fragment.appendChild(selectedFiltersItem);
  });
  // Кнопка "Скинути всі" только если есть активные фильтры
  if (hasActiveFilters) {
    const resetAllItem = document.createElement("li");
    resetAllItem.className = "selected-filters__item";
    const resetAll = document.createElement("button");
    resetAll.className = "selected-filters__button";
    resetAll.setAttribute("type", "button");
    resetAll.textContent = "Скинути всі";
    resetAll.dataset.key = "reset";
    resetAll.dataset.value = "reset";
    resetAll.setAttribute("aria-label", "Скинути всі фільтри");
    resetAll.setAttribute("title", "Скинути всі фільтри");

    resetAll.addEventListener("click", () => {
      form.reset();
      resetRangeSlider();
      $(form).find("input").trigger("refresh");
      updateSelectedFilters();
      filterProducts(data, form);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("filter") || urlParams.has("sale")) {
        urlParams.delete("filter");
        urlParams.delete("sale");
        window.location.search = urlParams.toString();
        return;
      }
    });

    resetAllItem.appendChild(resetAll);
    fragment.insertBefore(resetAllItem, fragment.firstChild);
  }
  containerFiltres.appendChild(fragment); // Добавляем новые элементы
}

// Удаление фильтра
function removeFilter(key, value) {
  const inputs = form.querySelectorAll(`[name="${key}"]`);
  if (inputs.length === 0) return;
  inputs.forEach((input) => {
    if (input.type === "checkbox" || input.type === "radio") {
      if (input.value === value) {
        input.checked = false; // Сбрасываем чекбокс или радио-кнопку
      }
    } else if (input.type === "text" || input.type === "number") {
      if (input.value === value) {
        // Для min/max сбрасываем только соответствующее значение и обновляем слайдер
        const range = document.getElementById("range");
        const minInput = document.getElementById("min");
        const maxInput = document.getElementById("max");
        const defaultMin = 20;
        const defaultMax = 500;

        if (key === "min") {
          input.value = defaultMin;
          if (range && range.noUiSlider) {
            range.noUiSlider.set([defaultMin, maxInput.value || defaultMax]);
          }
        } else if (key === "max") {
          input.value = defaultMax;
          if (range && range.noUiSlider) {
            range.noUiSlider.set([minInput.value || defaultMin, defaultMax]);
          }
        } else {
          input.value = "";
        }
      }
    }
  });

  // Обновляем стилизованные элементы
  if ($(inputs).length) {
    $(inputs).trigger("refresh"); // Метод обновления для jquery.formstyler
    updateSelectedFilters(); // Обновляем отображение фильтров
    filterProducts(data, form); // Обновляем список товаров
  }

  // Обновляем отображение фильтров
  updateSelectedFilters();

  // Обновляем список товаров
  filterProducts(data, form);
  // Триггерим событие отправки формы, чтобы обновить фильтрацию
  form.dispatchEvent(new Event("submit"));
}

// Обновляем отображение фильтров при отправке формы
form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateSelectedFilters();
});

function createFilterButton(key, value) {
  // Создаем кнопку для каждого фильтра
  const filterButton = document.createElement("button");
  filterButton.className = "selected-filters__button";
  // Для фильтра "sale" с value "discount" показываем "Акція"
  // if (key === "sale" && value === "discount") {
  //   filterButton.textContent = "Акція";
  // } else {
  //   filterButton.textContent = `${value}`;
  // }
  filterButton.textContent = `${value}`;

  filterButton.dataset.key = key;
  filterButton.dataset.value = value;
  filterButton.setAttribute("type", "button");
  filterButton.setAttribute("aria-label", `Скинути фильтр ${value}`);
  filterButton.setAttribute("title", `Скинути фильтр ${value}`);

  // Добавляем обработчик для удаления фильтра
  filterButton.addEventListener("click", () => {
    removeFilter(key, value);
  });

  return filterButton;
}

function renderMoreProducts(data) {
  const fragment = document.createDocumentFragment();

  // Отображаем следующие itemsPerClick товаров
  const itemsToShow = data.slice(itemsShown, itemsShown + itemsPerClick);

  itemsToShow.forEach((product) => {
    const selectedFiltersItem = document.createElement("li");
    selectedFiltersItem.className = "catalog__card-item";
    selectedFiltersItem.innerHTML = getProductMarkup(product);
    fragment.appendChild(selectedFiltersItem);
  });

  productList.appendChild(fragment);

  // Обновляем количество отображенных товаров
  itemsShown += itemsToShow.length;

  // Скрываем кнопку, если все товары отображены
  if (itemsShown >= data.length) {
    const showMoreButton = document.querySelector(".js-show-more");
    if (showMoreButton) {
      showMoreButton.style.opacity = "0";
    }
  }
  initLazyImageFade();
  // Обновляем активную кнопку пагинации
  updatePaginationState(data);
}

function addShowMoreButton(data) {
  const showMoreButton = document.querySelector(".js-show-more");
  const showMoreWrap = document.querySelector(".show-more-wrap");
  if (showMoreWrap) {
    if (!data || data.length <= itemsPerClick) {
      showMoreWrap.style.display = "none";
    } else {
      showMoreWrap.style.display = "";
    }
  }
  if (!showMoreButton) return; // Если кнопки нет - выходим
  // Скрываем кнопку, если товаров меньше или равно itemsPerClick
  if (!data || data.length <= itemsPerClick || itemsShown >= data.length) {
    showMoreButton.style.opacity = "0";
    return;
  }

  // Показываем кнопку, если товаров больше itemsPerClick
  showMoreButton.style.opacity = "1";

  // Удаляем предыдущие обработчики, чтобы избежать дублирования
  showMoreButton.replaceWith(showMoreButton.cloneNode(true));
  const newShowMoreButton = document.querySelector(".js-show-more");

  newShowMoreButton.addEventListener("click", () => {
    renderMoreProducts(data);
  });
}

function updatePaginationState(data) {
  const paginationContainer = document.querySelector(".catalog__pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(data.length / itemsPerClick);
  const currentPage = Math.ceil(itemsShown / itemsPerClick);

  // Обновляем активное состояние кнопок пагинации
  paginationContainer
    .querySelectorAll(".js-pagination")
    .forEach((item, index) => {
      if (index + 1 === currentPage) {
        // console.log("index", index);
        // console.log("currentPage", currentPage);

        item.classList.add("active");
      }
      // else {
      //   item.classList.remove("active");
      // }
    });

  // Обновляем состояние кнопки "вперед"
  const nextButton = paginationContainer.querySelector(
    '.pagination__link[aria-label="вперед"]'
  );

  if (nextButton) {
    if (currentPage === totalPages) {
      nextButton.setAttribute("disabled", "true");
    } else {
      nextButton.removeAttribute("disabled");
    }
  }

  // Обновляем состояние кнопки "назад"
  const prevButton = paginationContainer.querySelector(
    '.pagination__link[aria-label="назад"]'
  );
  if (prevButton) {
    if (currentPage === 1) {
      prevButton.setAttribute("disabled", "true");
    } else {
      prevButton.removeAttribute("disabled");
    }
  }
}

// Прокрутка к началу списка товаров
export function scrollToProductList() {
  const topOffset = document.querySelector(".catalog__top").offsetHeight; // Высота фиксированного элемента
  const productListTop =
    productList.getBoundingClientRect().top + window.scrollY; // Позиция productList относительно документа

  window.scrollTo({
    top: productListTop - topOffset, // Учитываем высоту .catalog__top
    behavior: "smooth", // Плавная прокрутка
  });
}

// Инициализация отображения товаров с кнопкой "Показать ещё"
function initShowMore(data) {
  itemsShown = 0; // Сбрасываем количество отображенных товаров
  productList.innerHTML = ""; // Очищаем список товаров

  // Отображаем первые itemsPerClick товаров
  renderMoreProducts(data);
  initLazyImageFade();
  // Добавляем кнопку "Показать ещё", если товаров больше, чем itemsPerClick
  addShowMoreButton(data);
}

document.addEventListener("DOMContentLoaded", () => {
  loadingData().then((fetchedData) => {
    data = fetchedData;
    const urlParams = new URLSearchParams(window.location.search);
    const saleParam = urlParams.get("sale") || urlParams.get("filter");

    let filtered = data;

    // Если есть параметр "sale" или "filter=sale", фильтруем только акционные товары
    if (saleParam === "1" || saleParam === "sale") {
      filtered = data.filter(
        (item) => item.discount > 0 && item.availability === true
      );

      // Если у вас есть чекбокс "Акція", отмечаем его программно:
      const saleCheckbox = document.querySelector(
        'input[name="sale"][value="discount"]'
      );
      if (saleCheckbox) saleCheckbox.checked = true;
    } else {
      // Фильтрация по категории, если нет параметра "sale"
      const category = getCategoryFromUrl();
      filtered = filterProductsByCategory(data, category);
    }

    initShowMore(data); // Инициализируем отображение товаров с кнопкой "Показать ещё"
    renderCurrentPage(filtered); // Рендерим первую страницу
    initLazyImageFade();
    updateSelectedFilters(); // если есть фильтры
  });
});
