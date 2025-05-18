// Для слайдера
export function createProductCard(product) {
  return `
    <li class="popular__item swiper-slide products-card__item">
      <article class="products-card__box${
        product.discount ? " card--sale" : ""
      }" 
        ${product.discount ? `data-sale="-${product.discount}%"` : ""} 
        id="${product.id}" 
        title="${product.title}">
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
            }" 
              loading="lazy" decoding="async" alt="${product.title}">
          </picture>
        </div>
        <div class="products-card__body">
          <a class="title-link" href="./page-card.html?productId=${product.id}">
            <h3 class="products-card__title text-cut title-h3" title="${
              product.title
            }">
              ${product.title}
            </h3>
          </a>
          <p class="products-card__application text-cut" title="${
            product.application
          }">
            ${product.application || ""}
          </p>
          <div class="products-card__price-wrapper">
            ${
              product.discount > 0
                ? `
              <span class="products-card__price card__price--sale">${
                product.price
              } ₴</span>
              <span class="card__old-price text2">${(
                product.price /
                (1 - product.discount / 100)
              ).toFixed(0)} ₴</span>
              ${
                product.proviso
                  ? `<span class="card__proviso">${product.proviso}</span>`
                  : ""
              }
            `
                : `<span class="products-card__price">${product.price} ₴</span>`
            }
          </div>
        </div>
        <a class="products-card__btn buttons card-btn-link" data-action="js-card-btnlink" href="./page-card.html?productId=${
          product.id
        }">Детальніше</a>
      </article>
    </li>
  `;
}
