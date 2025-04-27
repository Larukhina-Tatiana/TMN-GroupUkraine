const productList = document.querySelector(".catalog__card-list");
const form = document.getElementById("aside-form");
const quantity = document.querySelector(".catalog__quantity");

const perPage = 6; // Количество товаров на странице
const itemsPerClick = 6; // Количество товаров, отображаемых при каждом клике
let itemsShown = 0; // Количество отображаемых товаров (по умолчанию равно perPage)
console.log("itemsShown", itemsShown);
let currentPage = 1; // Текущая страница
let data = [];

async function loadingData() {
  try {
    // Добавляем значок загрузки
    productList.innerHTML = `<div class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження даних...</p>
      </div>`;
    // Искусственная задержка для проверки анимации
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch("./js/data/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fetchedData = await response.json();
    // Убираем значок загрузки после загрузки данных
    productList.innerHTML = "";

    // Показываем кнопку "Показати ще", если данные успешно загружены
    const showMoreButton = document.querySelector(".js-show-more");
    if (fetchedData.length > 0) {
      showMoreButton.style.opacity = "1";
    }

    return fetchedData;
  } catch (err) {
    console.error("Ошибка загрузки данных", err);
    productList.innerHTML = "<p>Помилка завантаження даних</p>";
    return [];
  }
}

console.log("data", data);

function renderProducts(data) {
  productList.innerHTML = "";

  if (data.length === 0) {
    quantity.textContent = "Товари не знайдені";
    return;
  }
  console.log("Кол товаров", data.length);
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
  console.log("renderCurrentPage", data);
  console.log("Кол", data.length);

  if (!data || data.length === 0) {
    productList.innerHTML = "<p>Товари не знайдені</p>";
    quantity.textContent = "Товари не знайдені";
    renderPagination([]); // Обновляем пагинацию для пустого результата
    return;
  }
  quantity.textContent = `Знайдено товарів: ${data.length}`;

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const itemsToShow = data.slice(start, end);
  console.log("currentPage", currentPage);

  renderProducts(itemsToShow); // Рендерим только текущую страницу
  initLazyImageFade();
  renderPagination(data); // Обновляем пагинацию

  // Скрываем кнопку "Показати ще", если текущая страница последняя
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
  // currentPage = Math.ceil(itemsShown / perPage); // Текущая страница
  console.log("currentPage", currentPage);
  console.log("totalPages", totalPages);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = ""; // Скрываем пагинацию, если одна страница
    return;
  }

  let html = "";

  // Кнопка «назад»
  html += `
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" href="#" data-page="${
        currentPage > 1 ? currentPage - 1 : 1
      }" aria-label="назад" ${currentPage === 1 ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            d="M7.23 1 1 7.23l6.23 6.228"></path>
        </svg>
      </a>
    </li>`;

  // Цифры страниц
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="pagination__item js-pagination ${
        i === currentPage ? "active" : ""
      }">
        <a class="pagination__link" href="#" data-page="${i}">${i}</a>
      </li>`;
  }

  // Кнопка «вперед»
  html += `
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" href="#" data-page="${
        currentPage < totalPages ? currentPage + 1 : totalPages
      }" aria-label="вперед" ${currentPage === totalPages ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            d="M.77 1 7 7.23.77 13.457"></path>
        </svg>
      </a>
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

        // Прокрутка к началу списка товаров
        productList.scrollIntoView({ behavior: "smooth", block: "start" });
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
  filterProducts(data, form); // Обновляем товары, пагинацию и количество страниц
});

// рендер Размер
function getSizesMarkup(product) {
  return product.size
    .map(
      (size, i) => `
    <li class="card__choice-item">
      <label class="card__choice-label">
        <input class="checkbox-style" type="checkbox" name="checkbox" ${
          i === 0 ? "checked" : ""
        }>
        <span class="checkbox-castom"></span>
        ${size}
      </label>
    </li>`
    )
    .join("");
}
// рендер Наличие
function productDetails(product) {
  const sizesMarkup = getSizesMarkup(product); // Генерация разметки размеров
  const isAvailable = product.availability; // Проверка наличия товара
  const discount = product.discount || 0; // Скидка, если есть
  //
  if (isAvailable) {
    return `
      <ul class="card__choice">
        <li class="card__choice-item">
          <p class="card__choice-name">Розмір</p>
        </li>
        ${sizesMarkup}
      </ul>
      <div class="card__price-inner">
        <div class="counter-wrap card__counter counter-wrapper">
          <button class="card__counter-arrow card__counter-arrow--up" type="button" data-action="plus" aria-label="plus">+</button>
          <span class="card__counter-input" data-counter>1</span>
          <button class="card__counter-arrow card__counter-arrow--down" type="button" data-action="minus" aria-label="minus">-</button>
        </div>
        ${
          discount > 0
            ? `
              <p class="card__price card__price--sale">${product.price} ₴</p>
              <span class="card__old-price text2">${(
                product.price /
                (1 - discount / 100)
              ).toFixed(0)} ₴</span>
              ${
                product.proviso
                  ? `<span class="card__proviso">${product.proviso}</span>`
                  : ""
              }
            `
            : `<p class="card__price">${product.price} ₴</p>`
        }
      </div>
      <div class="card__btn-box">
        <a class="card__btn buttons" href="#">У кошик</a>
        <a class="card__btn buttons" href="#">Детальніше</a>
      </div>
    `;
  }

  return `
    <p class="card__noavailability">Цього товару немає в наявності</p>
    <div class="card__btn-box">
      <a class="card__btn buttons" href="#">Детальніше</a>
    </div>
  `;
}
// рендера изображения
function renderProductImage(product) {
  return `
    <div class="card__img-cover">
      <a class="card__title-link${
        product.discount ? " products-card__img-link--sale" : ""
      }" href="#" ${
    product.discount ? `data-sale="-${product.discount}%"` : ""
  }>
        <picture>
          <source type="image/avif" srcset="${product.img}.avif">
          <source type="image/webp" srcset="${product.img}.webp">
          <img class="images-img" src="${
            product.img ? product.img + ".jpg" : "./images/default.jpg"
          }" loading="lazy" decoding="async" alt="${product.title}">
        </picture>
      </a>
    </div>`;
}
function initLazyImageFade() {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener("load", () => img.classList.add("loaded"));
    if (img.complete) img.classList.add("loaded");
  });
}
// рендера  описания
function renderProductDescriptions(product) {
  return `
    <div class="card__body">
      <a class="card__title-link" href="#">
        <h5 class="card__title title-h5">${product.title}</h5>
        <p class="card__name text2">${product.nameEn}</p>
      </a>
      <p class="card__descr"><span class="card__descr-bold">Опис: </span>${
        product.application
      }</p>
      <p class="card__descr"><span class="card__descr-bold">Характеристика: </span>${
        product.characteristics
      }</p>
      <p class="card__descr"><span class="card__descr-bold">Застосування: </span>${
        Array.isArray(product.sphere) ? product.sphere.join(", ") : ""
      }</p>
      ${productDetails(product)}
    </div>`;
}
// рендер карточки
function getProductMarkup(product) {
  return `
  <article class="catalog__card card" id="product-${product.id}">
    ${renderProductImage(product)}
    ${renderProductDescriptions(product)}
  </article>`;
}

// Сбор значений фильтров
function getFilterValues(form) {
  if (!form) return {};

  const formData = new FormData(form);

  // Получение диапазона цен
  const minPrice = parseFloat(formData.get("min")) || 0;
  const maxPrice = parseFloat(formData.get("max")) || Infinity;

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

  console.log(minPrice, maxPrice, brands, materials, characteristics, types);
  // console.log(types);
  return { minPrice, maxPrice, brands, materials, characteristics, types };
}

// Фильтрация товаров
function filterProducts(products, filterForm) {
  if (!products || !filterForm) return;

  // Получаем значения фильтров
  const { minPrice, maxPrice, brands, materials, characteristics, types } =
    getFilterValues(filterForm);

  // Фильтруем товары
  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

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
  if (!form || !data || data.length === 0) return; // Проверяем, существуют ли данные и форма

  if (!containerFiltres) {
    console.error("Элемент .selected-filters не найден в DOM");
    return;
  }

  containerFiltres.innerHTML = ""; // Очищаем контейнер

  const formData = new FormData(form);
  const fragment = document.createDocumentFragment();

  // Создаем <li> для кнопки "Скинути всі"

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
    const minInput = document.getElementById("min");
    const maxInput = document.getElementById("max");

    if (minInput) minInput.value = "20";
    if (maxInput) maxInput.value = "500";

    resetRangeSlider();
    $(form).find("input").trigger("refresh");
    updateSelectedFilters();
    filterProducts(data, form);
  });

  resetAllItem.appendChild(resetAll); // Добавляем кнопку в <li>
  fragment.appendChild(resetAllItem); // Добавляем <li> в фрагмент

  // Проходим по всем выбранным фильтрам
  formData.forEach((value, key) => {
    if (key === "min" || key === "max") {
      if (value.trim() === "") return; // Пропускаем пустые значения
    }

    // Создаем кнопку для каждого фильтра
    const filterButton = createFilterButton(key, value);
    const selectedFiltersItem = document.createElement("li");

    selectedFiltersItem.className = "selected-filters__item";

    selectedFiltersItem.appendChild(filterButton);
    fragment.appendChild(selectedFiltersItem);
  });
  containerFiltres.appendChild(fragment); // Добавляем новые элементы
  console.log("Фильтры обновлены");
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
        input.value = ""; // Очищаем текстовое поле или поле ввода числа
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

// Обновляем отображение фильтров при изменении формы
form.addEventListener("change", updateSelectedFilters);

form.addEventListener("change", () => {
  // Обновляем стилизованные элементы
  $(form).find("input").trigger("refresh");
});

// Обновляем отображение фильтров при отправке формы
form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateSelectedFilters();
});

function createFilterButton(key, value) {
  // Создаем кнопку для каждого фильтра
  const filterButton = document.createElement("button");
  filterButton.className = "selected-filters__button";
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
  console.log("perPage", perPage);
  console.log("itemsShown", itemsShown);
  console.log("itemsPerClick", itemsPerClick);
  console.log("itemsToShow", itemsToShow);

  itemsToShow.forEach((product) => {
    const selectedFiltersItem = document.createElement("li");
    selectedFiltersItem.className = "catalog__card-item";
    selectedFiltersItem.innerHTML = getProductMarkup(product);
    fragment.appendChild(selectedFiltersItem);
  });

  productList.appendChild(fragment);

  // Обновляем количество отображенных товаров
  itemsShown += itemsToShow.length;
  console.log("itemsShown", itemsShown);

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
  console.log("currentPage", currentPage);

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

// Пример вызова функции
loadingData().then((fetchedData) => {
  data = fetchedData; // Сохраняем загруженные данные
  initShowMore(data); // Инициализируем отображение товаров с кнопкой "Показать ещё"
  renderCurrentPage(data); // Рендерим первую страницу
  initLazyImageFade();
  updateSelectedFilters(); // Обновляем фильтры
});
