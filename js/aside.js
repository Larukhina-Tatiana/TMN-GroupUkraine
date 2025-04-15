if ($(window).width() < 991) {
  if (document.querySelector(".menu__sort")) {
    const btnSort = document.querySelector(".menu__sort");
    const aside = document.querySelector(".aside");
    console.log("btnSort", btnSort);
    console.log("aside", aside);

    btnSort.addEventListener("click", () => {
      aside.classList.toggle("open");
      btnSort.classList.toggle("open");
    });
  }
}
