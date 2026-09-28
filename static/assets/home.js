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
  // Each floating card has its own speed (round 3): ±yPercent per card, in
  // page order, so no two neighbours move alike in 3, 2 or 1 columns. The
  // habits widget is not a .fly: it stays on its screenshot's energy card.
  var FLY = [30, 55, 20, 60, 35, 50];
  $$(".fcard").forEach(function (card, n) {
    // ±4 % around its place, so mid-screen the phone is 32 px under the text.
    var ph = card.querySelector(".par");
    if (ph) g.fromTo(ph, { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    $$(".fly", card).forEach(function (f, i) {
      var y = FLY[n % FLY.length];
      g.fromTo(f, { yPercent: y, rotation: i % 2 ? 3 : -3 }, { yPercent: -y, rotation: i % 2 ? -2 : 2, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 } });
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
    g.fromTo(".lock", { scale: 0.82, opacity: 0.06 }, { scale: 1, opacity: 0.18, ease: "none", scrollTrigger: { trigger: vault, start: "top 90%", end: "top 20%", scrub: 0.8 } });
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
    var drift = MOB ? 30 : 50;
    // Accelerating, but not from rest: the slope at 0 is 0.1 × 160 px / 0.6 s
    // ≈ 27 px/s, above the drift's ~11 px/s.
    var exitEase = function (p) { return 0.1 * p + 0.9 * p * p; };
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
      // One continuous path per card (round 3): it fades in and starts
      // drifting at the same instant, drifts at one slow speed through the
      // ticking, then speeds up out of that drift and flies off. The exit's
      // ease starts at the drift's speed or above, so it never halts.
      cs.forEach(function (c, k) {
        var d = out(k, c), s = t0 + 0.7 + k * 0.15, e = t0 + 5.3 + k * 0.1;
        c.classList.remove("done");
        tl.fromTo(c, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" }, s);
        tl.fromTo(c, { x: 0 }, { x: d * drift, duration: e - s, ease: "none" }, s);
        tl.call(function () { c.classList.add("done"); }, null, t0 + 3.5 + k * 0.35);
        tl.to(c, { x: d * (drift + 160), autoAlpha: 0, duration: 0.6, ease: exitEase }, e);
      });
      tl.to({}, { duration: 0.2 });
      cur = tl;
      sync();
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener("visibilitychange", function () { shown = !document.hidden; sync(); });
    g.delayedCall(1.1, function () { scene(0, true); });
  }

  // ---------- "See it in action": an auto-advancing list with a phone that plays each moment ----------
  // A step with a real clip (<video data-flow-video>, round 3) plays it from
  // the start, its ring runs for the clip's own length (paused while it loads
  // or stalls), its toast comes when it ends and the next step 1 s later. It
  // plays only while the section is on screen and the tab visible, never with
  // reduced motion or Save-Data: then the clip's poster stands in for the
  // screenshot and the step runs its 6 s like the others.
  function flows(still) {
    var items = $$(".fl");
    var shots = $$("[data-sx]");
    var overlays = $$("[data-ov],[data-to]");
    var bgc = $("[data-bgc]");
    var jump = $("[data-jump]");
    var cur = 0, live = false, timer = null, shown = !document.hidden;
    if (!items.length) return;
    var conn = navigator.connection;
    var clips = !still && !(conn && conn.saveData);
    var vid = function (i) { var s = shots[i]; return s && s.tagName === "VIDEO" ? s : null; };
    var ring = function (i) { return items[i].querySelector(".prog .fg"); };
    var restart = function (el, on) { el.classList.remove("go", "now"); void el.offsetWidth; if (on) el.classList.add("go"); };
    var next = function (ms) { clearTimeout(timer); timer = setTimeout(function () { show((cur + 1) % items.length); }, ms); };
    var mine = function (el, i) { return el.dataset.ov == i || el.dataset.to == i; };
    var stopClip = function (v) { if (v && !v.paused) v.pause(); };
    var show = function (i) {
      stopClip(vid(cur));
      cur = i;
      var v = clips ? vid(i) : null;
      items.forEach(function (it, k) { it.classList.remove("on", "wait"); ring(k).style.animationDuration = ""; });
      void root.offsetWidth;
      items[i].classList.add("on");
      shots.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      if (bgc) bgc.style.background = items[i].dataset.tint;
      overlays.forEach(function (el) {
        var m = mine(el, i);
        // A clip's toast waits for the clip's end instead of its CSS delay.
        restart(el, m && !still && !v);
        if (still) { el.style.opacity = m ? 1 : ""; el.style.transform = m ? "none" : ""; }
      });
      if (jump) restart(jump, i === 3 && !still && !v);
      clearTimeout(timer);
      if (still || !live) return;
      if (!v) { next(6000); return; }
      items[i].classList.add("wait");
      v.muted = true;
      try { v.currentTime = 0; } catch (e) { /* no metadata yet: it starts at 0 anyway */ }
      if (shown) play(v);
    };
    var play = function (v) {
      var p = v.play();
      // A refused play (autoplay policy, decode error): the poster stays and
      // the step runs its 6 s like a screenshot.
      if (p && p.catch) p.catch(function () { if (vid(cur) === v && live) { items[cur].classList.remove("wait"); next(6000); } });
    };
    shots.forEach(function (s, k) {
      if (s.tagName !== "VIDEO" || !clips) return;
      s.addEventListener("playing", function () {
        if (k !== cur) return;
        if (s.duration) ring(k).style.animationDuration = s.duration + "s";
        items[k].classList.remove("wait");
      });
      s.addEventListener("waiting", function () { if (k === cur) items[k].classList.add("wait"); });
      s.addEventListener("pause", function () { if (k === cur && !s.ended) items[k].classList.add("wait"); });
      s.addEventListener("ended", function () {
        if (k !== cur || !live) return;
        overlays.forEach(function (el) { if (mine(el, k)) { restart(el, true); el.classList.add("now"); } });
        if (jump && k === 3) { restart(jump, true); jump.classList.add("now"); }
        next(1000);
      });
    });
    items.forEach(function (it, k) { it.addEventListener("click", function () { show(k); }); });
    if (still) { show(0); return; }
    ST.create({ trigger: ".flow-grid", start: "top 70%", end: "bottom 20%", onToggle: function (s) {
      live = s.isActive;
      if (live) show(cur); else { clearTimeout(timer); stopClip(vid(cur)); }
    } });
    // The first clip starts loading once the section is within half a screen.
    var first = clips ? shots.filter(function (s) { return s.tagName === "VIDEO"; })[0] : null;
    if (first) ST.create({ trigger: ".flow-grid", start: "top 150%", once: true, onEnter: function () { first.preload = "auto"; first.load(); } });
    document.addEventListener("visibilitychange", function () {
      shown = !document.hidden;
      var v = clips ? vid(cur) : null;
      if (!v) return;
      if (!shown) stopClip(v);
      else if (live && !v.ended) play(v);
    });
  }
})();
