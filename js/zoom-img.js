export function initZoomEffect() {
  const wrapper = document.querySelector(".js-wrapper");
  const image = document.querySelector(".js-zoom");

  if (!wrapper || !image) {
    console.warn("Элементы js-wrapper или .js-zoom не найдены");
    return;
  }

  // Добавляем обработчик движения мыши с поддержкой касания
  function zoomAt(x, y) {
    const rect = wrapper.getBoundingClientRect();
    const xPercent = ((x - rect.left) / wrapper.offsetWidth) * 100;
    const yPercent = ((y - rect.top) / wrapper.offsetHeight) * 100;

    image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    image.style.transform = "scale(2)";
  }

  function resetZoom() {
    image.style.transform = "translate(-50%, -50%) scale(1)";
    image.style.transformOrigin = "center";
  }

  // Мышь
  wrapper.addEventListener("mousemove", (e) => zoomAt(e.clientX, e.clientY));
  wrapper.addEventListener("mouseleave", resetZoom);

  // Сенсорный ввод
  wrapper.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
      zoomAt(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  wrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      zoomAt(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  wrapper.addEventListener("touchend", resetZoom);
}
