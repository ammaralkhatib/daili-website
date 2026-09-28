/* The home page's motion: the mock's boot() and flows()
 * (claude-prompts/2026-09-28/bevel-mock/index.html), ported to the real page.
 *
 * Loaded on the landing page only, after vendor/gsap.min.js,
 * vendor/ScrollTrigger.min.js and vendor/lenis.min.js (all defer, in order).
 * Differences from the mock:
 *   - the window scrolls (the mock scrolled its own box), so ScrollTrigger has
 *     no scroller default and Lenis runs on the window, anchors offset by the
 *     floating header;
 *   - the page is complete without this file: the hero shows its calendar
 *     scene with three unticked cards and step 1 of "See it in action" is
 *     finished. This file hides things only once it is about to animate them;
 *   - the hero has no scroll effect (round 2): its phone plays the seven
 *     scenes by itself, paused while the hero is off screen or the tab hidden;
 *   - /ar/ mirrors: screenshots slide in from the other side and the cards
 *     drift and fly the other way (the marquee's direction is CSS);
 *   - the member count counts up in the page's own number format.
 * Reduced motion: no Lenis, no reveals, no scene loop, step 1 shown still.
 */
(function () {
  "use strict";
  var root = document.querySelector("main.home");
  var g = window.gsap, ST = window.ScrollTrigger, L = window.Lenis;
  if (!root || !g || !ST) return;
  g.registerPlugin(ST);

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOB = window.matchMedia("(max-width: 860px)").matches;
  var D = document.documentElement.dir === "rtl" ? -1 : 1;
  var $ = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };
  var lenis = null;

  // Smooth scroll on the window, driven by GSAP's ticker, feeding ScrollTrigger.
  if (L && !RM) {
    lenis = new L({ autoRaf: false, anchors: { offset: -90 } });
    lenis.on("scroll", ST.update);
    g.ticker.add(function (t) { lenis.raf(t * 1000); });
    g.ticker.lagSmoothing(0);
  }

  // Late images and the web fonts change the layout under every trigger.
  var rf = null;
  var refresh = function () { clearTimeout(rf); rf = setTimeout(function () { ST.refresh(); }, 150); };
  $$("img").forEach(function (im) { if (!im.complete) im.addEventListener("load", refresh, { once: true }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  if (RM) { flows(true); return; }

  // ---------- hero intro ----------
  g.from($$(".hero h1 .w"), { yPercent: 70, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 });
  g.from($$("[data-hi]"), { y: 26, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09, delay: 0.35 });
  g.from(".hphone", { y: 200, opacity: 0, duration: 1.5, ease: "expo.out", delay: 0.4 });
  g.from(".hwatch", { x: 140 * D, y: 140, rotation: 14 * D, opacity: 0, duration: 1.5, ease: "expo.out", delay: 0.6 });
  heroScenes();

  var qr = document.querySelector("[data-qr]");
  if (qr) g.to(qr, { autoAlpha: 0, y: 24, ease: "none", scrollTrigger: { trigger: ".members", start: "top 85%", end: "top 45%", scrub: true } });

  // ---------- generic reveals ----------
  g.set($$("[data-r]"), { opacity: 0, y: 56 });
  ST.batch($$("[data-r]"), { start: "top 90%", once: true, onEnter: function (els) { g.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }); } });

  // member count-up, in this page's own number format
  var cnt = $("[data-count]");
  if (cnt) {
    var fmt = new Intl.NumberFormat(document.documentElement.lang || "en");
    var o = { v: 0 };
    ST.create({ trigger: cnt, start: "top 85%", once: true, onEnter: function () {
      g.to(o, { v: +cnt.dataset.count, duration: 1.8, ease: "power3.out", onUpdate: function () { cnt.textContent = fmt.format(Math.round(o.v)); } });
    } });
  }

  // ---------- feature cards: phones and floating widgets at different speeds ----------
  // (The calendars card has no scroll effect: its orbit turns by itself, CSS.)
  $$(".fcard").forEach(function (card) {
    // ±4 % around its place, so mid-screen the phone is 32 px under the text.
    var ph = card.querySelector(".par");
    if (ph) g.fromTo(ph, { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    $$(".fly", card).forEach(function (f, i) {
      g.fromTo(f, { yPercent: 90, rotation: i % 2 ? 3 : -3 }, { yPercent: -90, rotation: i % 2 ? -2 : 2, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    });
  });
  var bar = $(".fcard .bar");
  if (bar) g.fromTo(bar, { width: "35%" }, { width: "85%", duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 85%", once: true } });

  // ---------- Daili Plus: the avatar strip with its spotlight ----------
  var avWrap = $("[data-avs]"), avTrack = avWrap && $(".avs-track", avWrap), avs = avTrack ? $$(".av", avTrack) : [];
  if (avTrack && avs.length) {
    var x = 0, vel = 0, third = avTrack.scrollWidth / 3;
    window.addEventListener("resize", function () { third = avTrack.scrollWidth / 3; });
    g.ticker.add(function () {
      var boost = lenis ? Math.min(Math.abs(lenis.velocity || 0) * 0.08, 4) : 0;
      vel += ((0.45 + boost) - vel) * 0.08;
      x -= vel; if (third && -x > third) x += third;
      avTrack.style.transform = "translate3d(" + x + "px,0,0)";
      var wr = avWrap.getBoundingClientRect();
      if (wr.bottom < 0 || wr.top > window.innerHeight) return; // off screen: move only
      var cx = wr.left + wr.width / 2;
      for (var i = 0; i < avs.length; i++) {
        var r = avs[i].getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - cx);
        var k = Math.max(0, 1 - d / 260);
        avs[i].style.transform = "scale(" + (0.86 + k * 0.34) + ")";
        avs[i].style.opacity = (0.35 + Math.max(0, 1 - d / 520) * 0.65).toFixed(3);
        avs[i].classList.toggle("on", d < 70);
      }
    });
  }
  // The three cards scroll by normally (bevel.health). On a wide screen the
  // phone in each is fixed mid-screen and clipped by its own card (home.css
  // .fx), so it looks still while the cards pass; its floating card rises
  // slowly as its card goes by. On a phone each card simply holds its phone.
  var intel = $(".intel"), ic = $$(".icard");
  if (!MOB && intel) {
    intel.classList.add("fx");
    ST.create({ trigger: ".stack", start: "top bottom", end: "bottom top", toggleClass: { targets: intel, className: "fx-on" } });
  }
  ic.forEach(function (c) {
    var ai = c.querySelector(".ai-card");
    if (ai) g.fromTo(ai, { yPercent: MOB ? 20 : 70 }, { yPercent: MOB ? -20 : -70, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 0.8 } });
  });

  // ---------- privacy: the lock closes ----------
  var vault = $("[data-vault]");
  if (vault) {
    g.fromTo("[data-shackle]", { y: -80 }, { y: 0, ease: "power2.out", scrollTrigger: { trigger: vault, start: "top 85%", end: "top 25%", scrub: 0.8 } });
    g.fromTo(".lock", { scale: 0.82, opacity: 0.15 }, { scale: 1, opacity: 0.35, ease: "none", scrollTrigger: { trigger: vault, start: "top 90%", end: "top 20%", scrub: 0.8 } });
    g.from($$(".glass span"), { y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".glass", start: "top 90%", once: true } });
    g.from($$(".vault .h2, .vault .sub"), { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: vault, start: "top 70%", once: true } });
  }

  // ---------- the care mosaic: columns drift at different speeds ----------
  $$(".mcol").forEach(function (col, i) {
    var sp = +col.dataset.speed || 1;
    g.fromTo(col, { y: 60 * sp }, { y: -60 * sp, ease: "none", scrollTrigger: { trigger: ".care", start: "top bottom", end: "bottom top", scrub: 1 } });
    g.from($$("div", col), { scale: 0.85, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: i * 0.05, scrollTrigger: { trigger: ".mosaic", start: "top 85%", once: true } });
  });

  // ---------- the final flat-lay: objects slide onto the table ----------
  // Each turns in from its tilt ± 10–14° (alternating) and settles on it.
  var flat = $(".flat");
  if (flat) {
    $$("[data-obj]", flat).forEach(function (o, i) {
      var rot = +o.dataset.rot || 0, turn = (10 + (i % 3) * 2) * (i % 2 ? -1 : 1) * D;
      g.fromTo(o, { x: +o.dataset.fx * (MOB ? 0.5 : 1) * D, y: +o.dataset.fy, rotation: rot + turn, opacity: 0 }, { x: 0, y: 0, rotation: rot, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: flat, start: "top bottom", end: "top 30%", scrub: 1 } });
    });
    g.fromTo(".fphone", { y: 160 }, { y: 0, ease: "power2.out", scrollTrigger: { trigger: flat, start: "top bottom", end: "top 30%", scrub: 1 } });
  }

  flows(false);
  refresh();

  // ---------- hero: the phone plays the app by itself ----------
  // One scene, ~6.5 s, forever: the next screenshot slides in from the
  // inline-end side over the last one; its three cards fade in touching the
  // phone, drift slowly away, get ticked one after the other and fly off.
  // Paused while the hero is off screen or the tab is hidden, resumed where it
  // was. Scene 1 is already on screen (the no-JS state), so it skips the slide.
  function heroScenes() {
    var hero = $(".hero"), shots = $$(".hphone .hs"), cards = $$(".hcard");
    if (!hero || !shots.length) return;
    var n = shots.length, z = 1, cur = null, onScreen = true, shown = !document.hidden;
    var drift = MOB ? 20 : 40;
    // Card 2 sits on the inline-end side of the phone, cards 1 and 3 on the start side.
    var out = function (i, c) { return (c.dataset.k === "1" ? 1 : -1) * D; };
    // Load the later screenshots now (lazy would wait for a scroll that never
    // comes) and park them off the screen's inline-end edge.
    shots.forEach(function (s, i) { if (i) { s.loading = "eager"; g.set(s, { visibility: "visible", xPercent: 100 * D }); } });
    g.set(cards, { visibility: "visible", autoAlpha: 0 });
    var sync = function () { if (cur) cur.paused(!(onScreen && shown)); };
    var scene = function (i, first) {
      var cs = cards.filter(function (c) { return +c.dataset.scene === i; });
      var t0 = first ? -0.7 : 0;
      var tl = g.timeline({ onComplete: function () { scene((i + 1) % n, false); } });
      if (!first) {
        shots[i].style.zIndex = ++z;
        tl.fromTo(shots[i], { xPercent: 100 * D }, { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0);
      }
      cs.forEach(function (c) { c.classList.remove("done"); });
      tl.fromTo(cs, { autoAlpha: 0, x: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.15 }, t0 + 0.7);
      tl.to(cs, { x: function (k, c) { return out(k, c) * drift; }, duration: 2.2, ease: "sine.out" }, t0 + 1.2);
      cs.forEach(function (c, k) { tl.call(function () { c.classList.add("done"); }, null, t0 + 3.5 + k * 0.35); });
      tl.to(cs, { x: function (k, c) { return out(k, c) * (drift + 160); }, autoAlpha: 0, duration: 0.6, ease: "power2.in", stagger: 0.1 }, t0 + 5.3);
      tl.to({}, { duration: 0.2 });
      cur = tl;
      sync();
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener("visibilitychange", function () { shown = !document.hidden; sync(); });
    g.delayedCall(1.1, function () { scene(0, true); });
  }

  // ---------- "See it in action": an auto-advancing list with a phone that plays each moment ----------
  function flows(still) {
    var items = $$(".fl");
    var shots = $$("[data-sx]");
    var overlays = $$("[data-ov],[data-to]");
    var bgc = $("[data-bgc]");
    var jump = $("[data-jump]");
    var cur = 0, live = false, timer = null;
    if (!items.length) return;
    var restart = function (el, on) { el.classList.remove("go"); void el.offsetWidth; if (on) el.classList.add("go"); };
    var show = function (i) {
      cur = i;
      items.forEach(function (it) { it.classList.remove("on"); });
      void root.offsetWidth;
      items[i].classList.add("on");
      shots.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      if (bgc) bgc.style.background = items[i].dataset.tint;
      overlays.forEach(function (el) {
        var mine = el.dataset.ov == i || el.dataset.to == i;
        restart(el, mine && !still);
        if (still) { el.style.opacity = mine ? 1 : ""; el.style.transform = mine ? "none" : ""; }
      });
      if (jump) restart(jump, i === 3 && !still);
      clearTimeout(timer);
      if (live && !still) timer = setTimeout(function () { show((cur + 1) % items.length); }, 6000);
    };
    items.forEach(function (it, k) { it.addEventListener("click", function () { show(k); }); });
    if (still) { show(0); return; }
    ST.create({ trigger: ".flow-grid", start: "top 70%", end: "bottom 20%", onToggle: function (s) { live = s.isActive; if (live) show(cur); else clearTimeout(timer); } });
  }
})();
