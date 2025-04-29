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
        ? `<div class="card__body">`
        : `<div class="card-product__body">`
    }
        <h5 class="card__title title-h5">${product.title}</h5>
        <p class="card__name text2">${product.nameEn}</p>

      <p class="card__descr"><span class="card__descr-bold">Опис: </span>${
        product.application
      }</p>
      <p class="card__descr"><span class="card__descr-bold">Характеристика: </span>${
        product.characteristics
      }</p>
      <p class="card__descr"><span class="card__descr-bold">Застосування: </span>${
        Array.isArray(product.sphere) ? product.sphere.join(", ") : ""
      }</p>
      ${productDetails(product, showDetailsButton)}
    </div>`;
}
