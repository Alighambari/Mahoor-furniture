/* =========================================================
   MAHOOR — THEME TOGGLE (PROFESSIONAL EDITION)
   
   Features:
   - Zero Flash of Unstyled Content (FOUC)
   - System theme synchronization (with legacy Safari support)
   - Local storage persistence with error handling
   - Custom event dispatch for external integrations
   - Smooth CSS animation handling (prevents rapid-click glitches)
   ========================================================= */

(() => {
  'use strict';

  // --- Configuration ---
  const STORAGE_KEY = 'mahoor-theme';
  const ORBIT_ANIMATION_MS = 800; // Matches mahoorOrbitMove in topbar.css
  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

  // --- State Management ---

  /**
   * Retrieves the user's explicitly saved theme from localStorage.
   * @returns {string|null} 'light', 'dark', or null if not set.
   */
  const getStoredTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      // localStorage might be unavailable (private mode, blocked cookies)
      return null;
    }
  };

  /**
   * Determines the initial theme based on saved preference or system settings.
   * @returns {string} 'light' or 'dark'
   */
  const getPreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    return mediaQuery.matches ? 'light' : 'dark';
  };

  // --- DOM Manipulation ---

  /**
   * Applies the given theme to the document and updates the toggle button.
   * @param {string} theme - 'light' or 'dark'
   * @param {HTMLElement|null} toggleBtn - The theme toggle button element
   */
  const applyTheme = (theme, toggleBtn = null) => {
    // 1. Update the DOM
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    // 2. Update Accessibility Attributes
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }

    // 3. Dispatch Custom Event (for other scripts to react)
    root.dispatchEvent(
      new CustomEvent('mahoor:themechange', { detail: { theme } })
    );
  };

  // --- Animation Handling ---

  /**
   * Triggers the orbit animation safely, resetting it if clicked rapidly.
   * @param {HTMLElement} btn - The toggle button
   */
  const triggerOrbitAnimation = (btn) => {
    // Clear any existing timeout to prevent animation stacking
    if (btn._orbitTimeout) {
      clearTimeout(btn._orbitTimeout);
    }

    // Force a reflow to reset the CSS animation
    btn.classList.remove('is-changing');
    void btn.offsetWidth; // Magic line to force browser reflow
    btn.classList.add('is-changing');

    // Remove the class after the animation finishes
    btn._orbitTimeout = setTimeout(() => {
      btn.classList.remove('is-changing');
      btn._orbitTimeout = null;
    }, ORBIT_ANIMATION_MS);
  };

  // --- System Theme Listener ---

  const handleSystemThemeChange = (e) => {
    // Only follow system theme if the user hasn't explicitly chosen one
    if (getStoredTheme()) return;
    
    const toggleBtn = document.getElementById('themeToggle');
    applyTheme(e.matches ? 'light' : 'dark', toggleBtn);
  };

  // =========================================================
  // EXECUTION
  // =========================================================

  // 1. Apply theme IMMEDIATELY (before DOM is fully parsed) to prevent FOUC.
  // NOTE: This script must be loaded in the <head> without 'defer' or 'async'.
  applyTheme(getPreferredTheme(), null);

  // 2. Initialize event listeners once DOM is ready
  const init = () => {
    const toggleBtn = document.getElementById('themeToggle');

    // Sync the button state with the theme applied above
    if (toggleBtn) {
      const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      toggleBtn.setAttribute('aria-pressed', currentTheme === 'light' ? 'true' : 'false');

      // Handle click event
      toggleBtn.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        
        applyTheme(nextTheme, toggleBtn);
        triggerOrbitAnimation(toggleBtn);

        // Persist the choice
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (err) {
          // Ignore storage errors
        }
      });
    }

    // Listen to OS theme changes (with legacy Safari support)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      // Fallback for Safari < 14
      mediaQuery.addListener(handleSystemThemeChange);
    }
  };

  // Start the initialization process
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();