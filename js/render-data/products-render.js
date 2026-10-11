/* =========================================================
   MAHOOR — UNIVERSAL PRODUCTS RENDERER
   این فایل روی هر دو صفحه کار می‌کند:
   - index.html  → container: .products-editorial  → کارت .product
   - products.html → container: #productsGrid     → کارت .product-card
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const editorialGrid = document.querySelector(".products-editorial");
  const pageGrid = document.getElementById("productsGrid");

  if (editorialGrid) renderHomePage(editorialGrid);
  if (pageGrid) renderProductsPage(pageGrid);
});

/* =========================================================
   1) صفحه‌ی خانه — کارت‌های ادیتوریال (.product)
   ========================================================= */

function renderHomePage(container) {
  const heartSVG = `
    <svg class="topbar-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.8 8.6 C20.8 5.7 18.7 3.5 15.9 3.5
               C14.3 3.5 12.8 4.3 12 5.6
               C11.2 4.3 9.7 3.5 8.1 3.5
               C5.3 3.5 3.2 5.7 3.2 8.6
               C3.2 13.2 7.4 16.5 12 20.3
               C16.6 16.5 20.8 13.2 20.8 8.6Z"
        stroke="currentColor" stroke-width="1.35"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const statementHTML = `
    <div class="products-statement">
      <span class="products-statement__number"> MAHOOR / 2026 </span>
      <p>طراحی خوب، چیزی نیست که فقط دیده شود.</p>
      <span> باید زندگی شود. </span>
    </div>
  `;

  function card(p) {
    return `
      <article
        class="product product--${p.layout}"
        data-product-id="${p.id}"
        data-category="${p.category}"
      >
        <div class="product__identity">
          <span class="product__number"> ${p.number} </span>
          <span class="product__category"> ${p.categoryLabel} </span>
        </div>

        <div class="product__media">
          <img src="${p.image}" alt="${p.alt}" class="product__image" loading="lazy"/>
          <div class="product__overlay"></div>
          <button class="product__quick-view" type="button" aria-label="مشاهده سریع ${p.name}">
            <span>VIEW</span>
            <span class="product__quick-view-icon"> ↗ </span>
          </button>
        </div>

        <div class="product__info">
          <div class="product__title">
            <h3>${p.name}</h3>
            <span> ${p.englishName} </span>
          </div>
          <div class="product__meta">
            <span> ${p.material} </span>
            <span class="product__line"></span>
          </div>
        </div>

        <div class="product__footer">
          <button class="product__favorite" type="button" aria-label="افزودن ${p.name} به علاقه‌مندی">
            ${heartSVG}
          </button>
          <a href="#" class="product__link">
            <span>مشاهده جزئیات</span>
            <span class="product__arrow"> ← </span>
          </a>
        </div>
      </article>
    `;
  }

  let html = "";
  MAHOOR_PRODUCTS.forEach((p, i) => {
    html += card(p);
    if (i === 2) html += statementHTML;
  });

  container.innerHTML = html;

  if (typeof window.MahoorInitProductsReveal === "function") {
    window.MahoorInitProductsReveal();
  }
}


/* =========================================================
   2) صفحه‌ی محصولات — کارت‌های کاتالوگ (.product-card)
   ========================================================= */

function renderProductsPage(container) {
  const productsCount = document.getElementById("productsCount");
  const productsEmpty = document.getElementById("productsEmpty");
  const productsReset = document.getElementById("productsReset");
  const productsLoadMore = document.getElementById("productsLoadMore");
  const productsSort = document.getElementById("productsSort");
  const filterButtons = document.querySelectorAll(".products-filter__btn");

  let activeFilter = "all";
  let currentSort = "default";
  let visible = [...MAHOOR_PRODUCTS];

  /* ---------- ساخت کارت ---------- */
  function createCard(p) {
    return `
      <article
        class="product-card product-card--small reveal"
        data-product-id="${p.id}"
        data-category="${p.category}"
      >
        <div class="product-card__media">
          <span class="product-card__number">${p.number}</span>

          <button class="product-card__favorite" type="button"
                  aria-label="افزودن ${p.name} به علاقه‌مندی">♡</button>

          <img src="${p.image}" alt="${p.alt}"
               class="product-card__image" loading="lazy"/>

          <div class="product-card__corners"></div>

          <div class="product-card__hover-label">
            <span>EXPLORE</span>
            <span>↗</span>
          </div>
        </div>

        <div class="product-card__content">
          <div class="product-card__title">
            <span class="product-card__category">${p.categoryLabel}</span>
            <h3>${p.name}</h3>
            <span class="product-card__english">${p.englishName}</span>
          </div>

          <div class="product-card__details">
            <span>${p.material}</span>
            <strong>${p.priceLabel}</strong>
          </div>

          <div class="product-card__actions">
            <a href="#" class="product-card__view" data-product-id="${p.id}">
              مشاهده محصول <span>←</span>
            </a>
            <button type="button" class="product-card__cart" data-product-id="${p.id}">
              افزودن به سبد
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /* ---------- رندر ---------- */
  function render(list) {
    container.innerHTML = "";

    if (!list.length) {
      if (productsEmpty) productsEmpty.hidden = false;
      if (productsCount) productsCount.textContent = "00";
      return;
    }
    if (productsEmpty) productsEmpty.hidden = true;

    container.innerHTML = list.map(createCard).join("");

    if (productsCount) {
      productsCount.textContent = String(list.length).padStart(2, "0");
    }

    revealAll();
  }

  /* ---------- انیمیشن ظاهر شدن ---------- */
  function revealAll() {
    const items = container.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => obs.observe(el));
  }

  /* ---------- فیلتر + سورت ---------- */
  function applyFilterAndSort() {
    visible = activeFilter === "all"
      ? [...MAHOOR_PRODUCTS]
      : MAHOOR_PRODUCTS.filter((p) => p.category === activeFilter);

    switch (currentSort) {
      case "newest":
        visible.sort((a, b) => Number(b.number) - Number(a.number)); break;
      case "price-low":
        visible.sort((a, b) => a.price - b.price); break;
      case "price-high":
        visible.sort((a, b) => b.price - a.price); break;
      default:
        visible.sort((a, b) => Number(a.number) - Number(b.number));
    }

    render(visible);
  }

  /* ---------- رویدادها ---------- */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      filterButtons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      applyFilterAndSort();
    });
  });

  productsSort?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    applyFilterAndSort();
  });

  productsReset?.addEventListener("click", () => {
    activeFilter = "all";
    currentSort = "default";
    if (productsSort) productsSort.value = "default";
    filterButtons.forEach((b) => {
      const on = b.dataset.filter === "all";
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    applyFilterAndSort();
  });

  productsLoadMore?.addEventListener("click", () => {
    productsLoadMore.disabled = true;
    productsLoadMore.style.opacity = "0.45";
    productsLoadMore.style.cursor = "default";
  });

  /* ---------- رندر اولیه ---------- */
  applyFilterAndSort();
}