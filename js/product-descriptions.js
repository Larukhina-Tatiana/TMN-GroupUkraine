// рендера  описания
import { productDetails } from "./product-details.js"; //Рендер деталей товара
export function renderProductDescriptions(
  product,
  сhangeСlass = false,
  showDetailsButton
) {
  if (!product) {
    console.error("Товар не найден");
    return "<p>Товар не найден</p>";
  }
  return `
    ${
      !сhangeСlass
        ? `<div class="card__body">
        <a class="title-link" href="./page-card.html?productId=${product.id}">
        <h5 class="card__title title-h5">${product.title}</h5>
        </a>`
        : `<div class="card-product__body">
        <h5 class="card__title title-h5">${product.title}</h5>`
    }
        <p class="card__title-en text2">${product.nameEn}</p>
        <ul class="card-info__list">
        <li class="card-info__item">
            <span class="card-info__label">Опис:</span>
            <p class="card-info__text">${product.application}</p>
          </li>
          <li class="card-info__item">
            <span class="card-info__label">Характеристика:</span>
            <p class="card-info__text">${product.characteristics}</p>
          </li>
          <li class="card-info__item">
            <span class="card-info__label">Застосування:</span>
            <p class="card-info__text">${
              Array.isArray(product.sphere) ? product.sphere.join(", ") : ""
            }</p>
          </li>
        </ul>
      ${productDetails(product, showDetailsButton)}
    </div>`;
}
