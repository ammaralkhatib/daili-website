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

  /* A store the app cannot be installed from renders as a .soon chip instead
     of a link. That chip is the only signal JS gets — the dead URL is not in
     the page at all — so both the badge identity and availability come from
     the markup: data-store says which store, .soon says it is not live yet. */
  function soonBadge(store) {
    return document.querySelector('.store-badge.soon[data-store="' + store + '"]');
  }

  /* Promote the store the visitor can actually install from. If that store is
     the unavailable one, promote nothing: dressing the other platform's badge
     up as "yours" would send iPhone visitors to Google Play. */
  if (plat && !soonBadge(plat)) {
    document.querySelectorAll(".badges .store-badge").forEach(function (el) {
      if (el.classList.contains("soon")) return;
      var mine = (plat === "ios") === (el.dataset.store === "ios");
      el.classList.add(mine ? "primary" : "secondary");
    });
  }

  /* ---------- "coming soon" chips ----------
   * The note ships visible in the HTML, so with JS off the sentence is simply
   * always there. Only once we can toggle it do we hide it. The partial is on
   * the page three times (nav menu, hero, bottom CTA), so each chip finds its
   * own note by walking up to the shared container — never by id. */
  function noteFor(chip) {
    var box = chip.closest(".badges, .dl-menu");
    return box ? box.querySelector(".store-soon") : null;
  }
  document.querySelectorAll(".store-soon").forEach(function (n) { n.hidden = true; });
  document.querySelectorAll(".store-badge.soon").forEach(function (chip) {
    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      var note = noteFor(chip);
      if (!note) return;
      note.hidden = !note.hidden;
      chip.setAttribute("aria-expanded", note.hidden ? "false" : "true");
    });
  });

  /* ---------- sticky CTA on small screens ---------- */
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    var link = sticky.querySelector("[data-sticky-cta]");
    var heroChip = document.querySelector(".hero .store-badge.soon");
    var heroNote = document.querySelector(".hero .store-soon");
    // Real links only — the "coming soon" chip is a <button> with no href.
    var badges = [].slice.call(document.querySelectorAll(".hero a.store-badge"));

    if (link && plat === "ios" && heroChip) {
      // The one case where there is nothing to link to. Copying the first
      // badge's href here would silently hand iPhone visitors the Google Play
      // listing, so the CTA stops being a link at all and just says why. The
      // sentence is read from the hero note, so there is no second string to
      // translate and no template change.
      var msg = document.createElement("span");
      msg.className = "sticky-soon";
      msg.textContent = heroNote ? heroNote.textContent : "";
      link.parentNode.replaceChild(msg, link);
    } else if (link && badges.length) {
      // Point it at whichever store matches this device, falling back to the
      // first badge — so the button is never a dead link.
      var target = badges[0];
      if (plat) {
        badges.forEach(function (b) {
          if ((plat === "ios") === (b.dataset.store === "ios")) target = b;
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
