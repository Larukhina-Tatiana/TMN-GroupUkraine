document.getElementById("readMoreBtn").addEventListener("click", () => {
  const wrapper = document.querySelector(".seo__wrapper");
  console.log(wrapper);
  wrapper.classList.toggle("expanded");

  const btn = document.getElementById("readMoreBtn");
  btn.textContent = wrapper.classList.contains("expanded")
    ? "Згорнути"
    : "Читати все";
});
