/* =========================================================
   MAHOOR — PRODUCTS CINEMATIC SCROLL
   Mask Reveal + Per-Card Parallax + Magnetic Tilt
   Requires: GSAP 3.12+, ScrollTrigger
   ========================================================= */

(function () {
  "use strict";

  let isInitialized = false;

  function init() {
    if (isInitialized) return;

    const grid = document.querySelector(".products-editorial");
    if (!grid) return;

    const cards = grid.querySelectorAll(".product");
    if (!cards.length) return;

    // GSAP check
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("[MAHOOR] GSAP not loaded. Cinematic skipped.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // فعال‌سازی استایل‌های سینمایی
    grid.classList.add("cinematic-active");

    // احترام به prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      cards.forEach((c) => c.classList.add("is-revealed"));
      isInitialized = true;
      return;
    }

    /* =====================================================
       01. MASK REVEAL — با ورود به ویوپورت
       ===================================================== */
    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 88%",
        once: true,
        onEnter: () => {
          setTimeout(() => card.classList.add("is-revealed"), i * 90);
        },
      });
    });

    /* =====================================================
       02. PER-CARD PARALLAX — هر کارت سرعت متفاوت
       ===================================================== */
    const speeds = [0.18, 0.42, 0.06, 0.5, 0.28, 0.35];

    cards.forEach((card, i) => {
      const speed = speeds[i % speeds.length];

      // پارالاکس کارت
      gsap.to(card, {
        y: () => -130 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // پارالاکس داخلی تصویر (کندتر از کارت)
      const img = card.querySelector(
        ".product-card__image, .product__image"
      );
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6,
            },
          }
        );
      }
    });

    /* =====================================================
       03. AMBIENT GLOW — هماهنگ با اسکرول
       ===================================================== */
    ScrollTrigger.create({
      trigger: grid,
      start: "top 75%",
      end: "bottom 25%",
      onEnter: () => grid.classList.add("is-scrolling"),
      onLeave: () => grid.classList.remove("is-scrolling"),
      onEnterBack: () => grid.classList.add("is-scrolling"),
      onLeaveBack: () => grid.classList.remove("is-scrolling"),
    });

    /* =====================================================
       04. MAGNETIC TILT — فقط دسکتاپ با موس دقیق
       ===================================================== */
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (canHover) {
      cards.forEach((card) => {
        let rafId = null;
        let targetRX = 0;
        let targetRY = 0;
        let curRX = 0;
        let curRY = 0;
        let isHovering = false;

        const TILT_MAX = 5; // درجه
        const EASE = 0.12;

        function loop() {
          curRX += (targetRX - curRX) * EASE;
          curRY += (targetRY - curRY) * EASE;

          gsap.set(card, {
            rotateX: curRX,
            rotateY: curRY,
            transformPerspective: 1100,
          });

          if (
            isHovering ||
            Math.abs(curRX) > 0.05 ||
            Math.abs(curRY) > 0.05
          ) {
            rafId = requestAnimationFrame(loop);
          } else {
            gsap.set(card, { rotateX: 0, rotateY: 0 });
            rafId = null;
          }
        }

        function onEnter() {
          isHovering = true;
          gsap.to(card, {
            scale: 1.035,
            duration: 0.55,
            ease: "power3.out",
          });
          if (!rafId) rafId = requestAnimationFrame(loop);
        }

        function onMove(e) {
          const rect = card.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          targetRY = nx * TILT_MAX;
          targetRX = -ny * TILT_MAX;
        }

        function onLeave() {
          isHovering = false;
          targetRX = 0;
          targetRY = 0;
          gsap.to(card, {
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          });
          if (!rafId) rafId = requestAnimationFrame(loop);
        }

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }

    /* =====================================================
       05. REFRESH روی فیلتر/رندر مجدد
       ===================================================== */
    const mo = new MutationObserver(() => {
      // فقط refresh کن، انیمیشن‌های قبلی حفظ می‌شن
      ScrollTrigger.refresh();
    });
    mo.observe(grid, { childList: true });

    // رفرش بعد از لود کامل تصاویر (تا اندازه‌ها درست حساب شن)
    window.addEventListener("load", () => ScrollTrigger.refresh());

    isInitialized = true;
  }

  /* =====================================================
     اجرا: چند بار تلاش می‌کنیم چون محصولات داینامیک‌اند
     ===================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    init();
    // اگه products-render.js دیر اجرا شد
    setTimeout(init, 300);
    setTimeout(init, 900);
    setTimeout(init, 1800);
  });
})();