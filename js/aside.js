import { scrollToProductList } from "./render.js";

if (window.innerWidth < 991) {
  const refs = {
    btnFilterOpen: document.querySelector(".menu__filter"),
    catalogBlur: document.querySelector(".catalog__blur"),
    aside: document.querySelector(".aside"),
    btnFilterClose: document.querySelector(".aside__filtr-btn"),
  };

  if (
    refs.btnFilterOpen &&
    refs.catalogBlur &&
    refs.aside &&
    refs.btnFilterClose
  ) {
    refs.btnFilterOpen.addEventListener("click", toggleFilter);
    refs.btnFilterClose.addEventListener("click", () => {
      toggleFilter();
      // После рендера товаров прокрутить к началу списка
      setTimeout(scrollToProductList, 0);
    });

    function toggleFilter() {
      refs.aside.classList.toggle("open");
      refs.catalogBlur.classList.toggle("is-hidden");
    }
  }
}

// (() => {
//   const refs = {
//     openModalBtn: document.querySelector("[data-modal-open]"),
//     closeModalBtn: document.querySelector("[data-modal-close]"),
//     modal: document.querySelector("[data-modal]"),
//   };

//   refs.openModalBtn.addEventListener("click", toggleModal);
//   refs.closeModalBtn.addEventListener("click", toggleModal);

//   function toggleModal() {
//     refs.modal.classList.toggle("is-hidden");
//   }
// })();
