document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".js-more-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();

      const parentBox = btn.closest(".js-box");
      const hiddenBoxes = parentBox.querySelectorAll(
        ".aside__form-content-box.hidden"
      );
      const allToggleBoxes = Array.from(
        parentBox.querySelectorAll(".aside__form-content-box")
      ).filter(
        (box) =>
          (box !== null && box.classList.contains("hidden")) ||
          box.dataset.toggled === "true"
      );

      const isExpanded = btn.classList.toggle("expanded");

      allToggleBoxes.forEach((box) => {
        if (isExpanded) {
          box.classList.remove("hidden");
          box.dataset.toggled = "true"; // помечаем, что это было раскрыто кнопкой
        } else {
          box.classList.add("hidden");
          delete box.dataset.toggled;
        }
      });

      btn.textContent = isExpanded ? "Приховати" : "Показати ще";
    });
  });
});
