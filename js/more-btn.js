document.addEventListener("DOMContentLoaded", () => {
  const moreBtns = document.querySelectorAll(".js-more-btn");
  if (!moreBtns.length) return;

  moreBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();

      const parentBox = btn.closest(".js-box");
      if (!parentBox) return;

      parentBox.querySelectorAll("div[data-toggled]").forEach((div) => {
        div.classList.toggle("hidden");
      });

      const isOpen = btn.classList.toggle("open");
      btn.textContent = isOpen ? "Приховати" : "Показати ще";
    });
  });
});
