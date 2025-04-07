document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  console.log("forms", forms);

  const regExpName = "^[a-zA-Z[А-Я][а-яё][а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]]{2,16}+$/";
  // const regExpPhone = /^[a-zA-Z[А-Я][а-яё][а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]]{2,16}+$/;
  const regExpEmail = "^S+@S+.S+$/";

  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
    form.addEventListener("input", handleFormInput);

    // Восстанавливаем данные из LocalStorage
    restoreFormData(form);
  });

  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const isValid = validateForm(form);

    if (isValid) {
      const formData = new FormData(form);
      console.log("✅ Отправка данных:", Object.fromEntries(formData));

      form.reset();
      localStorage.removeItem(form.id);
      showSuccessMessage(form);
    } else {
      console.warn("❌ Форма не прошла валидацию");
    }
  }

  function handleFormInput(event) {
    const form = event.target.closest("form");
    saveFormData(form);
  }

  function validateForm(form) {
    let isValid = true;

    form.querySelectorAll("required").forEach((field) => {
      const errorElem = form.querySelector(`.error`);
      if (errorElem) errorElem.textContent = "";

      // Проверяем input/textarea
      if (!field.checkValidity()) {
        isValid = false;
        if (errorSpan) {
          errorSpan.textContent = field.validationMessage;
        }
      }

      // Дополнительная проверка textarea через RegExp
      if (field.tagName === "TEXTAREA") {
        const textPattern = /^[a-zA-Z\s]+$/; // Разрешены только буквы и пробелы
        if (!textPattern.test(field.value.trim())) {
          isValid = false;
          if (errorSpan) {
            errorSpan.textContent = "❌ Только латинские буквы и пробелы!";
          }
        }
      }
    });

    return isValid;
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

  function showSuccessMessage(form) {
    alert("Форма успешно отправлена!");
  }
});
