const button = document.getElementById("scroll-toggle");

// SVG стрелки
const arrowDown = `<svg id="scroll-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 21l-12-18h24z"/>
  </svg>`;
const arrowUp = `<svg id="scroll-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 3l12 18h-24z"/>
  </svg>`;

function updateButton() {
  if (window.scrollY > 100) {
    button.classList.add("visible");

    if (window.scrollY < window.innerHeight / 2) {
      button.style.backgroundColor = "var(--accent)"; // Зеленый
      button.innerHTML = arrowDown;
    } else {
      button.style.backgroundColor = "var(--blue)"; // Синий
      button.innerHTML = arrowUp;
    }
  } else {
    button.classList.remove("visible");
  }
}

button.onclick = function () {
  button.classList.remove("bounce"); // сбрасываем анимацию
  void button.offsetWidth; // принудительно пересчитываем стиль
  button.classList.add("bounce"); // добавляем снова bounce

  if (window.scrollY < window.innerHeight / 2) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

window.addEventListener("scroll", updateButton);

updateButton(); // Первичная установка
