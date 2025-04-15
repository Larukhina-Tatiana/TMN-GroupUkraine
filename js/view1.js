export class View {
  constructor() {}

  elements = {
    productList: document.querySelector(".catalog__list"),
    // sortTypeSelect: document.querySelector("#sortType"),
    // sortCategorySelect: document.querySelector("#sortCategory"),
    // sortOrderSelect: document.querySelector("#sortOrder"),
    // filterInput: document.querySelector("#filterInput"),
    // form: document.querySelector("#form"),
  };

  // highlightFilterValue(name, filterValue) {
  //   const lowerCaseName = name.toLowerCase();
  //   const lowerCaseFilterValue = filterValue.toLowerCase();

  //   const startIdx = lowerCaseName.indexOf(lowerCaseFilterValue);

  //   if (startIdx !== -1) {
  //     const start = name.substring(0, startIdx);
  //     const interval = name.substring(startIdx, startIdx + filterValue.length);
  //     const end = name.substring(startIdx + filterValue.length);

  //     const highlightedName = `${start}<span class="active">${interval}</span>${end}`;

  //     return highlightedName;
  //   }

  //   return name;
  // }

  renderProducts(arrData) {
    this.elements.productList.innerHTML = "";

    arrData.forEach((product) => {
      // const name = this.highlightFilterValue(
      //   product.name,
      //   this.elements.filterInput.value
      // );

      // рендер Размер
      const sizesMarkup = product.size
        .map((size, index) => {
          return `
      <li class="card__choice-item">
        <label class="card__choice-label">
          <input class="checkbox-style" type="checkbox" name="checkbox" ${
            index === 0 ? "checked" : ""
          }>
          <span class="checkbox-castom"></span>
          ${size}
        </label>
      </li>
    `;
        })
        .join("");

      const isAvailable = product.availability;
      // рендер Наличие
      const productDetails = isAvailable
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
            <span class="card__proviso">${product.proviso}</span>`
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
      // рендер карточки
      const markup = `
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
        <span class="card__descr-bold">Застосування:</span>
        ${product.sphere}
      </p>

      ${productDetails}
    </div>
  </article>
</li>
      `;

      this.elements.productList.insertAdjacentHTML("afterbegin", markup);
    });
  }

  // sortingElementsValue() {
  //   return {
  //     sortType: this.elements.sortTypeSelect.value,
  //     sortOrder: this.elements.sortOrderSelect.value,
  //     sortCategory: this.elements.sortCategorySelect.value,
  //   };
  // }

  // sortingElements() {
  //   return {
  //     sortType: this.elements.sortTypeSelect,
  //     sortOrder: this.elements.sortOrderSelect,
  //     sortCategory: this.elements.sortCategorySelect,
  //   };
  // }
}
