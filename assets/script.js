/* FamCanvas site — tiny, dependency-free interactions. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header shadow on scroll */
  var header = document.querySelector("header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Download dropdown */
  var dl = document.querySelector(".dl");
  if (dl) {
    var btn = dl.querySelector(".dl-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dl.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!dl.contains(e.target)) { dl.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dl.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  if (reduced || !("IntersectionObserver" in window)) return;

  /* Tag elements for scroll-reveal */
  var targets = [];
  document.querySelectorAll("section.feature").forEach(function (sec) {
    var txt = sec.querySelector(".txt");
    var art = sec.querySelector(".art");
    var alt = sec.classList.contains("alt");
    if (txt) { txt.classList.add("reveal", alt ? "from-right" : "from-left"); targets.push(txt); }
    if (art) { art.classList.add("reveal", alt ? "from-left" : "from-right", "d1"); targets.push(art); }
  });
  document.querySelectorAll(".trust h2, .faq h2").forEach(function (el) {
    el.classList.add("reveal"); targets.push(el);
  });
  document.querySelectorAll(".trust .pill").forEach(function (el, i) {
    el.classList.add("reveal", "d" + Math.min(i + 1, 3)); targets.push(el);
  });
  document.querySelectorAll(".faq details").forEach(function (el, i) {
    el.classList.add("reveal", "d" + Math.min(i % 4, 3)); targets.push(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  targets.forEach(function (el) { io.observe(el); });
})();
