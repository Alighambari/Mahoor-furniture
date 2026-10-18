// 




const mahoorMobileMenu = document.querySelector(".topbar-mobile-menu");
const mahoorMenuToggle = document.querySelector(".topbar-menu-toggle");
const mahoorMobileLinks = document.querySelectorAll(".topbar-mobile-nav a");

const topbar = document.getElementById("mahoorTopbar");
const searchButton = document.querySelector(".topbar-search");
const searchInput = document.getElementById("topbarSearchInput");
const searchClose = document.querySelector(".topbar-search-close");



  // for search
function openSearch() {
  if (!topbar) return;

  topbar.classList.add("search-open");

  searchButton?.setAttribute("aria-expanded", "true");

  setTimeout(() => {
    searchInput?.focus();
  }, 350);
}

function closeSearch() {
  if (!topbar) return;

  topbar.classList.remove("search-open");

  searchButton?.setAttribute("aria-expanded", "false");

  searchInput?.blur();
}

searchButton?.addEventListener("click", openSearch);

searchClose?.addEventListener("click", closeSearch);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && topbar?.classList.contains("search-open")) {
    closeSearch();
  }
});

document.addEventListener("click", (event) => {
  if (!topbar?.classList.contains("search-open")) {
    return;
  }

  const clickedInsideSearch =
    event.target.closest(".topbar-search-panel");

  const clickedSearchButton =
    event.target.closest(".topbar-search");

  if (!clickedInsideSearch && !clickedSearchButton) {
    closeSearch();
  }
});



// mobile-menu
mahoorMenuToggle.addEventListener("click",toggleMahoorMenu);

mahoorMobileLinks.forEach((link) => {
  link.addEventListener("click", closeMahoorMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMahoorMenu();
  }
});

function updateTopbarScrollState() {
  const isScrolled = window.scrollY > 40;

  topbar.classList.toggle("is-scrolled", isScrolled);
}

window.addEventListener(
  "scroll",
  updateTopbarScrollState,
  { passive: true }
);

updateTopbarScrollState();

function toggleMahoorMenu() {
  if (!topbar || !mahoorMenuToggle || !mahoorMobileMenu) {
    return;
  }

  const isOpen = topbar.classList.toggle("is-menu-open");

  mahoorMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mahoorMobileMenu.setAttribute("aria-hidden", String(!isOpen));
}

function closeMahoorMenu() {
  if (!topbar || !mahoorMenuToggle || !mahoorMobileMenu) {
    return;
  }

  topbar.classList.remove("is-menu-open");

  mahoorMenuToggle.setAttribute("aria-expanded", "false");
  mahoorMobileMenu.setAttribute("aria-hidden", "true");
}

mahoorMenuToggle?.addEventListener("click", toggleMahoorMenu);

mahoorMobileLinks.forEach((link) => {
  link.addEventListener("click", closeMahoorMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMahoorMenu();
  }
});
