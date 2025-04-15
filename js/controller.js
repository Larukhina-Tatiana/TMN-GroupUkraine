import { Model } from "./model.js";
import { View } from "./view.js";

const model = new Model();
const view = new View();

init();

async function init() {
  await model.loadingData();
  console.log("data", model.data);
  view.renderProducts(model.data);

  // const sortingElements = view.sortingElements();

  // model.updateFromURL(sortingElements);

  // sortProduct();

  // addEventListeners();
}

// function addEventListeners() {
//   view.elements.sortTypeSelect.addEventListener("change", sortProduct);
//   view.elements.sortOrderSelect.addEventListener("change", sortProduct);
//   view.elements.sortCategorySelect.addEventListener("change", sortProduct);
//   view.elements.filterInput.addEventListener("input", filterProducts);

//   view.elements.form.addEventListener("submit", resetFilter);
// }

// function sortProduct() {
//   const sortingValue = view.sortingElementsValue();

//   const sortingData = model.sortingProducts(sortingValue);

//   view.renderProducts(sortingData);

//   model.updateURL(sortingValue);
// }

// function filterProducts() {
//   const value = this.value.toLowerCase();

//   model.filterSearch(value);

//   sortProduct();
// }

// function resetFilter(e) {
//   e.preventDefault();

//   const sortingElements = view.sortingElements();

//   model.resetFilter(sortingElements);

//   sortProduct();
// }
