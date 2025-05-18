import { createProductCard } from "./render-cards.js";
import { slider } from "./recently-viewed.js";

console.log("render-sale.js подключен");

// Функция для получения данных из JSON файла
async function fetchData() {
  const response = await fetch("./js/data/data.json");
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Ошибка данных:", errorText);
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }
  const data = await response.json();
  console.log("Загруженные данные:", data); // Логирование данных
  return data;
}

async function renderSale() {
  try {
    const data = await fetchData();
    const saleItems = data.filter(
      (item) => item.discount > 0 && item.availability === true
    );

    if (!saleItems || saleItems.length === 0) {
      console.warn("Нет данных для отображения");
      return;
    }

    const saleSection = document.createElement("section");
    saleSection.classList.add("promotion", "section", "popular");
    saleSection.innerHTML = `
      <div class="container">
        <div class="popular__title-box">
          <h2 class="popular__title section-title">Акційні товари</h2>
          <a class="popular__link-more buttons-more" href="./sale.html">Усі продукти </a>
        </div>
<p class="promotional__text">
            Vulputate volutpat libero eget leo sollicitudin lorem blandit. Morbi ipsum pulvinar sed in tincidunt lectus.
            Consequat
            sodales eget est sagittis. Turpis gravida elit metus, at convallis nibh.
          </p>
        <div class="popular__slider swiper products-card">
          <ul class="popular__list products-card__list swiper-wrapper"></ul>
          <div class="popular__slider-dotts dotts"></div>
        </div>
      </div>
    `;

    const list = saleSection.querySelector(".popular__list");

    saleItems.forEach((product) => {
      list.innerHTML += createProductCard(product);
    });

    // Вставляем секцию после .about-us
    const footerSection = document.querySelector(".footer");
    if (footerSection) {
      footerSection.insertAdjacentElement("beforebegin", saleSection);
    } else {
      console.warn(
        "Секция .about-us не найдена. Акционные товары не будут добавлены."
      );
    }

    slider(); // Инициализация слайдера
  } catch (error) {
    console.error("Ошибка при рендеринге:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderSale();
});
