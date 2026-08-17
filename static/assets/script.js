/* Daili site — tiny, dependency-free interactions.
 *
 * Everything here is an enhancement. With JavaScript disabled the page is
 * complete: both store badges render, the language picker is real <a> links,
 * and nothing is hidden behind a script. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header shadow on scroll ---------- */
  var header = document.querySelector("header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- disclosure widgets: download menu + language picker ----------
   * One implementation for both. The download menu is a div toggled by class;
   * the picker is a native <details>, which already opens on its own and only
   * needs the outside-click and Escape behaviour. */
  var dl = document.querySelector(".dl");
  if (dl) {
    var btn = dl.querySelector(".dl-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dl.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  function closeAll(except) {
    if (dl && dl !== except) {
      dl.classList.remove("open");
      dl.querySelector(".dl-btn").setAttribute("aria-expanded", "false");
    }
    document.querySelectorAll("details.langpicker[open]").forEach(function (d) {
      if (d !== except) d.removeAttribute("open");
    });
  }
  document.addEventListener("click", function (e) {
    var inDl = dl && dl.contains(e.target);
    var picker = e.target.closest ? e.target.closest("details.langpicker") : null;
    if (!inDl && !picker) closeAll(null);
    else closeAll(inDl ? dl : picker);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll(null);
  });

  /* ---------- remember an explicitly chosen language ----------
   * Written ONLY here, on a real click. The detector in index.html never
   * writes on auto-detection: a preference the user actually expressed is
   * strictly-necessary storage, one we guessed for them is not. That
   * distinction is what keeps this site free of a consent banner. */
  document.querySelectorAll("a[data-lang]").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("daili.lang", a.getAttribute("data-lang")); } catch (err) { /* private mode */ }
    });
  });

  /* ---------- promote the store the visitor can actually use ---------- */
  function platform() {
    var d = navigator.userAgentData;
    var s = (d && d.platform) || navigator.platform || "";
    var ua = navigator.userAgent || "";
    if (/android/i.test(ua)) return "android";
    // iPadOS 13+ reports as a Mac; the touch-point count is what separates them.
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    if (/mac/i.test(s) && navigator.maxTouchPoints > 1) return "ios";
    return null;
  }
  var plat = platform();
  if (plat) {
    document.querySelectorAll(".badges .store-badge").forEach(function (a) {
      var isIos = a.href.indexOf("apps.apple.com") > -1;
      var mine = (plat === "ios") === isIos;
      a.classList.add(mine ? "primary" : "secondary");
    });
  }

  /* ---------- sticky CTA on small screens ---------- */
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    var link = sticky.querySelector("[data-sticky-cta]");
    var badges = document.querySelectorAll(".hero .store-badge");
    if (link && badges.length) {
      // Point it at whichever store matches this device, falling back to the
      // first badge — so the button is never a dead link.
      var target = badges[0];
      if (plat) {
        badges.forEach(function (b) {
          var isIos = b.href.indexOf("apps.apple.com") > -1;
          if ((plat === "ios") === isIos) target = b;
        });
      }
      link.href = target.href;
      link.target = "_blank";
      link.rel = "noopener";
    }
    var dismissed = false;
    sticky.querySelector(".sticky-close").addEventListener("click", function () {
      dismissed = true;
      sticky.hidden = true;
    });
    new IntersectionObserver(function (entries) {
      if (dismissed) return;
      sticky.hidden = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(hero);
  }

  if (reduced || !("IntersectionObserver" in window)) return;

  /* ---------- scroll reveal ---------- */
  var targets = [];
  document.querySelectorAll("section.feature").forEach(function (sec) {
    var txt = sec.querySelector(".txt");
    var art = sec.querySelector(".art");
    var alt = sec.classList.contains("alt");
    if (txt) { txt.classList.add("reveal", alt ? "from-right" : "from-left"); targets.push(txt); }
    if (art) { art.classList.add("reveal", alt ? "from-left" : "from-right", "d1"); targets.push(art); }
  });
  document.querySelectorAll(".trust h2, .faq h2, .steps h2, .gallery h2, .compare h2, .pricing h2").forEach(function (el) {
    el.classList.add("reveal"); targets.push(el);
  });
  document.querySelectorAll(".trust .pill, .step-list li").forEach(function (el, i) {
    el.classList.add("reveal", "d" + Math.min(i % 3 + 1, 3)); targets.push(el);
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

  /* Safety net. .reveal sets opacity:0 and only the observer above clears it,
     so anything that stops the observer firing would leave real content
     permanently invisible. Three seconds after load, reveal whatever is still
     hidden and inside the viewport — the animation is a nicety, the text is not. */
  setTimeout(function () {
    targets.forEach(function (el) {
      if (el.classList.contains("in")) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add("in"); io.unobserve(el); }
    });
  }, 3000);
})();
