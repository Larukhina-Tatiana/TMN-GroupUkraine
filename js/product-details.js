// рендер Наличие
export function productDetails(product, showDetailsButton = true) {
  const sizesMarkup = getSizesMarkup(product); // Генерация разметки размеров
  const isAvailable = product.availability; // Проверка наличия товара
  const discount = product.discount || 0; // Скидка, если есть
  //
  if (isAvailable) {
    return `
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
          discount > 0
            ? `
              <p class="card__price card__price--sale">${product.price} ₴</p>
              <span class="card__old-price text2">${(
                product.price /
                (1 - discount / 100)
              ).toFixed(0)} ₴</span>
              ${
                product.proviso
                  ? `<span class="card__proviso">${product.proviso}</span>`
                  : ""
              }
            `
            : `<p class="card__price">${product.price} ₴</p>`
        }
      </div>
      <div class="card__btn-box">
        <a class="card__btn buttons" href="#">У кошик</a>
        ${
          showDetailsButton
            ? `<a class="card__btn buttons" href="#">Детальніше</a>`
            : ""
        }
      </div>
    `;
  }

  return `
    <p class="card__noavailability">Цього товару немає в наявності</p>
    <div class="card__btn-box">
      ${
        showDetailsButton
          ? `<a class="card__btn buttons" href="#">Детальніше</a>`
          : ""
      }
    </div>
  `;
}
// рендер Размеров
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
    </li>`
    )
    .join("");
}
