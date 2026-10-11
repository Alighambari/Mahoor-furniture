
(() => {
  "use strict";

  const footer = document.querySelector("[data-footer-reveal]");

  // اگر فوتر در صفحه وجود ندارد، اجرای اسکریپت متوقف شود.
  if (!footer) return;

  // کاربرانی که حرکت‌های انیمیشنی را محدود کرده‌اند،
  // باید فوتر را بدون انتظار مشاهده‌گر ببینند.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    footer.classList.add("is-visible");
    return;
  }

  // اگر مرورگر از IntersectionObserver پشتیبانی نکند،
  // محتوای فوتر نباید مخفی باقی بماند.
  if (!("IntersectionObserver" in window)) {
    footer.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // فوتر فقط یک بار نمایش داده شود.
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px 40px 0px",
    }
  );

  observer.observe(footer);
})();

