const heroScrollBtn = document.getElementById("heroScrollBtn");
const whyUsSection = document.getElementById("whyUs");

if (heroScrollBtn && whyUsSection) {
  heroScrollBtn.addEventListener("click", () => {
    whyUsSection.scrollIntoView({
      behavior: "smooth",
    });
  });
}

const footerScrollTop = document.getElementById("footerScrollTop");

if (footerScrollTop) {
  footerScrollTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
