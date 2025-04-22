const productList = document.querySelector(".catalog__card-list");
const form = document.getElementById("aside-form");
const quantity = document.querySelector(".catalog__quantity");
console.log("form", form);

async function loadingData() {
  try {
    // Добавляем значок загрузки
    productList.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження даних...</p>
      </div>
    `;
    // Искусственная задержка для проверки анимации
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch("./js/data/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Убираем значок загрузки после загрузки данных
    productList.innerHTML = "";
    return data;
  } catch (err) {
    console.error("Ошибка загрузки данных", err);
    productList.innerHTML = "<p>Помилка завантаження даних</p>";
    return [];
  }
}

const data = await loadingData();
const filterData = [...data];
const perPage = 6; // Количество товаров на странице
let currentPage = 1;

console.log("data", data);

function renderProducts(data) {
  productList.innerHTML = "";

  if (data.length === 0) {
    quantity.textContent = `Товари не знайдені`;
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

  renderProducts(itemsToShow); // Рендерим только текущую страницу
  renderPagination(data); // Обновляем пагинацию
}

function renderPagination(data) {
  if (!data || !perPage) return;
  // Получаем контейнер для пагинации
  const paginationContainer = document.querySelector(".catalog__pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(data.length / perPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = ""; // скрываем пагинацию если одна страница
    return;
  }

  let html = "";

  // Кнопка «назад»
  html += `
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" href="#" data-page="${
        currentPage - 1
      }" aria-label="назад" ${currentPage === 1 ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        d="M7.23 1 1 7.23l6.23 6.228"></path>
                    </svg>
                    </a>
    </li>
  `;

  // Цифры страниц
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="pagination__item ${i === currentPage ? "active" : ""}">
        <a class="pagination__link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Кнопка «вперёд»
  html += `
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" href="#" data-page="${
        currentPage + 1
      }" aria-label="вперед" ${currentPage === totalPages ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        d="M.77 1 7 7.23.77 13.457"></path>
                    </svg>
      </a>
    </li>
  `;

  paginationContainer.innerHTML = html;

  // Назначаем обработчики
  paginationContainer.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = parseInt(e.currentTarget.dataset.page);
      if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderCurrentPage(data);
      }
    });
  });
}

// renderProducts(data);
// renderCurrentPage(data);

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
    </li>
  `
    )
    .join("");
}
// рендер Наличие
function productDetails(product) {
  const sizesMarkup = getSizesMarkup(product);
  const isAvailable = product.availability;
  const discount = product.discount || 0;

  return isAvailable
    ? `
    <ul class="card__choice">
      <li class="card__choice-item">
        <p class="card__choice-name">Розмір</p>
      </li>
      ${sizesMarkup}
    </ul>
    <div class="card__price-inner">
      <div class="counter-wrap card__counter counter-wrapper">
        <button class="card__counter-arrow card__counter-arrow--up" type="button" data-action="plus" aria-label="plus">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none">
            <path fill="currentColor" d="M4.178 1.186a1 1 0 0 1 1.644 0l3.287 4.745A1 1 0 0 1 8.287 7.5H1.713a1 1 0 0 1-.822-1.57l3.287-4.744Z"/>
          </svg>
        </button>
        <span class="card__counter-input" data-counter>1</span>
        <button class="card__counter-arrow card__counter-arrow--down" type="button" data-action="minus" aria-label="minus">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none">
            <path fill="currentColor" d="M5.822 6.814a1 1 0 0 1-1.644 0L.891 2.069A1 1 0 0 1 1.713.5h6.574a1 1 0 0 1 .822 1.57L5.822 6.813Z"/>
          </svg>
        </button>
      </div>
      ${
        product.discount > 0
          ? `<p class="card__price card__price--sale">${product.price} ₴</p>
            <span class="card__old-price text2">${(
              product.price /
              (1 - product.discount / 100)
            ).toFixed(0)} ₴</span>
            ${
              product.proviso
                ? `<span class="card__proviso">${product.proviso}</span>`
                : ""
            }`
          : `<p class="card__price">${product.price} ₴</p>`
      }
    </div>
    <div class="card__btn-box">
      <a class="card__btn buttons" href="#">У кошик</a>
      <a class="card__btn buttons" href="#">Детальніше</a>
    </div>
  `
    : `
    
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
        product.discount > 0 ? " products-card__img-link--sale" : ""
      }"
        href="#"
        ${product.discount > 0 ? `data-sale="-${product.discount}%"` : ""}>
        <picture>
          <source type="image/avif" srcset="${product.img}.avif">
          <source type="image/webp" srcset="${product.img}.webp">
          <img class="images-img" src="${
            product.img ? product.img + ".jpg" : "./images/default.jpg"
          }" loading="lazy" decoding="async" alt="${product.title}">
        </picture>
      </a>
    </div>
  `;
}
// рендера  описания
function renderProductDescriptions(product) {
  return `
    <div class="card__body">
      <a class="card__title-link" href="#">
        <h5 class="card__title title-h5">${product.title}</h5>
        <p class="card__name text2">${product.nameEn}</p>
      </a>
      <p class="card__descr">
        <span class="card__descr-bold">Опис: </span>${product.application}
      </p>
      <p class="card__descr">
        <span class="card__descr-bold">Характеристика: </span>${
          product.characteristics
        }
      </p>
      <p class="card__descr">
      <span class="card__descr-bold">Застосування:</span>
      ${Array.isArray(product.sphere) ? product.sphere.join(", ") : ""}
      </p>
      ${productDetails(product)}
    </div>`;
}
// рендер карточки
function getProductMarkup(product) {
  return `
  <article class="catalog__card card" id="product-${product.id}">
    ${renderProductImage(product)}
    ${renderProductDescriptions(product)}
  </article>
      `;
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

  // console.log(minPrice, maxPrice, brands, materials, characteristics, types);
  console.log(types);
  return { minPrice, maxPrice, brands, materials, characteristics, types };
}

// Фильтрация товаров
function filterProducts(data, form) {
  if (!data || !form) return;
  // Получаем значения фильтров

  // Получаем диапазон цен

  const { minPrice, maxPrice, brands, materials, characteristics, types } =
    getFilterValues(form);

  // Получаем выбранный материал

  const filtered = data.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    const matchesMaterial =
      !materials.length ||
      materials.some((materials) =>
        Array.isArray(product.material)
          ? product.material.some(
              (pm) => pm.toLowerCase() === materials.toLowerCase()
            )
          : product.material.toLowerCase() === materials.toLowerCase()
      );

    const matcheBrand =
      !brands.length ||
      brands.some((brands) =>
        Array.isArray(product.brand)
          ? product.brand.some(
              (br) => br.toLowerCase() === brands.toLowerCase()
            )
          : product.brand.toLowerCase() === brands.toLowerCase()
      );

    // console.log("matcheBrand", product.brand);

    const matchesCharacteristics =
      !characteristics.length ||
      characteristics.every((ch) =>
        product.characteristics
          .filter((characteristics) => typeof characteristics === "string") // ← фильтруем только строки
          .map((characteristics) => characteristics.toLowerCase())
          .includes(ch.toLowerCase())
      );

    const matchesType =
      !types.length ||
      types.some((types) => types.toLowerCase() === product.type.toLowerCase());

    // const matchesType = types.length ? types.includes(product.type) : true;

    return (
      matchesPrice &&
      matchesMaterial &&
      matchesCharacteristics &&
      matchesType &&
      matcheBrand
    );
  });

  // renderProducts(filtered);
  // Обновляем отображение товаров и пагинации
  renderCurrentPage(filtered);
}

const containerFiltres = document.querySelector(".selected-filters");

// Обновление отображения выбранных фильтров
function updateSelectedFilters() {
  if (!form) return; // Проверяем, существует ли форма

  if (!containerFiltres) {
    console.error("Элемент .selected-filters не найден в DOM");
    return;
  }

  containerFiltres.innerHTML = ""; // Очищаем контейнер
  // const selectedFiltersItem = document.querySelector(".selected-filters__item");

  const formData = new FormData(form);
  const fragment = document.createDocumentFragment();

  console.log("Создаем кнопку resetAll");
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
  fragment.appendChild(resetAll);
  // selectedFiltersItem.appendChild(resetAll);
  // containerFiltres.appendChild(selectedFiltersItem);

  // Проходим по всем выбранным фильтрам
  formData.forEach((value, key) => {
    if (key === "min" || key === "max") {
      if (value.trim() === "") return; // Пропускаем пустые значения
    }

    // Создаем кнопку для каждого фильтра
    const filterButton = createFilterButton(key, value);
    const selectedFiltersItem = document.createElement("li");
    console.log("selectedFiltersItem", selectedFiltersItem);
    selectedFiltersItem.className = "selected-filters__item";

    selectedFiltersItem.appendChild(filterButton);
    fragment.appendChild(selectedFiltersItem);
    // containerFiltres.appendChild(selectedFiltersItem);
  });
  containerFiltres.appendChild(fragment); // Добавляем новые элементы
  console.log("Фильтры обновлены");
}

// Удаление фильтра
function removeFilter(key, value) {
  const inputs = form.querySelectorAll(`[name="${key}"]`);
  if (inputs.length === 0) return;
  inputs.forEach((input) => {
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

// Инициализация
updateSelectedFilters();

// Инициализация данных и рендера
loadingData().then((data) => {
  renderCurrentPage(data); // Рендерим первую страницу
});
