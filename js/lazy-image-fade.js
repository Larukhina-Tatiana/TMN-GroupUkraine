export function initLazyImageFade() {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener("load", () => img.classList.add("loaded"));
    if (img.complete) img.classList.add("loaded");
  });
}
