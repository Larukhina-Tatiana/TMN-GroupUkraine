// Рендер похожих товаров по материалу
import { renderProductSection, filterSimilarByMaterial } from "./utils.js";
import { waitForCardAndRenderViewed } from "./recently-viewed.js";

waitForCardAndRenderViewed(() => {
  console.log("render-similar.js подключен");

  // Ждем, пока появится элемент .card-product__item
  // Получаем id текущего товара (например, из DOM или URL)
  const card = document.querySelector(".card-product__item");
  console.log("card", card);

  if (!card) return;
  const currentId = card.getAttribute("id");

  renderProductSection({
    filterFn: (item, data) =>
      filterSimilarByMaterial(data, currentId).includes(item),
    sectionTitle: "Схожі товари",
    sectionLink: "#",
    insertAfterSelector: ".seo",
    selector: ".similar",
    // если нужно сохранить порядок, можно добавить customSort
    // customSort: (products) => filterSimilarByMaterial(products, currentId),
  });
});
