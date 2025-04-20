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

console.log("data", data);

function renderProducts(data) {
  productList.innerHTML = "";

  if (data.length === 0) {
    quantity.textContent = `Товари не знайдені`;
    return;
  }

  quantity.textContent = `Знайдено товарів: ${data.length}`;

  const fragment = document.createDocumentFragment();

  data.forEach((product) => {
    const selectedFiltersItem = document.createElement("li");
    selectedFiltersItem.className = "catalog__card-item";
    selectedFiltersItem.innerHTML = getProductMarkup(product);
    fragment.appendChild(selectedFiltersItem);
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
            product.img
          }.jpg || './images/default.jpg'}" loading="lazy" decoding="async" alt="${
    product.title
  }">
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

  console.log(minPrice, maxPrice, brands, materials, characteristics, types);
  return { minPrice, maxPrice, brands, materials, characteristics, types };
}

// Фильтрация товаров
function filterProducts(data, form) {
  // Получаем значения фильтров
  if (!form) return;
  // Получаем диапазон цен

  const { minPrice, maxPrice, brands, materials, characteristics, types } =
    getFilterValues(form);

  // Получаем выбранный материал

  const filtered = data.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    console.log("matchesPrice", matchesPrice);

    const matchesMaterial =
      !materials.length ||
      materials.some((m) =>
        Array.isArray(product.material)
          ? product.material.some((pm) => pm.toLowerCase() === m.toLowerCase())
          : product.material.toLowerCase() === m.toLowerCase()
      );

    const matcheBrand =
      !brands.length ||
      brands.some((b) =>
        Array.isArray(product.brand)
          ? product.brand.some((br) => br.toLowerCase() === b.toLowerCase())
          : product.brand.toLowerCase() === b.toLowerCase()
      );

    // console.log("matcheBrand", product.brand);

    const matchesCharacteristics =
      !characteristics.length ||
      characteristics.every((ch) =>
        product.characteristics
          .filter((c) => typeof c === "string") // ← фильтруем только строки
          .map((c) => c.toLowerCase())
          .includes(ch.toLowerCase())
      );

    const matchesType =
      !types.length ||
      types.some((t) => t.toLowerCase() === product.type.toLowerCase());

    // const matchesType = types.length ? types.includes(product.type) : true;

    return (
      matchesPrice &&
      matchesMaterial &&
      matchesCharacteristics &&
      matchesType &&
      matcheBrand
    );
  });

  renderProducts(filtered);
}

const containerFiltres = document.querySelector(".selected-filters");
console.log("containerFiltres", containerFiltres);

// Обновление отображения выбранных фильтров
function updateSelectedFilters() {
  containerFiltres.innerHTML = ""; // Очищаем контейнер
  const selectedFiltersItem = document.querySelector(".catalog__card-item");
  const formData = new FormData(form);

  const resetAll = document.createElement("button");
  resetAll.className = "selected-filters__button";
  resetAll.className = "selected-filters__button";
  resetAll.setAttribute("type", "button");
  resetAll.textContent = "Скинути всі";
  resetAll.dataset.key = "reset";
  resetAll.dataset.value = "reset";
  resetAll.addEventListener("click", () => {
    form.reset();
    // Устанавливаем значения по умолчанию
    document.getElementById("min").value = "20";
    document.getElementById("max").value = "500";
    resetRangeSlider();
    $(form).find("input").trigger("refresh"); // Обновляем стилизованные элементы
    updateSelectedFilters(); // Вызываем только один раз
    filterProducts(data, form); // Обновляем список товаров
  });
  // selectedFiltersItem.appendChild(resetAll);
  // containerFiltres.appendChild(selectedFiltersItem);

  // Проходим по всем выбранным фильтрам
  formData.forEach((value, key) => {
    if (key === "min" || key === "max") {
      if (value.trim() === "") return; // Пропускаем пустые значения
    }

    // Создаем кнопку для каждого фильтра
    const selectedFiltersItem = document.createElement("li");
    selectedFiltersItem.className = "selected-filters__item";
    console.log("selectedFiltersItem", selectedFiltersItem);

    const filterButton = createFilterButton(key, value);
    selectedFiltersItem.appendChild(filterButton);

    containerFiltres.appendChild(selectedFiltersItem);
  });
}

// Удаление фильтра
function removeFilter(key, value) {
  const inputs = form.querySelectorAll(`[name="${key}"]`);

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
  }

  // Обновляем отображение фильтров
  updateSelectedFilters();

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

  // Добавляем обработчик для удаления фильтра
  filterButton.addEventListener("click", () => {
    removeFilter(key, value);
  });

  return filterButton;
}

// Инициализация
updateSelectedFilters();
