// 






const topbar = document.getElementById("mahoorTopbar");
const mahoorMenuToggle = document.querySelector("#mahoorMenuToggle");

const searchButton = document.querySelector(".topbar-search");
const searchInput = document.getElementById("topbarSearchInput");
const searchClose = document.querySelector(".topbar-search-close");

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

const mahoorMobileLinks =
  document.querySelectorAll(".topbar-mobile-nav a");

function toggleMahoorMenu() {
  const isOpen = mahoorTopbar.classList.toggle("is-menu-open");

  mahoorMenuToggle.setAttribute("aria-expanded", isOpen);

  mahoorMenuToggle.innerHTML = isOpen
    ? '<i class="ri-close-line"></i>'
    : '<i class="ri-menu-3-line"></i>';
}

function closeMahoorMenu() {
  mahoorTopbar.classList.remove("is-menu-open");

  mahoorMenuToggle.setAttribute("aria-expanded", "false");

  mahoorMenuToggle.innerHTML =
    '<i class="ri-menu-3-line"></i>';
}

mahoorMenuToggle.addEventListener(
  "click",
  toggleMahoorMenu
);

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