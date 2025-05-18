/**
 * Получает параметр category из URL
 */
export function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  console.log("params", params);
  return params.get("category");
}
console.log("getCategoryFromUrl", getCategoryFromUrl());

/**
 * Сопоставление категорий с полем в data.json
 */
const categoryMap = {
  нітрил: "material",
  латекс: "material",
  оглядові: "type",
  універсальні: "type",
  харчова: "sphere",
  "салони краси": "sphere",
  медичні: "sphere",
  господарські: "sphere",
  "сад город": "sphere",
  клінінг: "sphere",
  "ремонт та будівництво": "sphere",
  акції: "discount",
  // sale: "discount",
  // добавь другие категории по мере необходимости
};

/**
 * Фильтрует массив товаров по заданной категории
 * @param {Array} data - все товары
 * @param {String|null} category - категория из URL (или null)ы
 * @returns {Array} отфильтрованные товары
 */

export function filterProductsByCategory(data, category) {
  if (!category) return data;

  const lowerCategory = category.trim().toLowerCase(); // <== trim добавлен
  console.log("lowerCategory", lowerCategory);
  const filterField = categoryMap[lowerCategory];
  console.log("filterField", filterField);

  return data.filter((product) => {
    if (filterField === "discount") {
      return product.discount && product.discount > 0;
    }

    const value = product[filterField];
    console.log("value", value);
    if (typeof value === "string") {
      return value.toLowerCase().includes(lowerCategory);
    }

    if (Array.isArray(value)) {
      return value.some((item) => item.toLowerCase().includes(lowerCategory));
    }

    return false;
  });
}
