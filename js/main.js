// import AOS from "node_modules/aos/dist/aos.js";

if (document.querySelector(".nav__linkbtn-arrow")) {
  const navArrow = document.querySelector(".nav__linkbtn-arrow");
  if (navArrow) {
    navArrow.addEventListener("click", () => {
      navArrow.classList.toggle("active");
      const navSubmenu = document.querySelector(".nav__submenu-list");
      if (navSubmenu) {
        navSubmenu.classList.toggle("active");
      }
    });
  }

  // $(".nav__linkbtn-arrow").on("click", function () {
  //   $(".nav__linkbtn-arrow").toggleClass("active");
  //   $(".nav__submenu-list").toggleClass("active");
  // });
}
if (document.querySelector(".phone__arrow")) {
  // Обработка клика по стрелке телефона
  const phoneArrow = document.querySelector(".phone__arrow");
  if (phoneArrow) {
    phoneArrow.addEventListener("click", () => {
      phoneArrow.classList.toggle("active");
      const phoneList = document.querySelector(".phone__list");
      if (phoneList) {
        phoneList.classList.toggle("active");
      }
    });
  }
}

if (document.querySelector(".lang")) {
  new TransferElements({
    sourceElement: document.querySelector(".lang"), // что переносим
    breakpoints: {
      890: {
        targetElement: document.querySelector(".nav__inner"), // куда переносим
        targetPosition: 1,
      },
    },
  });
}

if (document.querySelector(".menu__btn")) {
  const btn = document.querySelector(".menu__btn");
  const nav = document.querySelector(".nav__inner");

  btn.addEventListener("click", () => {
    nav.classList.toggle("menu-open");
    btn.classList.toggle("menu-open");
  });
}
if (document.querySelector("[data-modal-search]")) {
  (() => {
    const refs = {
      openModalBtn: document.querySelector("[data-modal-search]"),
      closeModalBtn: document.querySelector("[data-modal-close]"),
      modal: document.querySelector("[data-modal]"),
    };

    refs.openModalBtn.addEventListener("click", toggleModal);
    refs.closeModalBtn.addEventListener("click", toggleModal);

    function toggleModal() {
      refs.modal.classList.toggle("is-hidden");
    }
  })();
}

// page-basket
// ==================================
// Counter
// ==================================
function increaseCount(e, el) {
  var input = el.previousElementSibling;
  var value = parseInt(input.value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  input.value = value;
}
function decreaseCount(e, el) {
  var input = el.nextElementSibling;
  var value = parseInt(input.value, 10);
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}

$(".filter-style").styler();

// Страница catalog
// const counterText = document.querySelector(".card__counter-input");
// const counterBtn = document.querySelectorAll(".card__counter-arrow");
// let counter = 1;

// counterBtn.forEach((el, index) => {
//   el.addEventListener("click", () => {
//     if (index === 1 && counter > 1) {
//       counter--;
//     } else if (index === 0 && counter < 8) {
//       counter++;
//     }
//     counterText.textContent = counter;
//     setDisabled(counter);
//   });
// });

// function setDisabled(counter) {
//   if (counter === 1) {
//     counterBtn[1].disabled = true;
//   } else if (counter === 8) {
//     counterBtn[0].disabled = true;
//   } else {
//     counterBtn[1].disabled = false;
//     counterBtn[0].disabled = false;
//   }
// }

// // ! Tabs
// if (document.querySelector(".tabs__link")) {
//   $(".tabs__link").on("click", function (e) {
//     e.preventDefault();

//     $($(this).siblings()).removeClass("tabs__link--active");

//     $($(this).closest(".tabs-wrapper").siblings().find("li")).removeClass(
//       "tabs__content--active"
//     );

//     $(this).addClass("tabs__link--active");
//     $($(this).attr("href")).addClass("tabs__content--active");
//   });
// }

// if (document.querySelector(".sertificates__list")) {
//   const slider = document.querySelector(".sertificates__list");
//   const next = document.querySelector(".next");
//   const prev = document.querySelector(".prev");

//   const mySiema = new Siema({
//     selector: slider,
//     perPage: 4,
//     perPage: {
//       570: 2,
//       870: 3,
//       1170: 4,
//     },
//     loop: true,
//     duration: 1000,
//     easing: "cubic-bezier(.17,.67,.32,1.34)",
//   });
//   next.addEventListener("click", onNextClick);
//   prev.addEventListener("click", onPrevClick);

//   function onNextClick() {
//     mySiema.next();
//   }

//   function onPrevClick() {
//     mySiema.prev();
//   }

//   const lightbox = new SimpleLightbox(".sertificates__item a", {
//     // closeText: "&#128514;",
//     fadeSpeed: 1000,
//   });
// }

if (document.querySelector('input[type="tel"]')) {
  const telSelector = document.querySelector('input[type="tel"]');
  const inputMask = new Inputmask("+380 (99) 999-99-99");
  inputMask.mask(telSelector);
}
AOS.init();
