document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".why-us-items");
  const track = document.querySelector(".why-us-track");
  if (!container || !track) return;

  const originals = Array.from(track.children);
  if (originals.length === 0) return;

  // ⚙️ تنظیمات
  const SPEED_PX_PER_SECOND = 35; // سرعت حرکت (پیکسل بر ثانیه)
  const MIN_COPIES = 2;           // حداقل ۲ نسخه برای حلقه بی‌درز

  function buildMarquee() {
    // ۱) پاک‌سازی کپی‌های قبلی (برای resize و اجرای مجدد)
    track.querySelectorAll("[data-marquee-clone]").forEach((el) => el.remove());

    // ۲) عرض محتوای اصلی (یک ست کامل)
    const originalWidth = track.scrollWidth;
    if (originalWidth === 0) return;

    // ۳) عرض قابل‌مشاهده
    const viewportWidth = container.clientWidth;

    // ۴) چند نسخه لازمه؟ (تا کل viewport پر شه + ۱ اضافه برای بی‌درزی)
    const copies = Math.max(
      MIN_COPIES,
      Math.ceil(viewportWidth / originalWidth) + 1
    );

    // ۵) ساخت کپی‌ها
    for (let i = 1; i < copies; i++) {
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.dataset.marqueeClone = "true";
        track.appendChild(clone);
      });
    }

    // ۶) ست کردن تعداد نسخه‌ها در CSS variable (برای keyframe)
    track.style.setProperty("--marquee-copies", copies);

    // ۷) مدت زمان انیمیشن برای سرعت ثابت
    //    هر دور انیمیشن = جابجایی به اندازه یک ست کامل
    const cycleDuration = originalWidth / SPEED_PX_PER_SECOND;
    track.style.animationDuration = `${cycleDuration}s`;
  }

  // اجرای اولیه
  buildMarquee();

  // واکنش به تغییر اندازه پنجره (با debounce)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildMarquee, 200);
  });

  // احترام به prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.animation = "none";
    container.style.overflowX = "auto";
    container.style.webkitMaskImage = "none";
    container.style.maskImage = "none";
  }
});