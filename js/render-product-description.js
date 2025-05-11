import { renderProductDescriptions } from "./product-descriptions.js"; //Рендер описания товара
import { createBreadcrumbs } from "./breadcrumbs.js";
import { initLazyImageFade } from "./lazy-image-fade.js";
import { initZoomEffect } from "./zoom-img.js"; // Импорт функции для увеличения изображения

// import { slider } from "./slider.js"; // путь зависит от структуры проекта

// import GLightbox from "glightbox";
// import { ImageSlide } from "glightbox/plugins";

async function fetchData() {
  const response = await fetch("./js/data/data.json");
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Ошибка данных:", errorText);
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
      renderUsageStorageInfo(product); // Рендерим информацию о применении и хранении
      initTabs(); // Инициализация переключения табов
      connectingСertificates(product); // Подключение сертификатов
      saveRecentlyViewedId(productId); // Сбор данных о товаре
      // renderRecentlyViewed(); // Рендер недавно просмотренных товаров
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
  const isSale = product.discount > 0;
  container.innerHTML = `
    <h2 class="visually-hidden">${product.title}</h2>
    <article class="card-product__item${
      isSale ? " products-card__img-link--sale" : ""
    }" ${isSale ? `data-sale="-${product.discount}%"` : ""} id="${product.id}">
    ${renderProductImage(product)}
    ${renderProductDescriptions(product, true, false)}
    </article>
  `;
  // Вызов функции для увеличения изображения
  initZoomEffect();

  function insertContentAfterTitle(container, html) {
    const titleElement = container.querySelector(".tabs__content-title");
    if (titleElement) {
      titleElement.insertAdjacentHTML("afterend", html);
    } else {
      console.error("Элемент .tabs__content-title не найден");
    }
  }

  // Вставляем сгенерированный HTML в нужный элемент
  const generalInformation = document.getElementById("tabs-product-1");
  if (generalInformation) {
    insertContentAfterTitle(
      generalInformation,
      generateGeneralInformation(product)
    );
  } else {
    console.error(
      "Элемент li.tabs__content-item.card-product__tabs-content.tabs__content--active#tabs-product-1 не найден"
    );
  }

  // Вставляем сгенерированный HTML в нужный элемент
  const additionalInfoContainer = document.getElementById("tabs-product-2");
  if (additionalInfoContainer) {
    insertContentAfterTitle(
      additionalInfoContainer,
      generateAdditionalInfo(product)
    );
  } else {
    console.error("Элемент li #tabs-product-2 не найден");
  }
}

// рендера изображения
function renderProductImage(product) {
  return `
    <div class="card-product__img-cover js-wrapper">
        <picture>
        <source type="image/avif" srcset="
              ${product.galery}@1x.avif 1x,
              ${product.galery}@2x.avif 2x">
          <source type="image/webp" srcset="
              ${product.galery}@1x.webp 1x,
              ${product.galery}@2x.webp 2x">
          <img class="card-product__img js-zoom" src="${product.galery}@1x.jpg" loading="lazy" decoding="async" alt="${product.title}">
        </picture>
      </div>`;
}

// Функция генерации текста для блока "Опис"
function generateGeneralInformation(product) {
  if (!product.generalInformation) {
    console.error("Данные для generalInformation отсутствуют");
    return "<p>Опис недоступний</p>";
  }

  // Генерация HTML-кода для блока "Опис"
  return `
      <dl class="card-product__list">
        <div class="card-product__list-desc">
          <dt>Тип:</dt>
          <dd>${product.generalInformation.type}</dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Матеріал:</dt>
          <dd>${product.generalInformation.material}</dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Пудра:</dt>
          <dd>${product.generalInformation.powder}</dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Колір:</dt>
          <dd>${product.generalInformation.color}</dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Дизайн:</dt>
          <dd>${product.generalInformation.design}</dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Упаковка:</dt>
          <dd>${product.generalInformation.packaging}</dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Медичний виріб:</dt>
          <dd>
            ${product.generalInformation.medicalProduct}
          </dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Засіб індивідуального захисту:</dt>
          <dd>
            ${product.generalInformation.ppe}
          </dd>
        </div>
        <div class="card-product__list-desc">
          <dt>Гарантія якості:</dt>
          <dd>
            ${product.generalInformation.qualityGuarantee}
          </dd>
        </div>
      </dl>
  `;
}
// Функция генерации текста для блока "Додаткова інформація"
function generateAdditionalInfo(product) {
  if (
    !product.additionalInformation ||
    !product.additionalInformation.measurementLocations
  ) {
    console.error("Данные для additionalInformation отсутствуют");
    return "<p>Додаткова інформація недоступна</p>";
  }

  // Генерация HTML-кода для блока "Додаткова інформація"
  return `
      <div class="tabs__content-item-thickness">
        <dl class="card-product__list">
          <div class="card-product__list-desc">
            <dt>Локації вимірювань</dt>
            <dd>Товщина стінки (мм)</dd>
          </div>
          ${product.additionalInformation.measurementLocations
            .map(
              (location) => `
              <div class="card-product__list-desc">
                <dt>${location.location}</dt>
                <dd>${location.thickness}</dd>
              </div>`
            )
            .join("")}
        </dl>
        <img src="./images/page-card/DHD-Double-Gloving-System-Latex-Sterile.png"
          alt="images DHD-Double-Gloving-System-Latex-Sterile">
      </div>
  `;
}

function renderUsageStorageInfo(product) {
  const usageStorageContainer = document.getElementById("tabs-product-3");

  if (usageStorageContainer) {
    const usageStorageHTML = generateUsageStorageInfo(product);
    usageStorageContainer.innerHTML = usageStorageHTML;
  } else {
    console.error(
      "Элемент li.tabs__content-item.card-product__tabs-content#tabs-product-3 не найден"
    );
  }
}

// Функция генерации текста для блока "Застосування / Зберігання"
function generateUsageStorageInfo(product) {
  if (!product.usageAndStorage) {
    console.error("Данные для usageAndStorage отсутствуют");
    return "<p>Інформація недоступна</p>";
  }

  const { usage, storage, warnings, description } = product.usageAndStorage;

  // Генерация HTML для массива `usage`
  const usageHTML = usage
    .map(
      (item) => `
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr">${item}</p>
      </li>`
    )
    .join("");

  // Генерация HTML для массива `storage`
  const storageHTML = storage
    .map(
      (item) => `
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr">${item}</p>
      </li>`
    )
    .join("");

  // Генерация HTML для массива `warnings`
  const warningsHTML = warnings
    .map(
      (item) => `
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr">${item}</p>
      </li>`
    )
    .join("");

  // Генерация HTML для строки `description`
  const descriptionHTML = `
    <li class="tabs__content-application-item">
      <p class="tabs__content-application-descr">${description}</p>
    </li>
  `;

  // Возвращаем общий HTML
  return `
    <ul class="tabs__content-application">
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr title-h5">Застосування</p>
      </li>
      ${usageHTML}
    </ul>
    <ul class="tabs__content-application">
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr title-h5">Зберігання</p>
      </li>
      ${storageHTML}
    </ul>
    <ul class="tabs__content-application">
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr title-h5">Попередження</p>
      </li>
      ${warningsHTML}
    </ul>
    <ul class="tabs__content-application">
      <li class="tabs__content-application-item">
        <p class="tabs__content-application-descr title-h5">Опис</p>
      </li>
      ${descriptionHTML}
    </ul>
  `;
}

// Функция инициализации табов
function initTabs() {
  document
    .querySelector(".card-product__tabs")
    .addEventListener("click", (e) => {
      if (e.target.classList.contains("tabs__link")) {
        const tab = e.target.dataset.tab;

        document
          .querySelectorAll(".tabs__link")
          .forEach((btn) => btn.classList.toggle("active", btn === e.target));

        document
          .querySelectorAll(".tabs__content-item")
          .forEach((content) =>
            content.classList.toggle("active", content.id.endsWith(tab))
          );
      }
    });
}

// Подключение сертификатов

let lightboxInstance = null;
let siemaInstance = null;

function connectingСertificates(product) {
  const sertificatesContainer = document.querySelector(".sertificates__list");

  if (!sertificatesContainer) {
    console.error("Элемент .sertificates__list не найден");
    return;
  }

  if (!product.sertificates || product.sertificates.length === 0) {
    sertificatesContainer.innerHTML = "<p>Сертифікати відсутні</p>";
    return;
  }

  const sertificatesHTML = product.sertificates
    .map(
      (sertificat) => `
        <div class="sertificates__item">
          <a class="sertificates__link glightbox"
            href="${sertificat}-large.jpg"
            data-gallery="certs"
          >
            <picture>
              <source type="image/avif" srcset="${sertificat}.avif">
              <source type="image/webp" srcset="${sertificat}.webp">
              <img class="images__img" src="${sertificat}.jpg" loading="lazy" decoding="async" alt="сертифікат якості">
            </picture>
          </a>
        </div>`
    )
    .join("");

  updateCertificatesSlider(sertificatesHTML);
}

function updateCertificatesSlider(newHTML) {
  const container = document.querySelector(".sertificates__list");

  // Удаляем старые инстансы
  if (siemaInstance) {
    siemaInstance.destroy(true);
    siemaInstance = null;
  }
  if (lightboxInstance) {
    lightboxInstance.destroy();
    lightboxInstance = null;
  }

  container.innerHTML = newHTML;

  // init Siema и GLightbox
  requestAnimationFrame(() => {
    // Инициализация Siema
    siemaInstance = new Siema({
      selector: ".sertificates__list",
      perPage: {
        570: 2,
        870: 3,
        1170: 4,
      },
      duration: 300,
      loop: false, // Убедитесь, что loop отключен, если вы хотите управлять кнопками
      easing: "cubic-bezier(.17,.67,.32,1.34)",
    });

    // Обновляем кнопки после инициализации Siema
    setTimeout(() => {
      updateButtonState();
    }, 0);

    document.querySelector(".next").addEventListener("click", () => {
      siemaInstance.next();
      updateButtonState(); // Обновляем состояние кнопок
    });

    document.querySelector(".prev").addEventListener("click", () => {
      siemaInstance.prev();
      updateButtonState(); // Обновляем состояние кнопок
    });

    // Инициализация GLightbox
    lightboxInstance = GLightbox({
      // plugins: [
      //   new ImageSlide({
      //     maxWidth: "90vw", // или '1200px'
      //   }),
      // ],
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      zoomable: true,
      skin: "clean",
      slideEffect: "fade",
      openEffect: "zoom",
      closeEffect: "zoom",
      onOpen: () => {
        const total = document.querySelectorAll(
          '[data-gallery="certs"]'
        ).length;

        updateCounter(1, total);
        // Подключаем обработчики кнопок после открытия
        observeSlideChanges(lightboxInstance); // передаем экземпляр// <- следим за изменением слайдов
      },
      onClose: () => {
        const galleryCounter = document.querySelector(".glightbox-counter");
        if (galleryCounter) {
          galleryCounter.remove(); // Удаляем контейнер из DOM
        }
      },
    });
  });
}

function updateCounter(current = 1, total = 1) {
  current = Number(current);
  total = Number(total);

  let counter = document.querySelector(".glightbox-counter");
  if (!counter) {
    counter = document.createElement("div");
    counter.className = "glightbox-counter";
    Object.assign(counter.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "#fff",
      fontSize: "16px",
      background: "rgba(0, 0, 0, 0.7)",
      padding: "6px 12px",
      borderRadius: "8px",
      zIndex: "1199999",
    });
    document.body.appendChild(counter);
  }
  counter.textContent = `${current} / ${total}`;
}

function observeSlideChanges(lightboxInstance) {
  const gallery = document.querySelector(".glightbox-container");
  if (!gallery) {
    console.warn("GLightbox контейнер не найден");
    return;
  }

  const observer = new MutationObserver(() => {
    const slides = document.querySelectorAll(".gslide");
    const currentSlide = [...slides].find((slide) =>
      slide.classList.contains("current")
    );
    const index = [...slides].indexOf(currentSlide);

    if (index !== -1) {
      updateCounter(index + 1, slides.length);
    }
  });

  observer.observe(gallery, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  // Отключить observer при закрытии лайтбокса
  lightboxInstance.on("close", () => {
    observer.disconnect();
  });
}

function updateButtonState() {
  const prevButton = document.querySelector(".sertificates__btn.prev");
  const nextButton = document.querySelector(".sertificates__btn.next");

  // if (!prevButton || !nextButton || !siemaInstance) {
  //   console.warn("Кнопки или слайдер не найдены");
  //   return;
  // }
  if (!prevButton || !nextButton) {
    console.warn("Кнопки или слайдер не найдены");
    return;
  }
  if (!siemaInstance) {
    console.warn("SiemaInstance не найдены");
    return;
  }

  const currentIndex = siemaInstance.currentSlide;
  const totalSlides = siemaInstance.innerElements.length;

  // Получаем ширину окна и определяем perPage для текущего размера
  const windowWidth = window.innerWidth;
  let perPage = 1;
  if (windowWidth >= 1170) {
    perPage = 4;
  } else if (windowWidth >= 870) {
    perPage = 3;
  } else if (windowWidth >= 570) {
    perPage = 2;
  }

  const lastVisibleIndex = totalSlides - perPage;

  // Обновляем состояния кнопок
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex >= lastVisibleIndex;
}

// Автоматически собираем данные из DOM
document.addEventListener("DOMContentLoaded", () => {
  waitForCardAndRenderViewed();
});

function waitForCardAndRenderViewed(retries = 10) {
  console.log("Проверяем наличие .card-product__item...");
  const card = document.querySelector(".card-product__item");
  if (card) {
    console.log(".card-product__item найден");
    renderRecentlyViewed(); // Вызов функции рендера
  } else if (retries > 0) {
    console.log(`Осталось попыток: ${retries}`);
    setTimeout(() => waitForCardAndRenderViewed(retries - 1), 200); // Ждем и пробуем снова
  } else {
    console.warn(
      "Элемент .card-product__item не найден после нескольких попыток"
    );
  }
}

function renderRecentlyViewed() {
  console.log("renderRecentlyViewed");
  // Приводим к строкам, если id в data.json строковые
  const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]").map(
    Number
  );

  console.log("viewed", viewed);
  if (!viewed.length) return;

  fetch("./js/data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const productsToRender = data.filter((product) =>
        viewed.includes(product.id)
      );
      console.log("productsToRender", productsToRender);

      // Сохраняем порядок отображения
      const sortedProducts = viewed
        .map((id) => productsToRender.find((p) => p.id === id))
        .filter(Boolean);
      console.log("sortedProducts", sortedProducts);

      const section = document.querySelector(".js-recently-viewed");

      if (!section) return;

      section.innerHTML = `
        <div class="container">
          <div class="popular__title-box">
            <h2 class="popular__title section-title">Ви нещодавно переглядали</h2>
            <a class="popular__link-more buttons-more" href="#">Усі продукти </a>
          </div>
          <div class="popular__slider swiper products-card">
            <ul class="popular__list products-card__list swiper-wrapper"></ul>
            <div class="popular__slider-dotts dotts"></div>
          </div>
        </div>
      `;

      const list = section.querySelector(".popular__list");

      sortedProducts.forEach((product) => {
        console.log("product", product);
        const item = document.createElement("li");
        item.className = "popular__item swiper-slide products-card__item";
        item.innerHTML = `
    <article class="products-card__box" id="${product.id}">
      <a class="products-card__img-link" href="#">
      <div class="products-card__img-cover">
        <picture>
          <source type="image/avif" srcset="${product.img}@1x.avif 238w, ${
          product.img
        }@2x.avif 476w">
          <source type="image/webp" srcset="${product.img}@1x.webp 238w, ${
          product.img
        }@2x.webp 476w">
          <img class="products-card__img" src="${
            product.img ? product.img + "@1x.jpg" : "./images/default.jpg"
          }" loading="lazy" decoding="async" alt="${product.title}">
        </picture>
      </div>
      </a>

  <div class="products-card__body">
                    <a class="products-card__title-link" href="${product.link}">
                      <h3 class="products-card__title title-h3"
                        title=${product.title}>
                        ${product.title}
                      </h3>
                    </a>

                    <p class="products-card__text">
                    ${product.application || ""}
                    </p>

${
  product.discount > 0
    ? `
              <p class="products-card__price card__price--sale">${
                product.price
              } ₴
              <span class="card__old-price text2">${(
                product.price /
                (1 - product.discount / 100)
              ).toFixed(0)} ₴</span>
              ${
                product.proviso
                  ? `<span class="card__proviso">${product.proviso}</span>`
                  : ""
              }</p>
            `
    : `<p class="products-card__price">${product.price} ₴</p>`
}
</div>
<a class="products-card__btn buttons" href="${product.link}">
  Детальніше
</a>
                </article>
              </div>      
    `;
        list.appendChild(item);
        slider(); // 👉 запускаем слайдер
      });
    });
}
// Сохраняем просмотренные ID
function saveRecentlyViewedId(id) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // Удаляем дубликаты по id
  viewed = viewed.filter((itemId) => itemId !== id);

  // Добавляем в начало
  viewed.unshift(id);

  // Ограничение: только последние 10 товаров
  if (viewed.length > 10) viewed = viewed.slice(0, 10);

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

const productId = document.querySelector(".card-product__item")?.id;
if (productId) {
  saveRecentlyViewedId(productId);
}

function slider() {
  if (document.querySelector(".popular__slider")) {
    const swiper = new Swiper(".popular__slider", {
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
