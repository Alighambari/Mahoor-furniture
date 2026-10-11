
// /* =========================================================
//    MAHOOR — ALL PRODUCTS PAGE
//    ========================================================= */

// document.addEventListener("DOMContentLoaded", () => {
//   const productsGrid = document.getElementById("productsGrid");

//   const productsCount = document.getElementById("productsCount");

//   const productsEmpty = document.getElementById("productsEmpty");

//   const productsReset = document.getElementById("productsReset");

//   const productsLoadMore = document.getElementById("productsLoadMore");

//   const productsSort = document.getElementById("productsSort");

//   const filterButtons = document.querySelectorAll(".products-filter__btn");

//   /* =======================================================
//      STATE
//      ======================================================= */

//   let activeFilter = "all";

//   let currentSort = "default";

//   let visibleProducts = [...MAHOOR_PRODUCTS];

//   /* =======================================================
//      RENDER PRODUCT CARD
//      ======================================================= */

//   function createProductCard(product) {
//     return `
//       <article
//         class="product-card product-card--small reveal"
//         data-product-id="${product.id}"
//         data-category="${product.category}"
//       >

//         <div class="product-card__media">

//           <span class="product-card__number">
//             ${product.number}
//           </span>


//           <button
//             class="product-card__favorite"
//             type="button"
//             aria-label="افزودن ${product.name} به علاقه‌مندی"
//           >
//             ♡
//           </button>


//           <img
//             src="${product.image}"
//             alt="${product.alt}"
//             class="product-card__image"
//             loading="lazy"
//           />


//           <div class="product-card__corners"></div>


//           <div class="product-card__hover-label">

//             <span>
//               EXPLORE
//             </span>

//             <span>
//               ↗
//             </span>

//           </div>

//         </div>


//         <div class="product-card__content">

//           <div class="product-card__title">

//             <span class="product-card__category">
//               ${product.categoryLabel}
//             </span>


//             <h3>
//               ${product.name}
//             </h3>


//             <span class="product-card__english">
//               ${product.englishName}
//             </span>

//           </div>


//           <div class="product-card__details">

//             <span>
//               ${product.material}
//             </span>

//             <strong>
//               ${product.priceLabel}
//             </strong>

//           </div>


//           <div class="product-card__actions">

//             <a
//               href="#"
//               class="product-card__view"
//               data-product-id="${product.id}"
//             >
//               مشاهده محصول

//               <span>
//                 ←
//               </span>
//             </a>


//             <button
//               type="button"
//               class="product-card__cart"
//               data-product-id="${product.id}"
//             >
//               افزودن به سبد
//             </button>

//           </div>

//         </div>

//       </article>
//     `;
//   }

//   /* =======================================================
//      RENDER PRODUCTS
//      ======================================================= */

//   function renderProducts(products) {
//     if (!productsGrid) {
//       return;
//     }

//     productsGrid.innerHTML = "";

//     if (products.length === 0) {
//       productsEmpty.hidden = false;

//       updateProductsCount(0);

//       return;
//     }

//     productsEmpty.hidden = true;

//     const fragment = document.createDocumentFragment();

//     const temporaryContainer = document.createElement("div");

//     temporaryContainer.innerHTML = products.map(createProductCard).join("");

//     while (temporaryContainer.firstElementChild) {
//       fragment.appendChild(temporaryContainer.firstElementChild);
//     }

//     productsGrid.appendChild(fragment);

//     updateProductsCount(products.length);

//     initializeRevealAnimations();
//   }

//   /* =======================================================
//      UPDATE PRODUCT COUNT
//      ======================================================= */

//   function updateProductsCount(count) {
//     if (!productsCount) {
//       return;
//     }

//     productsCount.textContent = String(count).padStart(2, "0");
//   }

//   /* =======================================================
//      FILTER PRODUCTS
//      ======================================================= */

//   function filterProducts() {
//     if (activeFilter === "all") {
//       visibleProducts = [...MAHOOR_PRODUCTS];
//     } else {
//       visibleProducts = MAHOOR_PRODUCTS.filter(
//         (product) => product.category === activeFilter,
//       );
//     }

//     sortProducts();

//     renderProducts(visibleProducts);
//   }

//   /* =======================================================
//      SORT PRODUCTS
//      ======================================================= */

//   function sortProducts() {
//     switch (currentSort) {
//       case "newest":
//         visibleProducts.sort((a, b) => Number(b.number) - Number(a.number));

//         break;

//       case "price-low":
//         visibleProducts.sort((a, b) => a.price - b.price);

//         break;

//       case "price-high":
//         visibleProducts.sort((a, b) => b.price - a.price);

//         break;

//       default:
//         visibleProducts.sort((a, b) => Number(a.number) - Number(b.number));

//         break;
//     }
//   }

//   /* =======================================================
//      FILTER BUTTONS
//      ======================================================= */

//   filterButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       activeFilter = button.dataset.filter;

//       filterButtons.forEach((btn) => {
//         const isActive = btn === button;

//         btn.classList.toggle("is-active", isActive);

//         btn.setAttribute("aria-pressed", String(isActive));
//       });

//       filterProducts();
//     });
//   });

//   /* =======================================================
//      SORT
//      ======================================================= */

//   productsSort?.addEventListener("change", (event) => {
//     currentSort = event.target.value;

//     filterProducts();
//   });

//   /* =======================================================
//      RESET FILTER
//      ======================================================= */

//   productsReset?.addEventListener("click", () => {
//     activeFilter = "all";

//     currentSort = "default";

//     if (productsSort) {
//       productsSort.value = "default";
//     }

//     filterButtons.forEach((button) => {
//       const isAll = button.dataset.filter === "all";

//       button.classList.toggle("is-active", isAll);

//       button.setAttribute("aria-pressed", String(isAll));
//     });

//     filterProducts();
//   });

//   /* =======================================================
//      LOAD MORE
//      ======================================================= */

//   productsLoadMore?.addEventListener("click", () => {
//     /*
//      * فعلاً تمام محصولات موجود هستند.
//      *
//      * وقتی تعداد محصولات زیاد شد،
//      * این قسمت را برای Pagination /
//      * Load More واقعی توسعه می‌دهیم.
//      */

//     productsLoadMore.disabled = true;

//     productsLoadMore.style.opacity = "0.45";

//     productsLoadMore.style.cursor = "default";
//   });

//   /* =======================================================
//      REVEAL ANIMATION
//      ======================================================= */

//   function initializeRevealAnimations() {
//     const revealElements = productsGrid.querySelectorAll(".reveal");

//     if (!revealElements.length) {
//       return;
//     }

//     if (!("IntersectionObserver" in window)) {
//       revealElements.forEach((element) => element.classList.add("is-visible"));

//       return;
//     }

//     const revealObserver = new IntersectionObserver(
//       (entries, observer) => {
//         entries.forEach((entry) => {
//           if (!entry.isIntersecting) {
//             return;
//           }

//           entry.target.classList.add("is-visible");

//           observer.unobserve(entry.target);
//         });
//       },
//       {
//         threshold: 0.12,
//       },
//     );

//     revealElements.forEach((element) => revealObserver.observe(element));
//   }

//   /* =======================================================
//      INITIAL RENDER
//      ======================================================= */

//   sortProducts();

//   renderProducts(visibleProducts);
// });