import { createProductCard } from "./render-cards.js";
// import { slider } from "./recently-viewed.js";

export function renderSimilar(matchingCards) {
  console.log("matchingCards", matchingCards);

  const saleSection = document.createElement("section");
  saleSection.classList.add("similar", "section", "popular");
  saleSection.innerHTML = `
        <div class="container">
          <div class="popular__title-box">
            <h2 class="popular__title section-title">Схожі товари</h2>
            <a class="popular__link-more buttons-more" href="./sale.html">Усі продукти </a>
          </div>
          <div class="popular__slider swiper products-card">
            <ul class="popular__list products-card__list swiper-wrapper"></ul>
            <div class="popular__slider-dotts dotts"></div>
          </div>
        </div>
      `;

  const list = saleSection.querySelector(".popular__list");

  matchingCards.forEach((product) => {
    list.innerHTML += createProductCard(product);
  });

  // Вставляем секцию после .benefits
  const benefitsSection = document.querySelector(".benefits ");
  if (benefitsSection) {
    benefitsSection.insertAdjacentElement("beforebegin", saleSection);
  } else {
    console.warn(
      "Секция .benefits  не найдена. Акционные товары не будут добавлены."
    );
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   renderSimilar();
// });
