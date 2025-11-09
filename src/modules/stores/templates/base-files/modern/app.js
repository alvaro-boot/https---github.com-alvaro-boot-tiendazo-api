document.addEventListener("DOMContentLoaded", () => {
  const heroButton = document.querySelector(".modern-cta-btn");
  if (heroButton) {
    heroButton.addEventListener("click", (event) => {
      event.preventDefault();
      const productsSection = document.querySelector("#productos");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

