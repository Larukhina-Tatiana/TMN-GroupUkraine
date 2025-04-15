const productList = document.querySelector(".catalog__card-list");
const form = document.getElementById("aside-form");
const quantity = document.querySelector(".catalog__quantity");
console.log("form", form);

async function loadingData() {
  try {
    const response = await fetch("./js/data/data.json");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Ошибка загрузки данных", err);
    return [];
  }
}

const data = await loadingData();
const filterData = [...data];

await loadingData();
console.log("data", data);

function renderProducts(data) {
  productList.innerHTML = "";

  quantity.textContent = `Представлено товарів: ${data.length}`;
  const fragment = document.createDocumentFragment();

  data.forEach((product) => {
    const li = document.createElement("li");
    li.className = "catalog__card-item";
    li.innerHTML = getProductMarkup(product);
    fragment.appendChild(li);
  });
  productList.appendChild(fragment);
}

renderProducts(data);

// Обработка событий формы

form.addEventListener("submit", (e) => {
  e.preventDefault();
  filterProducts(data, form);
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
        <button class="card__counter-arrow card__counter-arrow--up" data-action="plus" aria-label="plus">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none">
            <path fill="currentColor" d="M4.178 1.186a1 1 0 0 1 1.644 0l3.287 4.745A1 1 0 0 1 8.287 7.5H1.713a1 1 0 0 1-.822-1.57l3.287-4.744Z"/>
          </svg>
        </button>
        <span class="card__counter-input" data-counter>1</span>
        <button class="card__counter-arrow card__counter-arrow--down" data-action="minus" aria-label="minus">
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
// рендер карточки
function getProductMarkup(product) {
  return `
<li class="catalog__card-item">
  <article class="catalog__card card" id="product-${product.id}">
    <div class="card__img-cover">
      <a class="card__title-link${
        product.discount > 0 ? " products-card__img-link--sale" : ""
      }"
        href="#"
        ${product.discount > 0 ? `data-sale="-${product.discount}%"` : ""}>
        <picture>
          <source type="image/avif" srcset="${product.img}.avif">
          <source type="image/webp" srcset="${product.img}.webp ">
          <img class="images-img" src="
              ${product.img}.jpg" loading="lazy" decoding="async"
              alt="${product.title}">
        </picture>
      </a>
    </div>
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
        ${product.sphere}
      </p>

      ${productDetails(product)}
    </div>
  </article>
</li>
      `;
}

// Сбор значений фильтров
function getFilterValues(form) {
  if (!form) return {};
  // const form = document.getElementById("aside-form");
  const formData = new FormData(form);

  // Получение диапазона цен
  const minPrice = parseFloat(formData.get("min")) || 0;
  const maxPrice = parseFloat(formData.get("max")) || Infinity;

  // Получение выбранных материалов
  const materials = [
    ...form.querySelectorAll('input[name="material"]:checked'),
  ].map((el) => el.value);

  // Получение опудренности
  const characteristics = [
    ...form.querySelectorAll('input[name="characteristics"]:checked'),
  ].map((el) => el.value);

  // Получение типов
  const types = [...form.querySelectorAll('input[name="type"]:checked')].map(
    (el) => el.value
  );
  console.log("characteristics", characteristics);

  return { minPrice, maxPrice, materials, characteristics, types };
}

// Фильтрация товаров
function filterProducts(data, form) {
  const { minPrice, maxPrice, materials, characteristics, types } =
    getFilterValues(form);

  const filtered = data.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    const matchesMaterial = materials.length
      ? materials.some(
          (m) => m.toLowerCase() === product.material.toLowerCase()
        )
      : true;

    const matchesCharacteristics = characteristics.length
      ? characteristics.every((ch) =>
          product.characteristics
            .filter((c) => typeof c === "string") // ← фильтруем только строки
            .map((c) => c.toLowerCase())
            .includes(ch.toLowerCase())
        )
      : true;

    const matchesType = types.length ? types.includes(product.type) : true;

    return (
      matchesPrice && matchesMaterial && matchesCharacteristics && matchesType
    );
  });

  renderProducts(filtered);
}

// Отображение товаров
