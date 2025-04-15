class ProductCatalog {
  constructor({ containerSelector, perPage = 6, onCartAdd }) {
    this.elements = {
      productList: document.querySelector(containerSelector),
    };

    this.data = [];
    this.filteredData = [];
    this.perPage = perPage;
    this.currentPage = 1;
    this.onCartAdd = onCartAdd || function () {};
  }

  init(products) {
    this.data = products;
    this.filteredData = [...this.data];
    this.renderCurrentPage();
  }

  renderCurrentPage() {
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    const itemsToShow = this.filteredData.slice(start, end);
    this.render(itemsToShow);
    this.renderPagination();
  }

  render(products) {
    if (!this.elements.productList) return;

    this.elements.productList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
      const li = document.createElement("li");
      li.className = "catalog__card-item";
      li.innerHTML = this.getProductMarkup(product);
      this.attachListeners(li, product); // Вешаем события
      fragment.appendChild(li);
    });

    this.elements.productList.appendChild(fragment);
  }

  filterByText(text = "") {
    const search = text.trim().toLowerCase();
    this.filteredData = this.data.filter((p) =>
      p.title.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.renderCurrentPage();
  }

  renderPagination() {
    const paginationContainer = document.querySelector(".catalog__pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(this.filteredData.length / this.perPage);
    if (totalPages <= 1) {
      paginationContainer.innerHTML = ""; // скрываем пагинацию если одна страница
      return;
    }

    let html = "";

    // Кнопка «назад»
    html += `
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" href="#" data-page="${
        this.currentPage - 1
      }" aria-label="назад" ${this.currentPage === 1 ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        d="M7.23 1 1 7.23l6.23 6.228"></path>
                    </svg>
                    </a>
    </li>
  `;

    // Цифры страниц
    for (let i = 1; i <= totalPages; i++) {
      html += `
      <li class="pagination__item ${i === this.currentPage ? "active" : ""}">
        <a class="pagination__link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
    }

    // Кнопка «вперёд»
    html += `
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" href="#" data-page="${
        this.currentPage + 1
      }" aria-label="вперед" ${
      this.currentPage === totalPages ? "disabled" : ""
    }>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" fill="none">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        d="M.77 1 7 7.23.77 13.457"></path>
                    </svg>
      </a>
    </li>
  `;

    paginationContainer.innerHTML = html;

    // Назначаем обработчики
    paginationContainer.querySelectorAll("[data-page]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetPage = parseInt(e.currentTarget.dataset.page);
        if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
          this.currentPage = targetPage;
          this.renderCurrentPage();
        }
      });
    });
  }

  attachListeners(element, product) {
    const addBtn = element.querySelector(".card__btn");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.onCartAdd(product);
      });
    }
  }

  getProductMarkup(product) {
    const sizesMarkup = this.getSizesMarkup(product);
    const isSale = product.discount > 0;
    const oldPrice = isSale
      ? `<span class="card__old-price text2">${(
          product.price /
          (1 - product.discount / 100)
        ).toFixed(0)} ₴</span>
        <span class="card__proviso">${product.proviso}</span>`
      : "";

    const price = isSale
      ? `<p class="card__price card__price--sale">${product.price} ₴</p>${oldPrice}`
      : `<p class="card__price">${product.price} ₴</p>`;

    return `
      <article class="catalog__card card">
        <div class="card__img-cover">
          <a class="card__title-link${
            isSale ? " products-card__img-link--sale" : ""
          }" href="#" ${isSale ? `data-sale="-${product.discount}%"` : ""}>
            <picture>
              <source type="image/avif" srcset="${product.img}.avif">
              <source type="image/webp" srcset="${product.img}.webp">
              <img class="images-img" src="${
                product.img
              }.jpg" loading="lazy" decoding="async" alt="${product.title}">
            </picture>
          </a>
        </div>
        <div class="card__body">
          <a class="card__title-link" href="#">
            <h5 class="card__title title-h5">${product.title}</h5>
            <p class="card__name text2">${product.nameEn}</p>
          </a>
          <p class="card__descr"><span class="card__descr-bold">Опис:</span> ${
            product.application
          }</p>
          <p class="card__descr"><span class="card__descr-bold">Застосування:</span> ${
            product.sphere
          }</p>
          <ul class="card__choice">
            <li class="card__choice-item"><p class="card__choice-name">Розмір</p></li>
            ${sizesMarkup}
          </ul>
          <div class="card__price-inner">
            <div class="counter-wrap card__counter counter-wrapper">
              <button class="card__counter-arrow card__counter-arrow--up" data-action="plus"
                            aria-label="plus" aria-label="plus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none">
                              <path fill="currentColor"
                                d="M4.178 1.186a1 1 0 0 1 1.644 0l3.287 4.745A1 1 0 0 1 8.287 7.5H1.713a1 1 0 0 1-.822-1.57l3.287-4.744Z" />
                            </svg>
                          </button>
              <span class="card__counter-input" data-counter>1</span>
              <button class="card__counter-arrow card__counter-arrow--down" data-action="minus"
                            aria-label="minus" aria-label="minus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none">
                              <path fill="currentColor"
                                d="M5.822 6.814a1 1 0 0 1-1.644 0L.891 2.069A1 1 0 0 1 1.713.5h6.574a1 1 0 0 1 .822 1.57L5.822 6.813Z" />
                            </svg>
                          </button>
            </div>
            ${price}
          </div>
          <div class="card__btn-box">
            <a class="card__btn buttons" href="#">У кошик</a>
            <a class="card__btn buttons" href="#">Детальніше</a>
          </div>
        </div>
      </article>
    `;
  }

  getSizesMarkup(product) {
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
}

document.addEventListener("DOMContentLoaded", () => {
  const catalog = new ProductCatalog({
    containerSelector: ".catalog__list",
    perPage: 4,
    onCartAdd: (product) => {
      console.log("🛒 В корзину:", product);
    },
  });

  // Загрузка JSON
  fetch("js/data/data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Ошибка загрузки JSON");
      return res.json();
    })
    .then((productsArray) => {
      catalog.init(productsArray);

      // Фильтрация
      document.querySelector("#search").addEventListener("input", (e) => {
        catalog.filterByText(e.target.value);
      });
    })
    .catch((error) => {
      console.error("Ошибка загрузки товаров:", error);
    });
});
