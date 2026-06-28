// notes.js — builds the in-margin table of contents for an essay and keeps the
// current section highlighted as you scroll. No dependencies; degrades to
// nothing if there's no TOC slot or too few headings.

(function () {
  const toc = document.getElementById("essay-toc");
  const body = document.getElementById("content");
  if (!toc || !body) return;

  const headings = Array.from(body.querySelectorAll("h2[id], h3[id]"));
  if (headings.length < 2) {
    toc.remove();
    return;
  }

  const list = document.createElement("ol");
  list.className = "toc-list";
  const linkFor = new Map();

  headings.forEach((h) => {
    const li = document.createElement("li");
    li.className = "toc-item toc-" + h.tagName.toLowerCase();
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + h.id);
    });
    li.appendChild(a);
    list.appendChild(li);
    linkFor.set(h.id, a);
  });

  const heading = document.createElement("p");
  heading.className = "toc-title";
  heading.textContent = "Contents";
  toc.appendChild(heading);
  toc.appendChild(list);

  // Scroll-spy: mark the heading nearest the top of the viewport as current.
  let current = null;
  const setCurrent = (id) => {
    if (id === current) return;
    if (current && linkFor.get(current)) linkFor.get(current).classList.remove("is-current");
    current = id;
    if (current && linkFor.get(current)) linkFor.get(current).classList.add("is-current");
  };

  const onScroll = () => {
    const mark = window.innerHeight * 0.28;
    let active = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= mark) active = h.id;
      else break;
    }
    setCurrent(active);
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();
})();

// "Copy BibTeX" on the Cite-this box
(function () {
  document.querySelectorAll(".cite-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = btn.parentElement.querySelector("pre");
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        const original = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(() => { btn.textContent = original; }, 1400);
      }).catch(() => {});
    });
  });
})();
