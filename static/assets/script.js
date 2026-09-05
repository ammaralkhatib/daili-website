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

  /* ---------- mobile menu ----------
   * Below 860px the five links and the Download pill live in a panel the
   * burger opens. All this adds is the class: the panel, its position and its
   * animation are CSS, and every link is in the markup at every width — it is
   * hidden, never built here. With this file blocked the <noscript> block in
   * layout.html puts the same links back into the header, so the menu is not
   * something JavaScript grants. */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".menu");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (burger) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!document.body.classList.contains("menu-open"));
    });
  }
  /* An in-page link (#features, #pricing) never reloads, so without this the
     panel stays open over the section it just scrolled to. */
  document.querySelectorAll(".links a.nl").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

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
      closeCards(); // a card inside the menu must not outlive the menu
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
    if (menu && !menu.contains(e.target) && !(burger && burger.contains(e.target))) setMenu(false);
    var inDl = dl && dl.contains(e.target);
    var picker = e.target.closest ? e.target.closest("details.langpicker") : null;
    /* Any click at all dismisses an open "coming soon" card. The chip stops
       propagation so it never reaches here, and the card itself is
       pointer-events:none, so e.target is always something behind it — which
       is how a tap on a badge the card is covering still reaches the badge.
       (closeCards and openChip live in the chips block further down.) */
    closeCards();
    if (!inDl && !picker) closeAll(null);
    else closeAll(inDl ? dl : picker);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    /* A card inside the nav dropdown is the inner layer, so Escape peels it
       off first and hands focus back to the chip that opened it. Closing the
       menu in the same keystroke would strand that focus on a display:none
       button; a second Escape closes the menu, as it always did. */
    if (openChip) {
      var chip = openChip;
      closeCards();
      chip.focus();
      return;
    }
    /* The panel is the outermost layer and the burger is what opened it, so
       Escape hands focus back there rather than leaving it on a link that has
       just been hidden. */
    if (document.body.classList.contains("menu-open")) {
      setMenu(false);
      if (burger) burger.focus();
    }
    closeAll(null);
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
   * always there, a plain line under the badges. Only once we can toggle it do
   * we hide it and promote it to a small card pointing at the chip: sitting in
   * the flow it read as one more line of page copy, so the link between "I
   * tapped App Store" and "here is why nothing happened" was lost.
   *
   * The <p> is never replaced or re-created — it is styled, positioned and
   * hidden in place — so the sentence still comes from the translation file
   * and never from here. The partial is on the page three times (nav menu,
   * hero, bottom CTA), so each chip finds its own note by walking up to the
   * shared container, never by id; the ids handed out below for
   * aria-describedby are generated for the same reason. */
  var GAP = 8;    // chip bottom → card top. The arrow spans exactly this much.
  var EDGE = 16;  // smallest gap the card keeps from the viewport edge
  var ARROW = 12; // the rotated square's side, mirrored in style.css
  var openChip = null;

  function boxFor(chip) { return chip.closest(".badges, .dl-menu"); }
  function noteFor(chip) {
    var box = boxFor(chip);
    return box ? box.querySelector(".store-soon") : null;
  }

  /* Distance from ref's inline-start edge to box's — the left edge in LTR, the
     right one in RTL. Placement is computed entirely in this one axis, which
     is what lets /ar/ mirror without a second code path. */
  function inlineStart(box, ref, rtl) {
    return rtl ? ref.right - box.right : box.left - ref.left;
  }

  /* Absolute, inside the chip's own container, so the card travels with the
     page on scroll and needs no scroll listener. */
  function place(chip, note) {
    var box = boxFor(chip);
    if (!box) return;
    var rtl = getComputedStyle(note).direction === "rtl";
    var b = box.getBoundingClientRect();
    var c = chip.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var w = note.offsetWidth;

    /* Centre on the chip, then clamp to the viewport. Both bounds are in the
       container's coordinates, which is why the container's own distance from
       the viewport edge is subtracted out of each. A card too wide to fit at
       all (viewport under ~312px) parks at the start edge rather than
       oscillating between two impossible bounds. */
    var boxStart = rtl ? vw - b.right : b.left;
    var chipMid = inlineStart(c, b, rtl) + c.width / 2;
    var lo = EDGE - boxStart;
    var hi = vw - EDGE - w - boxStart;
    var start = hi < lo ? lo : Math.min(Math.max(chipMid - w / 2, lo), hi);

    /* Clamping moved the card off the chip, so the arrow moves back by the
       same amount and keeps pointing at it. Its own limits stop it from
       climbing out over the card's rounded corners. */
    var pad = 10;
    var arrow = chipMid - start - ARROW / 2;
    arrow = Math.min(Math.max(arrow, pad), Math.max(w - ARROW - pad, pad));

    note.style.insetInlineStart = Math.round(start) + "px";
    note.style.insetBlockStart = Math.round(c.bottom - b.top + GAP) + "px";
    note.style.setProperty("--soon-arrow", Math.round(arrow) + "px");
  }

  /* One card open at a time. It sweeps every chip rather than trusting
     openChip, so whatever state the page is left in it converges on "all
     closed, all aria-expanded=false". */
  function closeCards() {
    document.querySelectorAll(".store-badge.soon").forEach(function (chip) {
      var note = noteFor(chip);
      if (!note || note.hidden) return;
      note.hidden = true;
      chip.setAttribute("aria-expanded", "false");
      if (openChip === chip) openChip = null;
    });
  }

  var soonId = 0;
  document.querySelectorAll(".store-badge.soon").forEach(function (chip) {
    var note = noteFor(chip);
    if (!note) return;
    note.classList.add("soon-pop");
    note.hidden = true;
    if (!note.id) note.id = "store-soon-" + ++soonId;
    chip.setAttribute("aria-describedby", note.id);
    // Only a still-static container needs promoting to the card's containing
    // block: .dl-menu is absolutely positioned already and has to stay so.
    var box = boxFor(chip);
    if (getComputedStyle(box).position === "static") box.classList.add("soon-anchor");

    chip.addEventListener("click", function (e) {
      e.stopPropagation();   // this is what keeps the nav dropdown open
      var show = note.hidden;
      closeCards();
      if (!show) return;     // a second tap on the same chip just closes it
      note.hidden = false;   // visible before measuring, or offsetWidth is 0
      place(chip, note);
      chip.setAttribute("aria-expanded", "true");
      openChip = chip;
    });
  });

  // No scroll listener — absolute positioning covers that. A resize can change
  // both the clamp and the chip's own place in a wrapping row, so that one is
  // worth recomputing.
  window.addEventListener("resize", function () {
    if (openChip) place(openChip, noteFor(openChip));
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
