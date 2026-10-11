/* =========================================
   MAHOOR — GALLERY SPOTLIGHT
   نور طلایی که دنبال موس روی کارت حرکت می‌کند
========================================= */

(function () {
  // روی دستگاه‌های لمسی غیرفعال
  if (window.matchMedia("(hover: none)").matches) return;

  const cards = document.querySelectorAll(".product");
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--spotlight-x", x + "px");
      card.style.setProperty("--spotlight-y", y + "px");
    });

    card.addEventListener("mouseleave", function () {
      card.style.removeProperty("--spotlight-x");
      card.style.removeProperty("--spotlight-y");
    });
  });
})();