/* Daili site — tiny, dependency-free interactions.
 *
 * Everything here is an enhancement. With JavaScript disabled the page is
 * complete: both store badges render, the language picker is real <a> links,
 * and nothing is hidden behind a script. */
(function () {
  "use strict";

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

  /* ---------- the scroll story ----------
   * One listener, one function, three custom properties.
   *
   *   --idx  on .screen — how far the story has scrolled, in chapters, with a
   *          fraction. The seven stacked screenshots read it and slide.
   *   --p    on each chapter and on each [data-scene] slide around the story
   *          (the hero, the showcase and everything below) — 0 before it
   *          arrives, 1 once it has settled. Everything that builds up is the
   *          .by rule in style.css reading this.
   *   --q    on each chapter — 0..1 as it leaves upwards.
   *
   * The CSS defaults are the finished state (--p:1, --q:0), so a blocked or
   * failed script leaves the whole page visible rather than blank. That is why
   * nothing here unhides anything: it only animates what is already there.
   *
   * idx comes from the chapters' own geometry rather than from "scrolled
   * pixels ÷ one screen": chapters have a min-height, so a long translation is
   * allowed to make one taller than the viewport, and a fixed slide height
   * would put the phone out of step with the words. */
  var story = document.querySelector(".story");
  if (story) {
    var chapters = [].slice.call(story.querySelectorAll(".chapter"));
    var screenEl = story.querySelector(".screen");
    var dots = [].slice.call(story.querySelectorAll(".progress i"));
    var scenes = [].slice.call(document.querySelectorAll("[data-scene]"));
    var calmQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var activeChapter = -1;

    var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var setVar = function (el, name, v) { if (el) el.style.setProperty(name, v.toFixed(3)); };

    /* The header's height is the top edge of every slide. It is --header-h in
       style.css; reading it back is how the two cannot drift apart. */
    function headerHeight() {
      var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
      return isNaN(v) ? 64 : v;
    }

    /* The two-step slides (web, how, compare, pricing). style.css decides when
       they are two screens tall — above 900px, motion allowed — and says so
       by showing their .snap2; this follows it rather than repeating both
       media queries. */
    var twoSteps = scenes.filter(function (s) { return s.classList.contains("two-step"); });
    var stale = true;
    function twoStepOn(s) {
      var snap = s.querySelector(".snap2");
      return !!snap && getComputedStyle(snap).display !== "none";
    }

    /* Where a two-step title has to travel from at the first stop: from its
       settled place to the middle of the pin, measured at --p 0 (big type) and
       with no offset applied. The box is the eyebrow plus the h2's actual text
       (a Range, not the block, which is wider than a short title), so a
       one-word title and a wrapped German one both land centred. Measured
       only when the geometry can have changed: on load, on resize, once the
       display face has loaded. */
    function measure() {
      stale = false;
      twoSteps.forEach(function (s) {
        s._two = twoStepOn(s);
        var head = s.querySelector(".sec-head, .price-head");
        var h2 = head && head.querySelector("h2");
        if (!h2) return;
        head.style.setProperty("--dx", "0px");
        head.style.setProperty("--dy", "0px");
        if (!s._two) return;
        s.style.setProperty("--p", "0");
        var pin = s.querySelector(".pin").getBoundingClientRect();
        var range = document.createRange();
        range.selectNodeContents(h2);
        var t = range.getBoundingClientRect();
        var eb = head.querySelector(".eyebrow");
        var e = eb ? eb.getBoundingClientRect() : t;
        var left = Math.min(t.left, e.left), right = Math.max(t.right, e.right);
        var topY = Math.min(t.top, e.top);
        head.style.setProperty("--dx", ((pin.left + pin.right) / 2 - (left + right) / 2).toFixed(1) + "px");
        head.style.setProperty("--dy", ((pin.top + pin.bottom) / 2 - (topY + t.bottom) / 2).toFixed(1) + "px");
      });
    }

    /* The active chapter only lights its progress dot now: Design B keeps the
       story on one calm ground, so there is no colour to swap. */
    function activate(i) {
      if (i === activeChapter) return;
      activeChapter = i;
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
    }

    function frame() {
      var vh = window.innerHeight;
      var top = headerHeight();
      /* 900px and down is the plain page: no snap, no sticky phone.
         Everything is visible and nothing else here runs. */
      if (window.innerWidth <= 900) {
        chapters.forEach(function (c) {
          setVar(c, "--p", 1); setVar(c, "--q", 0);
        });
        scenes.forEach(function (s) { setVar(s, "--p", 1); });
        activate(0);
        return;
      }
      /* Reduced motion keeps the story — the phone still stacks the right
         screen, the chapters still snap — and drops the building up. */
      var calm = calmQuery ? calmQuery.matches : false;

      /* Chapter 0 is the calendar: the hero is its own slide above the story
         now. Until the first chapter reaches the header idx stays 0, so the
         slab already shows the calendar screen as it scrolls into view. */
      var idx = 0;
      for (var i = 0; i < chapters.length; i++) {
        var r = chapters[i].getBoundingClientRect();
        /* The last chapter whose top has passed under the header, plus how far
           it has scrolled past as a fraction of its own height. */
        if (r.top - top <= 1) idx = i + clamp01((top - r.top) / r.height);
      }
      /* Once the last chapter has scrolled past, idx would run to 7 — one more
         than there are chapters — and the story would lose its active dot
         while it is still partly on screen. */
      if (idx > chapters.length - 1) idx = chapters.length - 1;
      setVar(screenEl, "--idx", idx);

      chapters.forEach(function (c, i) {
        var p = clamp01(1 - (i - idx));
        var q = clamp01((idx - i) / 0.5);
        /* Reduced motion: the words are simply there, no building up. */
        setVar(c, "--p", calm ? 1 : p); setVar(c, "--q", calm ? 0 : q);
      });
      activate(Math.round(idx));

      if (stale) measure();

      /* Every other slide: 0 as the slide's top edge enters at the bottom of
         the viewport, 1 once it sits under the header — and 1 for good once
         it is above that, which is why the hero is complete on load.
         A two-step slide instead: 0 at its first stop (top under the header),
         1 at its second, one screen further down. */
      scenes.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var p = s._two
          ? clamp01((top - r.top) / (vh - top))
          : clamp01((vh - (r.top - top)) / vh);
        setVar(s, "--p", calm ? 1 : p);
      });
    }

    var queued = false;
    function onFrame() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { frame(); queued = false; });
    }
    function onResize() { stale = true; onFrame(); }
    window.addEventListener("scroll", onFrame, { passive: true });
    window.addEventListener("resize", onResize);
    if (calmQuery && calmQuery.addEventListener) calmQuery.addEventListener("change", onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
    frame();
  }

  /* ---------- the two background videos ----------
   * Neither <video> has an autoplay attribute and both are preload="none", so
   * by default the page downloads nothing but the poster, and a paused video
   * shows its poster by itself. This is the only thing that ever starts one,
   * and only while ALL of these hold:
   *   - the viewport is wider than 900px (a phone gets the plain page);
   *   - the visitor has not asked for reduced motion;
   *   - the browser is not in Save-Data mode;
   *   - the video's slide is within one viewport of the visible area.
   * Leaving that range pauses it again. A play() the browser refuses (its own
   * autoplay policy) is simply ignored: the poster stays, which is fine. */
  var videos = [].slice.call(document.querySelectorAll("video[data-autoplay]"));
  if (videos.length && window.matchMedia && "IntersectionObserver" in window) {
    var wideQuery = window.matchMedia("(min-width: 901px)");
    var motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");

    function mayPlay() {
      var conn = navigator.connection;
      return wideQuery.matches && motionQuery.matches && !(conn && conn.saveData === true);
    }
    function sync(v) {
      if (mayPlay() && v._near) {
        if (!v.paused) return;
        v.muted = true;  // the attribute says so too; some engines only trust the property
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () { /* autoplay refused: the poster stays */ });
      } else if (!v.paused) {
        v.pause();
      }
    }
    function syncAll() { videos.forEach(sync); }

    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target._video;
        if (!v) return;
        v._near = e.isIntersecting;
        sync(v);
      });
    }, { rootMargin: "100% 0px" });
    videos.forEach(function (v) {
      var slide = v.closest("section") || v;
      slide._video = v;
      v._near = false;
      near.observe(slide);
    });

    window.addEventListener("resize", syncAll);
    if (motionQuery.addEventListener) motionQuery.addEventListener("change", syncAll);
  }
})();
