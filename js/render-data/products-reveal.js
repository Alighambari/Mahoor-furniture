/* =========================================
   MAHOOR — PRODUCTS SCROLL REVEAL
========================================= */

(function () {
  let observer = null;

  function ensureObserver() {
    if (observer) return observer;

    observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    return observer;
  }

  function initProductsReveal() {
    const cards = document.querySelectorAll(".products-editorial .product");
    if (!cards.length) return;

    const obs = ensureObserver();

    cards.forEach(function (card, index) {
      if (card.dataset.revealReady === "true") return;
      card.dataset.revealReady = "true";

      card.classList.add(index % 2 === 0 ? "reveal-left" : "reveal-right");
      obs.observe(card);
    });
  }

  window.MahoorInitProductsReveal = initProductsReveal;

  document.addEventListener("DOMContentLoaded", initProductsReveal);
  window.addEventListener("load", initProductsReveal);
})();