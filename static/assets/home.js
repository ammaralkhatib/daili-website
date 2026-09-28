/* The home page's motion: the mock's boot() and flows()
 * (claude-prompts/2026-09-28/bevel-mock/index.html), ported to the real page.
 *
 * Loaded on the landing page only, after vendor/gsap.min.js,
 * vendor/ScrollTrigger.min.js and vendor/lenis.min.js (all defer, in order).
 * Differences from the mock:
 *   - the window scrolls (the mock scrolled its own box), so ScrollTrigger has
 *     no scroller default and Lenis runs on the window, anchors offset by the
 *     floating header;
 *   - the page is complete without this file: the hero cards are rendered
 *     ticked and step 1 of "See it in action" finished. This file unticks and
 *     hides things only once it is about to animate them;
 *   - /ar/ mirrors: the hero cards fly off the other way and the watch drifts
 *     the other way (the marquee's direction is CSS);
 *   - the member count counts up in the page's own number format.
 * Reduced motion: no Lenis, no reveals, the cards ticked, step 1 shown still.
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
  var cards = $$(".hcard");
  cards.forEach(function (c, i) {
    c.classList.remove("done");
    var inn = c.querySelector(".fc-in");
    g.from(inn, { scale: 0.55, opacity: 0, duration: 0.9, ease: "back.out(1.7)", delay: 0.85 + i * 0.08 });
    g.to(inn, { y: (i % 2 ? 10 : -10), rotation: (i % 2 ? 1.2 : -1.2), duration: 2.4 + (i % 3) * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 + i * 0.1 });
  });

  // ---------- hero scroll: phone rises, watch drifts, cards get ticked and fly off ----------
  var order = cards.slice().sort(function (a, b) { return parseFloat(a.style.top) - parseFloat(b.style.top); });
  var at = {};
  order.forEach(function (c, k) { at[c.dataset.i] = 0.03 + k * 0.045; });
  var htl = g.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7,
    onUpdate: function (s) { cards.forEach(function (c) { c.classList.toggle("done", s.progress > at[c.dataset.i]); }); } } });
  htl.to({}, { duration: 1 }, 0);
  htl.to(".hphone", { y: MOB ? -30 : -70, scale: 1.03, ease: "none", duration: 1 }, 0);
  htl.to(".hwatch", { y: MOB ? -90 : -210, x: (MOB ? 10 : 50) * D, rotation: -8 * D, ease: "none", duration: 1 }, 0);
  htl.to(".aurora", { yPercent: 18, ease: "none", duration: 1 }, 0);
  cards.forEach(function (c) {
    var d = +c.dataset.dir * D;
    htl.to(c, { x: d * (MOB ? 90 : 200), y: MOB ? -90 : -170, rotation: d * 10, opacity: 0, ease: "power2.in", duration: 0.26 }, at[c.dataset.i] + 0.07);
  });
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
  $$(".fcard, .wide").forEach(function (card) {
    var ph = card.querySelector(".par");
    if (ph) g.fromTo(ph, { yPercent: 14 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    $$(".fly", card).forEach(function (f, i) {
      g.fromTo(f, { yPercent: 90, rotation: i % 2 ? 3 : -3 }, { yPercent: -90, rotation: i % 2 ? -2 : 2, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    });
  });
  var bar = $(".fcard .bar");
  if (bar) g.fromTo(bar, { width: "35%" }, { width: "85%", duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 85%", once: true } });

  // the calendar orbit turns as you scroll; its tiles stay upright
  var orb = $("[data-orbit]");
  if (orb) {
    g.fromTo(orb, { rotation: -25 }, { rotation: 25, ease: "none", scrollTrigger: { trigger: "#calendars", start: "top bottom", end: "bottom top", scrub: 1 } });
    g.fromTo($$(".tile", orb), { rotation: 25 }, { rotation: -25, ease: "none", scrollTrigger: { trigger: "#calendars", start: "top bottom", end: "bottom top", scrub: 1 } });
  }

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
  // the stacking cards
  var ic = $$(".icard");
  ic.forEach(function (c, i) {
    $$(".fly", c).forEach(function (f) { g.fromTo(f, { yPercent: 40 }, { yPercent: -40, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 0.8 } }); });
    var p = c.querySelector(".phone");
    if (p) g.fromTo(p, { yPercent: 10 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    if (!MOB && ic[i + 1]) g.to(c, { scale: 0.92, opacity: 0.45, ease: "none", scrollTrigger: { trigger: ic[i + 1], start: "top bottom", end: "top 140px", scrub: true } });
  });

  // ---------- the shutter back to light ----------
  g.fromTo($$(".shut-rows i"), { scaleY: 1 }, { scaleY: 0, ease: "none", stagger: { each: 0.07, from: "end" }, scrollTrigger: { trigger: ".flow", start: "top 95%", end: "top 10%", scrub: true } });

  // ---------- privacy: the lock closes ----------
  var vault = $("[data-vault]");
  if (vault) {
    g.fromTo("[data-shackle]", { y: -80 }, { y: 0, ease: "power2.out", scrollTrigger: { trigger: vault, start: "top 85%", end: "top 25%", scrub: 0.8 } });
    g.fromTo(".lock", { scale: 0.82, opacity: 0.4 }, { scale: 1, opacity: 0.9, ease: "none", scrollTrigger: { trigger: vault, start: "top 90%", end: "top 20%", scrub: 0.8 } });
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
  var flat = $(".flat");
  if (flat) {
    $$("[data-obj]", flat).forEach(function (o) {
      g.fromTo(o, { x: +o.dataset.fx * (MOB ? 0.5 : 1) * D, y: +o.dataset.fy, opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: flat, start: "top bottom", end: "top 30%", scrub: 1 } });
    });
    g.fromTo(".fphone", { y: 160 }, { y: 0, ease: "power2.out", scrollTrigger: { trigger: flat, start: "top bottom", end: "top 30%", scrub: 1 } });
  }

  flows(false);
  refresh();

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
