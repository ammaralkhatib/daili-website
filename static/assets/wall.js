/* The wall display guide (wall-display/index.html, 2026-11-12/001).
 *
 * Everything here is an enhancement. Without JavaScript the page is one long
 * guide: the device tiles are a jump list and every device's <section>
 * follows the last. With it:
 *   - one device at a time: from #<device id>, else a guess from the user
 *     agent (then the "You seem to be on…" line shows), else the iPad;
 *   - a tap on a device switches without a page jump and updates the hash;
 *   - the "Done" ticks are kept in localStorage ("wall-done") and drive the
 *     "n of 5 done" bar; the page works the same without storage. A plain
 *     device (information, not a setup) has neither in its HTML;
 *   - "Copy" copies a command, or selects it where the clipboard is refused.
 * No words live here: the progress line and "Copied" come from data-
 * attributes the build fills from wall/en.json. */
(function () {
  "use strict";

  var guide = document.getElementById("guide");
  if (!guide) return;
  var sections = Array.prototype.slice.call(guide.querySelectorAll(".wall-dev"));
  if (!sections.length) return;
  var ids = sections.map(function (s) { return s.id; });
  var links = Array.prototype.slice.call(guide.querySelectorAll(".dev"));
  var picked = guide.querySelector(".picked");
  var progressText = guide.getAttribute("data-progress") || "";
  var copiedText = guide.getAttribute("data-copied") || "";

  /* ---------- storage: every read and write may throw ---------- */
  var KEY = "wall-done";
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "{}");
      return v && typeof v === "object" ? v : {};
    } catch (e) { return {}; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* the ticks just are not kept */ }
  }
  var done = load();

  /* ---------- which device ---------- */
  function guess() {
    var u = navigator.userAgent;
    if (/CrOS/.test(u)) return "chromebook";
    if (/Silk|KF[A-Z]{2,}/.test(u)) return "fire";
    if (/Android/.test(u)) return "android";
    if (/iPad|iPhone/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1)) return "ipad";
    if (/Windows/.test(u)) return "windows";
    if (/Macintosh/.test(u)) return "mac";
    if (/Linux/.test(u)) return "pi";
    return "ipad";
  }
  var guessed = guess();
  if (ids.indexOf(guessed) < 0) guessed = ids.indexOf("ipad") < 0 ? ids[0] : "ipad";
  function fromHash() {
    var h = location.hash.slice(1);
    try { h = decodeURIComponent(h); } catch (e) { /* keep it raw */ }
    return ids.indexOf(h) < 0 ? null : h;
  }

  /* ---------- drawing ---------- */
  var current = null;
  function sectionOf(id) { return sections[ids.indexOf(id)]; }

  function update(sec) {
    var jobs = sec.querySelectorAll(".job");
    var n = 0;
    for (var i = 0; i < jobs.length; i++) {
      var box = jobs[i].querySelector("input[data-k]");
      var on = Boolean(box && done[box.getAttribute("data-k")]);
      if (box) box.checked = on;
      jobs[i].classList.toggle("done", on);
      if (on) n++;
    }
    var text = sec.querySelector(".progress span");
    var bar = sec.querySelector(".progress .bar i");
    if (text) text.textContent = progressText.replace("{n}", n).replace("{total}", jobs.length);
    if (bar) bar.style.width = (jobs.length ? n / jobs.length * 100 : 0) + "%";
  }

  function show(id, isGuess) {
    current = id;
    sections.forEach(function (s) { s.hidden = s.id !== id; });
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    if (picked) picked.hidden = !isGuess;
    update(sectionOf(id));
  }

  /* ---------- turn the JavaScript-only parts on ---------- */
  guide.classList.add("js");
  Array.prototype.forEach.call(guide.querySelectorAll(".progress, .check, [data-copy]"), function (el) { el.hidden = false; });

  var start = fromHash();
  show(start || guessed, !start);

  /* ---------- events ---------- */
  guide.addEventListener("click", function (e) {
    var a = e.target.closest(".dev");
    if (a) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // a new tab: leave it to the browser
      var id = a.getAttribute("href").slice(1);
      if (ids.indexOf(id) < 0) return;
      e.preventDefault();
      if (id === current && location.hash) return;
      try { history.pushState(null, "", "#" + id); } catch (err) { location.hash = id; return; }
      show(id, false);
      return;
    }
    var btn = e.target.closest("[data-copy]");
    if (btn) copy(btn);
  });

  guide.addEventListener("change", function (e) {
    var k = e.target.getAttribute && e.target.getAttribute("data-k");
    if (!k) return;
    if (e.target.checked) done[k] = true; else delete done[k];
    save(done);
    update(sectionOf(current));
  });

  /* A typed #windows, or Back/Forward between devices. Any other hash (the
     skip link's #main) leaves the device alone; no hash at all is the entry
     the page opened with, so it goes back to the guess. */
  window.addEventListener("hashchange", function () {
    var id = fromHash();
    if (!id) {
      if (location.hash || current === guessed) return;
      show(guessed, true);
    } else if (id !== current) {
      show(id, false);
    } else return;
    guide.scrollIntoView({ block: "start" });
  });
  window.addEventListener("popstate", function () {
    var id = fromHash();
    if (id && id !== current) show(id, false);
    else if (!location.hash && current !== guessed) show(guessed, true);
  });

  /* ---------- Copy ---------- */
  function selectText(pre) {
    try {
      var r = document.createRange();
      r.selectNodeContents(pre);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    } catch (e) { /* nothing more to do */ }
  }
  function copy(btn) {
    var pre = btn.parentElement.querySelector("pre");
    if (!pre) return;
    if (!btn.hasAttribute("data-label")) btn.setAttribute("data-label", btn.textContent);
    var ok = function () {
      btn.textContent = copiedText || btn.getAttribute("data-label");
      clearTimeout(btn._wallTimer);
      btn._wallTimer = setTimeout(function () { btn.textContent = btn.getAttribute("data-label"); }, 1500);
    };
    try {
      navigator.clipboard.writeText(pre.textContent).then(ok, function () { selectText(pre); });
    } catch (e) {
      selectText(pre);
    }
  }
})();
