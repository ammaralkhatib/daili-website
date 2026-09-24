/* daili help — search as you type on /help/, and the anonymous Help counts.
 *
 * No inline script: the index is already in the page as
 * <script type="application/json" id="help-index">, which the browser never
 * executes, so the CSP stays exactly as it is. This file only reads it.
 *
 * Every word typed has to appear somewhere in an article's title, summary,
 * keywords, topic or text. In the languages written without spaces between
 * words (ja, ko, zh-Hans, zh-Hant, th: help-lib.mjs CHAR_LOCALES) there are no
 * words to split on, so there the whole query, spaces dropped, may also match
 * anywhere in the text with its spaces dropped. Accents never matter. Results
 * are built with textContent, never innerHTML. Without this file the page
 * still lists every topic.
 *
 * The page's words are all in the page already; this file has none of its
 * own. The help locale is the page's <html lang> — a help page only exists in
 * the locales that have a help center.
 *
 * The counts (privacy policy, section 2): "Was this helpful?" on an article,
 * and a search that finds nothing. Each is one POST to our own api with the
 * event and its help locale, nothing else: no cookie (credentials: "omit"), no
 * id, no app_version. Fire and forget: never an error shown, never a retry. */
(function () {
  "use strict";

  // build.mjs puts the real endpoint here (or HELP_EVENTS_URL, for a local
  // test build — check-build refuses to pass anything but the real one).
  var EVENTS_URL = "__HELP_EVENTS_URL__";

  var LOCALE = document.documentElement.getAttribute("lang") || "en";
  var NO_SPACES = ["ja", "ko", "zh-Hans", "zh-Hant", "th"].indexOf(LOCALE) >= 0;

  function send(ev) {
    ev.source = "web";
    ev.platform = "web";
    ev.locale = LOCALE;
    try {
      fetch(EVENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ events: [ev] }),
        credentials: "omit",
        referrerPolicy: "no-referrer",
        keepalive: true
      }).catch(function () {});
    } catch (e) { /* no fetch: nothing is sent, nothing breaks */ }
  }

  // ---- "Was this helpful?" on an article ----------------------------------
  (function () {
    var box = document.getElementById("help-helpful");
    if (!box) return;
    var id = box.getAttribute("data-article");
    var key = "daili-help-helpful:" + id;
    var thanks = document.getElementById("help-helpful-thanks");
    var buttons = box.querySelectorAll("button[data-value]");

    function done() {
      for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
      thanks.hidden = false;
    }

    var answered = false;
    try { answered = localStorage.getItem(key) !== null; } catch (e) { /* no storage: this page view only */ }
    if (answered) done();

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        if (this.disabled) return;
        var value = Number(this.getAttribute("data-value"));
        done();
        try { localStorage.setItem(key, String(value)); } catch (e) { /* see above */ }
        send({ kind: "helpful", subject: id, value: value });
      });
    }
    box.hidden = false;
  })();

  // ---- search, on /help/ --------------------------------------------------
  var input = document.getElementById("help-q");
  var data = document.getElementById("help-index");
  var box = document.getElementById("help-results");
  var list = document.getElementById("help-results-list");
  var none = document.getElementById("help-none");
  if (!input || !data || !box || !list || !none) return;

  var items;
  try { items = JSON.parse(data.textContent); } catch (e) { return; }

  var norm = function (s) {
    s = String(s).toLowerCase();
    return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
  };
  var squash = function (s) { return s.replace(/\s+/g, ""); };
  items.forEach(function (it) {
    it.title_ = norm(it.title);
    it.hay = norm([it.title, it.summary, it.keywords, it.topic, it.text].join(" "));
    if (NO_SPACES) it.hay_ = squash(it.hay);
  });

  var chevron = '<svg class="help-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  function row(it) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.className = "help-row";
    a.href = it.url;
    var span = document.createElement("span");
    var b = document.createElement("b");
    b.textContent = it.title;
    var small = document.createElement("small");
    small.textContent = it.topic + " · " + it.summary;
    span.appendChild(b);
    span.appendChild(small);
    a.appendChild(span);
    // A constant string from this file, not data — the one place markup is set.
    a.insertAdjacentHTML("beforeend", chevron);
    li.appendChild(a);
    return li;
  }

  // A search of 3+ characters that found nothing is counted once the person
  // stops typing for 2 seconds or leaves the field, once per text per page view.
  var missTimer = null;
  var missText = null;
  var missSent = {};
  function sendMiss() {
    clearTimeout(missTimer);
    missTimer = null;
    if (missText === null || missSent[missText]) return;
    missSent[missText] = true;
    send({ kind: "search_miss", subject: missText });
    missText = null;
  }

  function search() {
    var words = norm(input.value).split(/\s+/).filter(Boolean);
    list.textContent = "";
    clearTimeout(missTimer);
    missText = null;
    if (!words.length) { box.hidden = true; return; }
    var whole = squash(words.join(""));
    var hits = items.filter(function (it) {
      if (NO_SPACES && it.hay_.indexOf(whole) >= 0) return true;
      return words.every(function (w) { return it.hay.indexOf(w) >= 0; });
    });
    // A match in the title first, then the page's own order.
    var inTitle = function (it) {
      if (NO_SPACES && squash(it.title_).indexOf(whole) >= 0) return true;
      return words.some(function (w) { return it.title_.indexOf(w) >= 0; });
    };
    hits.sort(function (x, y) {
      var tx = inTitle(x) ? 0 : 1;
      var ty = inTitle(y) ? 0 : 1;
      return tx - ty || items.indexOf(x) - items.indexOf(y);
    });
    hits.forEach(function (it) { list.appendChild(row(it)); });
    none.hidden = hits.length > 0;
    box.hidden = false;

    var typed = input.value.trim();
    if (!hits.length && typed.length >= 3 && !missSent[typed]) {
      missText = typed;
      missTimer = setTimeout(sendMiss, 2000);
    }
  }

  input.addEventListener("input", search);
  input.addEventListener("blur", sendMiss);
  // A query left in the field by the back button runs again.
  if (input.value) search();
})();
