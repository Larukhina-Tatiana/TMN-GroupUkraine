document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  // console.log("forms", forms);
  const regExpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
    form.addEventListener("input", handleFormInput);

    // Восстанавливаем данные из LocalStorage
    restoreFormData(form);
  });

  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const isNull = checkingForEmpty(form);
    const isValid = validateForm(form);

    if (isValid && !isNull) {
      const formData = new FormData(form);
      console.log("✅ Отправка данных:", Object.fromEntries(formData));

      form.reset();
      localStorage.removeItem(form.id);
      showSuccessMessage(form);
    }
  }

  function handleFormInput(event) {
    const form = event.target.closest("form");
    saveFormData(form);
  }

  function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      const parentElem = field.parentNode;
      const errorElem = parentElem.querySelector(`.error`);
      const errorInput = parentElem.querySelector(`input`);

      if (field.name === "username") {
        const regExpName = /^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ]{2,16}$/;
        if (!regExpName.test(field.value.trim())) {
          isValid = false;
          if (errorElem) {
            errorElem.style.opacity = 1;
            errorInput.style.boxShadow = "rgb(255 6 6) 0px 0px 4px";

            // Добавляем обработчик события input для скрытия сообщения об ошибке
            field.addEventListener("input", function onErrorsInput() {
              errorElem.style.opacity = 0;
              errorInput.style.boxShadow = "none";

              // Удаляем обработчик после первого ввода
              field.removeEventListener("input", onErrorsInput);
            });
          } else {
            console.warn("❌Нет елемента .error");
          }
        }
      }

      if (field.type === "email" && !regExpEmail.test(field.value.trim())) {
        isValid = false;
        if (errorElem) {
          errorElem.style.opacity = 1;
          errorInput.style.boxShadow = "rgb(255 6 6) 0px 0px 4px";
          field.addEventListener("input", function onErrorsInput() {
            errorElem.style.opacity = 0;
            errorInput.style.boxShadow = "none";
            field.removeEventListener("input", onErrorsInput);
          });
        }
      }

      if (field.type === "tel") {
        const telSelector = document.querySelector('input[type="tel"]');
        const phone = telSelector.inputmask.unmaskedvalue();

        if (phone.length !== 9) {
          isValid = false;
          if (errorElem) {
            errorElem.style.opacity = 1;
            errorInput.style.boxShadow = "rgb(255 6 6) 0px 0px 4px";
            field.addEventListener("input", function onErrorsInput() {
              errorElem.style.opacity = 0;
              errorInput.style.boxShadow = "none";
              field.removeEventListener("input", onErrorsInput);
            });
          }
        }
      }

      // Проверка textarea через RegExp
      if (field.tagName === "TEXTAREA") {
        const textPattern = /^[a-zA-Z\s]+$/;
        if (!textPattern.test(field.value.trim())) {
          isValid = false;
          if (errorElem) {
            errorElem.style.opacity = 1;
            errorInput.style.boxShadow = "rgb(255 6 6) 0px 0px 4px";
            field.addEventListener("input", function onErrorsInput() {
              errorElem.style.opacity = 0;
              errorInput.style.boxShadow = "none";
              field.removeEventListener("input", onErrorsInput);
            });
          }
        }
      }
    });
    return isValid;
  }

  function checkingForEmpty(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isNull = false;

    requiredFields.forEach((field) => {
      const parentElem = field.parentNode;
      const errorElem = parentElem.querySelector(`.error`);
      if (field.value.trim() === "") {
        if (errorElem) {
          errorElem.style.opacity = 1;

          // Добавляем обработчик события input для скрытия сообщения об ошибке
          field.addEventListener("input", function onErrorsInput() {
            errorElem.style.opacity = 0;

            // Удаляем обработчик после первого ввода
            field.removeEventListener("input", onErrorsInput);
          });
        } else {
          console.warn("❌Нет елемента .error");
        }
        isNull = true;
      }
    });

    return isNull;
  }

  function saveFormData(form) {
    const formData = {};
    new FormData(form).forEach((value, key) => {
      formData[key] = value;
    });
    localStorage.setItem(form.id, JSON.stringify(formData));
  }

  function restoreFormData(form) {
    const savedData = localStorage.getItem(form.id);
    if (savedData) {
      const formData = JSON.parse(savedData);
      Object.entries(formData).forEach(([key, value]) => {
        const field = form.elements[key];
        if (field) field.value = value;
      });
    }
  }

  const NOTIFICATION_DELAY = 5000;
  const notification = document.querySelector(".js-alert");
  let timeoutId = null;
  function showSuccessMessage(form) {
    // Вывод сообщения об отправке

    shouNotification();
    notification.addEventListener("click", onNotificationClick);
  }

  function onNotificationClick() {
    hideNotification();
    clearTimeout(timeoutId);
  }

  function shouNotification() {
    timeoutId = notification.style.transform = "translate(-50%, -50%)";
    setTimeout(() => {
      hideNotification();
    }, NOTIFICATION_DELAY);
  }
  // function shouNotification() {
  //   timeoutId = notification.classList.remove("is-hidden");
  //   setTimeout(() => {
  //     hideNotification();
  //   }, NOTIFICATION_DELAY);
  // }

  function hideNotification() {
    timeoutId = notification.style.transform = "translateX(100vw)";
  }
  // function hideNotification() {
  //   notification.classList.add("is-hidden");
  // }
});

/*
email,  - проверка по блюру 
паспорт- проверка по input
незаполненные полю - по субмит
*/
