const productList = document.querySelector(".catalog__card-list");
const form = document.getElementById("aside-form");
const quantity = document.querySelector(".catalog__quantity");
const paginationContainer = document.querySelector(".catalog__pagination");
const selectedFiltersContainer = document.querySelector(".selected-filters");
const showMoreButton = document.querySelector(".js-show-more");

const perPage = 6;
const itemsPerClick = 6;
let currentPage = 1;
let itemsShown = 0;
let fullData = [];
let filteredData = [];

async function loadingData() {
  try {
    productList.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження даних...</p>
      </div>`;
    const response = await fetch("./js/data/data.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    productList.innerHTML = "";
    return data;
  } catch (err) {
    console.error("Ошибка загрузки данных", err);
    productList.innerHTML = "<p>Помилка завантаження даних</p>";
    return [];
  }
}

// Рендер товаров с анимацией
function renderProducts(products) {
  const fragment = document.createDocumentFragment();
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.className = "catalog__card-item animate-item";
    li.style.animationDelay = `${index * 100}ms`;
    li.innerHTML = getProductMarkup(product);
    fragment.appendChild(li);
  });
  productList.appendChild(fragment);
}

// Рендер страницы
function renderCurrentPage(data) {
  if (!data.length) {
    productList.innerHTML = "<p>Товари не знайдені</p>";
    quantity.textContent = "Товари не знайдені";
    paginationContainer.innerHTML = "";
    return;
  }
  quantity.textContent = `Знайдено товарів: ${data.length}`;

  const start = 0;
  const end = itemsShown || perPage;
  const itemsToShow = data.slice(0, end);
  productList.innerHTML = "";
  renderProducts(itemsToShow);
  renderPagination(data);
  if (itemsShown >= data.length) showMoreButton.style.display = "none";
}

// Рендер пагинации
function renderPagination(data) {
  paginationContainer.innerHTML = "";
  if (data.length <= perPage) return;

  const totalPages = Math.ceil(data.length / perPage);
  const activePages = Math.ceil(itemsShown / perPage) || 1;

  let html = `
    <li class="pagination__item">
      <button class="pagination__link" data-action="prev" ${
        currentPage === 1 ? "disabled" : ""
      }>Назад</button>
    </li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="pagination__item js-pagination ${
        i <= activePages ? "active" : ""
      }">
        <button class="pagination__link" data-page="${i}">${i}</button>
      </li>`;
  }

  html += `
    <li class="pagination__item">
      <button class="pagination__link" data-action="next" ${
        currentPage === totalPages ? "disabled" : ""
      }>Вперед</button>
    </li>`;

  paginationContainer.innerHTML = html;

  paginationContainer.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = parseInt(e.currentTarget.dataset.page);
      itemsShown = currentPage * perPage;
      renderCurrentPage(filteredData);
      productList.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  paginationContainer.querySelectorAll("[data-action]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = e.currentTarget.dataset.action;
      if (action === "prev" && currentPage > 1) currentPage--;
      if (action === "next" && currentPage < totalPages) currentPage++;
      itemsShown = currentPage * perPage;
      renderCurrentPage(filteredData);
      productList.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Кнопка "Показати ще"
function handleShowMore() {
  itemsShown += itemsPerClick;
  renderCurrentPage(filteredData);
  productList.lastElementChild.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}

// Сбор значений фильтров
function getFilterValues(form) {
  const formData = new FormData(form);
  const minPrice = parseFloat(formData.get("min")) || 0;
  const maxPrice = parseFloat(formData.get("max")) || Infinity;
  const materials = [
    ...form.querySelectorAll('input[name="material"]:checked'),
  ].map((el) => el.value);
  const brands = [...form.querySelectorAll('input[name="brand"]:checked')].map(
    (el) => el.value
  );
  const characteristics = [
    ...form.querySelectorAll('input[name="characteristics"]:checked'),
  ].map((el) => el.value);
  const types = [...form.querySelectorAll('input[name="type"]:checked')].map(
    (el) => el.value
  );

  return { minPrice, maxPrice, brands, materials, characteristics, types };
}

// Фильтрация товаров
function filterProducts(data, form) {
  const { minPrice, maxPrice, brands, materials, characteristics, types } =
    getFilterValues(form);

  return data.filter((product) => {
    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    const materialMatch =
      !materials.length ||
      materials.some((m) =>
        Array.isArray(product.material)
          ? product.material.includes(m)
          : product.material === m
      );
    const brandMatch = !brands.length || brands.includes(product.brand);
    const charMatch =
      !characteristics.length ||
      characteristics.every((ch) => product.characteristics.includes(ch));
    const typeMatch = !types.length || types.includes(product.type);

    return priceMatch && materialMatch && brandMatch && charMatch && typeMatch;
  });
}

// Вывод активных фильтров
function updateSelectedFilters() {
  selectedFiltersContainer.innerHTML = "";
  const formData = new FormData(form);

  if (![...formData].length) return;

  const resetAllBtn = createFilterButton("Скинути всі", "reset");
  selectedFiltersContainer.appendChild(resetAllBtn);

  formData.forEach((value, key) => {
    if (value && key !== "min" && key !== "max") {
      const btn = createFilterButton(value, key);
      selectedFiltersContainer.appendChild(btn);
    }
  });
}

// Создание кнопок фильтра
function createFilterButton(label, key) {
  const btn = document.createElement("button");
  btn.className = "selected-filters__button";
  btn.textContent = label;
  btn.dataset.key = key;
  btn.addEventListener("click", () => {
    if (key === "reset") {
      form.reset();
    } else {
      const input = form.querySelector(`[name="${key}"][value="${label}"]`);
      if (input) input.checked = false;
    }
    $(form).find("input").trigger("refresh");
    applyFilters();
  });
  return btn;
}

// Применение фильтров
function applyFilters() {
  itemsShown = perPage;
  filteredData = filterProducts(fullData, form);
  updateSelectedFilters();
  renderCurrentPage(filteredData);
}

function getProductMarkup(product) {
  return `
    <article class="catalog__card card" id="product-${product.id}">
      ${renderProductImage(product)}
      ${renderProductDescriptions(product)}
    </article>`;
}

// Рендер изображения товара
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

// Рендер описания товара
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

// Дополнительные детали товара (цена, кнопки)
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
// ----------------- Запуск -----------------

loadingData().then((loadedData) => {
  fullData = loadedData;
  filteredData = fullData;
  itemsShown = perPage;
  renderCurrentPage(filteredData);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
});

form.addEventListener("change", () => {
  applyFilters();
});

showMoreButton.addEventListener("click", handleShowMore);
