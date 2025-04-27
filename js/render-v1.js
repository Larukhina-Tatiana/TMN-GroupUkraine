// Получаем элементы
const productList = document.querySelector(".catalog__card-list");
const form = document.getElementById("aside-form");
const quantity = document.querySelector(".catalog__quantity");
const showMoreButton = document.querySelector(".js-show-more");
const paginationContainer = document.querySelector(".catalog__pagination");

const perPage = 6; // Товаров на одной странице
const itemsPerClick = 6; // Сколько добавлять при клике "Показати ще"
let currentPage = 1;
let itemsShown = 0;
let allData = [];
let filteredData = [];

// Загрузка данных
async function loadData() {
  try {
    productList.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження даних...</p>
      </div>`;
    const response = await fetch("./js/data/data.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("Данные загружены:", data);
    return data;
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
    productList.innerHTML = "<p>Помилка завантаження даних</p>";
    return [];
  }
}

// Рендер товаров
function renderProducts(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((product) => {
    const item = document.createElement("li");
    item.className = "catalog__card-item";
    item.innerHTML = getProductMarkup(product);
    item.style.opacity = "0"; // Начальная прозрачность для анимации
    fragment.appendChild(item);
  });
  productList.appendChild(fragment);

  // Плавная анимация появления товаров
  requestAnimationFrame(() => {
    productList
      .querySelectorAll(".catalog__card-item")
      .forEach((item, index) => {
        setTimeout(() => (item.style.opacity = "1"), index * 100);
      });
  });
}

// Разметка товара
function getProductMarkup(product) {
  return `
    <article class="catalog__card card" id="product-${product.id}">
      ${renderProductImage(product)}
      ${renderProductDescriptions(product)}
    </article>
  `;
}

// Разметка изображения товара
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

// Разметка описания товара
function renderProductDescriptions(product) {
  return `
    <div class="card__body">
      <a class="card__title-link" href="#">
        <h5 class="card__title title-h5">${product.title}</h5>
        <p class="card__name text2">${product.nameEn}</p>
      </a>
      <p class="card__descr"><span class="card__descr-bold">Опис:</span> ${
        product.application
      }</p>
      <p class="card__descr"><span class="card__descr-bold">Характеристика:</span> ${
        product.characteristics
      }</p>
      <p class="card__descr"><span class="card__descr-bold">Застосування:</span> ${
        Array.isArray(product.sphere) ? product.sphere.join(", ") : ""
      }</p>
      ${productDetails(product)}
    </div>`;
}

// Детали товара
function productDetails(product) {
  if (!product.availability) {
    return `
      <p class="card__noavailability">Цього товару немає в наявності</p>
      <div class="card__btn-box">
        <a class="card__btn buttons" href="#">Детальніше</a>
      </div>`;
  }

  const sizeMarkup = product.size
    .map(
      (size, i) => `
    <li class="card__choice-item">
      <label class="card__choice-label">
        <input class="checkbox-style" type="checkbox" name="checkbox" ${
          i === 0 ? "checked" : ""
        }>
        <span class="checkbox-castom"></span> ${size}
      </label>
    </li>`
    )
    .join("");

  return `
    <ul class="card__choice">
      <li class="card__choice-item"><p class="card__choice-name">Розмір</p></li>
      ${sizeMarkup}
    </ul>
    <div class="card__price-inner">
      ${
        product.discount
          ? `
        <p class="card__price card__price--sale">${product.price} ₴</p>
        <span class="card__old-price text2">${(
          product.price /
          (1 - product.discount / 100)
        ).toFixed(0)} ₴</span>`
          : `<p class="card__price">${product.price} ₴</p>`
      }
    </div>
    <div class="card__btn-box">
      <a class="card__btn buttons" href="#">У кошик</a>
      <a class="card__btn buttons" href="#">Детальніше</a>
    </div>`;
}

// Обновление количества товаров
function updateQuantityText(total) {
  quantity.textContent = `Знайдено товарів: ${total} (показано ${Math.min(
    itemsShown,
    total
  )})`;
}

// Рендер текущей страницы
function renderCurrentPage(data) {
  productList.innerHTML = "";
  const toShow = data.slice(0, itemsShown);
  renderProducts(toShow);
  updateQuantityText(data.length);
  renderPagination(data.length);

  // Скрываем кнопку "Показати ще" если все товары отображены
  showMoreButton.style.display =
    itemsShown >= data.length ? "none" : "inline-block";
}

// Рендер пагинации
function renderPagination(totalItems) {
  paginationContainer.innerHTML = "";
  const pages = Math.ceil(totalItems / perPage);

  for (let i = 1; i <= pages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `pagination__item js-pagination ${
      i <= Math.ceil(itemsShown / perPage) ? "active" : ""
    }`;
    pageItem.innerHTML = `<a class="pagination__link" href="#" data-page="${i}">${i}</a>`;
    paginationContainer.appendChild(pageItem);
  }

  paginationContainer.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = +e.currentTarget.dataset.page;
      itemsShown = currentPage * perPage;
      renderCurrentPage(filteredData);

      window.scrollTo({ top: productList.offsetTop - 50, behavior: "smooth" });
    });
  });
}

// Фильтрация товаров
function applyFilters() {
  const formData = new FormData(form);
  const minPrice = parseFloat(formData.get("min")) || 0;
  const maxPrice = parseFloat(formData.get("max")) || Infinity;
  const brands = [...form.querySelectorAll('input[name="brand"]:checked')].map(
    (el) => el.value
  );
  const materials = [
    ...form.querySelectorAll('input[name="material"]:checked'),
  ].map((el) => el.value);
  const types = [...form.querySelectorAll('input[name="type"]:checked')].map(
    (el) => el.value
  );

  filteredData = allData.filter((product) => {
    const priceOk = product.price >= minPrice && product.price <= maxPrice;
    const brandOk = !brands.length || brands.includes(product.brand);
    const materialOk =
      !materials.length || materials.includes(product.material);
    const typeOk = !types.length || types.includes(product.type);
    return priceOk && brandOk && materialOk && typeOk;
  });

  console.log("Фильтрованная выборка:", filteredData);
  itemsShown = perPage;
  renderCurrentPage(filteredData);
}

// Кнопка "Показати ще"
function setupShowMoreButton() {
  showMoreButton.addEventListener("click", () => {
    itemsShown += itemsPerClick;
    renderCurrentPage(filteredData);
  });
}

// Слушатели формы
form.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
});
form.addEventListener("change", applyFilters);

// Инициализация
(async function init() {
  allData = await loadData();
  filteredData = [...allData];
  itemsShown = perPage;
  renderCurrentPage(filteredData);
  setupShowMoreButton();
})();
