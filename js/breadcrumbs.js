export function createBreadcrumbs(product) {
  const breadcrumbsList = document.querySelector(".breadcrumbs__list");
  if (!breadcrumbsList || !product) return;

  breadcrumbsList.innerHTML = ""; // Очистить существующие крошки

  const crumbs = [
    { label: "Головна", link: "./index.html" },
    { label: "Наша продукція", link: "./catalog.html" },
    // Если есть категория — добавляем
    product.category
      ? { label: product.category, link: "./catalog.html" }
      : null,
    { label: product.title }, // Последний пункт — без ссылки
  ].filter(Boolean); // удаляет null

  crumbs.forEach((crumb, index) => {
    const li = document.createElement("li");
    li.classList.add("breadcrumbs__item");

    if (crumb.link && index !== crumbs.length - 1) {
      li.innerHTML = `<a class="breadcrumbs__link" href="${crumb.link}">${crumb.label}</a>`;
    } else {
      li.innerHTML = `<span class="breadcrumbs__nolink">${crumb.label}</span>`;
    }

    breadcrumbsList.appendChild(li);
  });
}
