/* =========================================================
   MAHOOR — THEME TOGGLE
   Handles dark/light theme switching, persistence,
   system preference and theme-change events.
   ========================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "mahoor-theme";
  var ORBIT_ANIMATION_MS = 800;

  var root = document.documentElement;

  /* -------------------------------------------------------
     STORAGE
     ------------------------------------------------------- */

  function getStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);

      if (stored === "light" || stored === "dark") {
        return stored;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // localStorage may be unavailable.
    }
  }

  /* -------------------------------------------------------
     SYSTEM PREFERENCE
     ------------------------------------------------------- */

  function getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }

    return "dark";
  }

  /* -------------------------------------------------------
     RESOLVE INITIAL THEME
     ------------------------------------------------------- */

  function getInitialTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  /* -------------------------------------------------------
     APPLY THEME
     ------------------------------------------------------- */

  function applyTheme(theme, toggleBtn) {
    var isLight = theme === "light";

    if (isLight) {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }

    if (toggleBtn) {
      toggleBtn.setAttribute(
        "aria-pressed",
        isLight ? "true" : "false"
      );
    }

    root.dispatchEvent(
      new CustomEvent("mahoor:themechange", {
        detail: {
          theme: theme
        }
      })
    );
  }

  /* -------------------------------------------------------
     INITIAL THEME
     ------------------------------------------------------- */

  applyTheme(getInitialTheme(), null);

  /* -------------------------------------------------------
     INITIALIZE TOGGLE
     ------------------------------------------------------- */

  function init() {
    var toggleBtn = document.getElementById("themeToggle");

    if (!toggleBtn) {
      return;
    }

    var currentTheme =
      root.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";

    toggleBtn.setAttribute(
      "aria-pressed",
      currentTheme === "light" ? "true" : "false"
    );

    /* -----------------------------------------------------
       TOGGLE
       ----------------------------------------------------- */

    toggleBtn.addEventListener("click", function () {
      var currentTheme =
        root.getAttribute("data-theme") === "light"
          ? "light"
          : "dark";

      var nextTheme =
        currentTheme === "light"
          ? "dark"
          : "light";

      applyTheme(nextTheme, toggleBtn);
      saveTheme(nextTheme);

      /* Orbit animation */

      toggleBtn.classList.remove("is-changing");

      // Force animation restart
      void toggleBtn.offsetWidth;

      toggleBtn.classList.add("is-changing");

      window.setTimeout(function () {
        toggleBtn.classList.remove("is-changing");
      }, ORBIT_ANIMATION_MS);
    });

    /* -----------------------------------------------------
       SYSTEM THEME CHANGE
       ----------------------------------------------------- */

    if (window.matchMedia) {
      var mediaQuery = window.matchMedia(
        "(prefers-color-scheme: light)"
      );

      var handleSystemThemeChange = function (event) {
        // If the user has explicitly selected a theme,
        // do not override their choice.

        if (getStoredTheme()) {
          return;
        }

        applyTheme(
          event.matches ? "light" : "dark",
          toggleBtn
        );
      };

      /* Modern browsers */

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener(
          "change",
          handleSystemThemeChange
        );
      }

      /* Older browser fallback */

      else if (mediaQuery.addListener) {
        mediaQuery.addListener(
          handleSystemThemeChange
        );
      }
    }
  }

  /* -------------------------------------------------------
     DOM READY
     ------------------------------------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();