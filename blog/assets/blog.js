/* blog.js — runtime niceties for the editorial blog.
   Loaded `defer`, after KaTeX + auto-render (also `defer`), so by the time this
   runs both DOM and renderMathInElement are available. */
(function () {
  "use strict";

  /* ---- 1. equations ---------------------------------------------------- */
  function typeset() {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$",  right: "$",  display: false },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    });
  }

  /* ---- 2. animations: play once when scrolled into view; click to replay */
  function playOnce(stage) {
    var v = stage.querySelector("video");
    if (!v) return;
    if (!v.dataset.loaded) { v.load(); v.dataset.loaded = "1"; }
    try { v.currentTime = 0; } catch (e) {}
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function wireAnimations() {
    var stages = document.querySelectorAll(".anim-stage");
    if (!stages.length) return;

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var io = ("IntersectionObserver" in window)
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            var stage = e.target;
            var v = stage.querySelector("video");
            if (!v) return;
            if (e.isIntersecting) {
              if (stage.dataset.autoplay !== "false" && !stage.dataset.played && !reduce) {
                stage.dataset.played = "1";
                playOnce(stage);
              }
            } else if (!v.loop) {
              v.pause();
            }
          });
        }, { threshold: 0.4 })
      : null;

    stages.forEach(function (stage) {
      var v = stage.querySelector("video");
      var replay = stage.querySelector(".anim-replay");
      if (io) io.observe(stage);
      if (replay) replay.addEventListener("click", function (ev) {
        ev.stopPropagation(); playOnce(stage);
      });
      if (v) v.addEventListener("click", function () { playOnce(stage); });
      // non-IO fallback: just play it
      if (!io && stage.dataset.autoplay !== "false" && !reduce) playOnce(stage);
    });
  }

  /* ---- 3. footnote refs: smooth-scroll isn't needed (notes are in margin),
            but on narrow screens make the [n] toggle keyboard-accessible.    */
  function wireSidenotes() {
    document.querySelectorAll(".sidenote-ref").forEach(function (label) {
      label.setAttribute("tabindex", "0");
      label.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var box = document.getElementById(label.getAttribute("for"));
          if (box) box.checked = !box.checked;
        }
      });
    });
  }

  /* ---- 4. a minimal "← Home" link back to the desktop ----------------- */
  function homeLink() {
    if (document.querySelector(".blog-home")) return;
    var a = document.createElement("a");
    a.className = "blog-home";
    a.href = "/";                       /* the OS desktop (site root) */
    a.setAttribute("aria-label", "Back to home");
    a.textContent = "← Home";
    document.body.appendChild(a);
  }

  function init() {
    typeset();
    wireAnimations();
    wireSidenotes();
    homeLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
