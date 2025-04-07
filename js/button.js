document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button:not([type])").forEach((btn) => {
    btn.setAttribute("type", "button");
  });
});
