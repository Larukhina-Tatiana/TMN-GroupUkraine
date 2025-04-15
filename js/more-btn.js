document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".js-more-btn")) {
    document.querySelectorAll(".js-more-btn").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();

        const parentBox = btn.closest(".js-box");
        const hiddenBoxes = parentBox.querySelectorAll("div[data-toggled]");

        hiddenBoxes.forEach((div) => {
          div.classList.toggle("hidden");
        });

        const isHidden = btn.classList.toggle("open");

        btn.textContent = isHidden ? "Приховати" : "Показати ще";
      });
    });
  }
});
