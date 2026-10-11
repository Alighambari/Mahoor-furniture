/* =========================================================================
   MAHOOR — HERO CAROUSEL
   -------------------------------------------------------------------------
   Single source of truth : the CSS `heroProgressFill` animation IS the timer.
   JS only listens to `animationend` and toggles `.is-paused`.
   No setInterval → no drift → pause is real.
========================================================================= */

(() => {
  "use strict";

  /* ---------------- CONFIG ---------------- */

  const AUTOPLAY_MS = 7000;    // must match the CSS `--hero-autoplay`
  const SWIPE_PX = 50;

  /* ---------------- DOM ---------------- */

  const hero = document.getElementById("heroStage");
  if (!hero) return;

  const slides       = Array.from(hero.querySelectorAll(".hero__slide"));
  const progressLines = Array.from(hero.querySelectorAll(".hero__progress-line"));
  const nextBtn      = hero.querySelector('[data-hero-control="next"]');
  const prevBtn      = hero.querySelector('[data-hero-control="prev"]');

  const total = slides.length;
  if (total < 2) return;

  /* ---------------- STATE ---------------- */

  let current = 0;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Publish the duration to CSS so animation & JS never disagree
  hero.style.setProperty("--hero-autoplay", `${AUTOPLAY_MS}ms`);

  /* ---------------- NAVIGATION ---------------- */

  function goTo(index) {
    index = (index + total) % total;
    if (index === current) return;

    // ---- deactivate old
    slides[current].classList.remove("is-active");
    slides[current].setAttribute("aria-hidden", "true");
    progressLines[current].classList.remove("is-active");

    // ---- activate new
    current = index;
    slides[current].classList.add("is-active");
    slides[current].setAttribute("aria-hidden", "false");

    // ---- restart progress animation from 0%
    const line = progressLines[current];
    line.classList.remove("is-active");
    void line.offsetWidth;              // force reflow → restart animation
    line.classList.add("is-active");
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  /* ---------------- AUTOPLAY via animationend ---------------- */

  hero.addEventListener("animationend", (event) => {
    if (
      event.animationName === "heroProgressFill" &&
      event.target === progressLines[current] &&
      !reducedMotion.matches
    ) {
      next();
    }
  });

  /* ---------------- MANUAL CONTROLS ---------------- */

  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  /* ---------------- PAUSE / RESUME ---------------- */

  const pause  = () => hero.classList.add("is-paused");
  const resume = () => hero.classList.remove("is-paused");

  // hover (desktop)
  hero.addEventListener("mouseenter", pause);
  hero.addEventListener("mouseleave", resume);

  // focus (keyboard / AT)
  hero.addEventListener("focusin",  pause);
  hero.addEventListener("focusout", (e) => {
    if (!hero.contains(e.relatedTarget)) resume();
  });

  // tab visibility
  document.addEventListener("visibilitychange", () => {
    document.hidden ? pause() : resume();
  });

  // reduced-motion → autoplay off
  const syncMotion = () => (reducedMotion.matches ? pause() : resume());
  syncMotion();
  reducedMotion.addEventListener?.("change", syncMotion);

  /* ---------------- KEYBOARD (RTL-aware) ---------------- */
  /* در RTL، ArrowLeft = جلو، ArrowRight = عقب */

  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); next(); }
    if (e.key === "ArrowRight") { e.preventDefault(); prev(); }
  });

  /* ---------------- TOUCH SWIPE ---------------- */

  let touchX = 0;

  hero.addEventListener("touchstart", (e) => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  hero.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) < SWIPE_PX) return;
    // swipe left → next | swipe right → prev
    dx < 0 ? next() : prev();
  }, { passive: true });
})();