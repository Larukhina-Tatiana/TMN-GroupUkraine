const btnSort = document.querySelector(".menu__sort");
const aside = document.querySelector(".aside");

btnSort.addEventListener("click", () => {
  aside.classList.toggle("open");
  btnSort.classList.toggle("open");
});