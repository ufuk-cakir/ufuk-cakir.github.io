// theme.js — wires the light/dark toggle button(s).
//
// The *initial* theme is applied by a tiny inline script in each page's <head>
// (so there's no flash of the wrong theme before this file loads). This script
// only handles the click: flip the theme, persist the choice, and keep the
// button's accessible label/state in sync. No dependencies.

(function () {
  var root = document.documentElement;
  var btns = document.querySelectorAll("[data-theme-toggle]");
  if (!btns.length) return;

  var STORAGE_KEY = "notes-theme";

  function current() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function apply(theme) {
    root.dataset.theme = theme;
    var toDark = theme !== "dark"; // the button switches you to the *other* mode
    var label = toDark ? "Switch to dark theme" : "Switch to light theme";
    btns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(theme === "dark"));
      b.setAttribute("aria-label", label);
      b.setAttribute("title", label);
    });
  }

  apply(current());

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* private mode / storage disabled — still flips for this session */
      }
      apply(next);
    });
  });

  // If the reader hasn't made an explicit choice, follow the OS as it changes.
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", function (e) {
      if (localStorage.getItem(STORAGE_KEY)) return; // respect an explicit pick
      apply(e.matches ? "dark" : "light");
    });
  } catch (e) {
    /* matchMedia unavailable — ignore */
  }
})();
