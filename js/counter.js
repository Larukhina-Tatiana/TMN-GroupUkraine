// Добавляем прослушку на всём окне
window.addEventListener("click", function (event) {
  // console.log(event.target.dataset.action);
  // const stepper = document.querySelector(".card__counter");
  // const stepperBtnUp = stepper.querySelector(".card__counter-arrow--up");
  // const stepperBtnDown = stepper.querySelector(".card__counter-arrow--down");

  // Обявляем переменную для счетчика
  let counter;
  // Проверяем клик строго по кнопкам
  if (
    event.target.dataset.action === "minus" ||
    event.target.dataset.action === "plus"
  ) {
    // Находим обёртку счетчика (родитель)
    const counterWrapper = event.target.closest(".counter-wrapper");
    // Находим число счетчика
    counter = counterWrapper.querySelector("[data-counter]");
    // if (parseInt(counter.innerText) == 1) {
    //   stepperBtnDown.classList.add(".btn--disabled");
    // } else {
    //   stepperBtnDown.classList.remove(".btn--disabled");
    // }
  }

  // Проверяем, является ли элемент кнопкой +
  if (event.target.dataset.action === "plus") {
    counter.innerText = ++counter.innerText;
    // console.log(counter);
  }
  // Проверяем, является ли элемент кнопкой -
  if (event.target.dataset.action === "minus") {
    // Если значение больше 1

    if (parseInt(counter.innerText) > 1) {
      // Изменяем текст в счетчике на -1
      counter.innerText = --counter.innerText;
    }
  }
});
