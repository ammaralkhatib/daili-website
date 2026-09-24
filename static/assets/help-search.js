/* daili help — search as you type, on /help/ only.
 *
 * No fetch and no inline script: the index is already in the page as
 * <script type="application/json" id="help-index">, which the browser never
 * executes, so the CSP stays exactly as it is. This file only reads it.
 *
 * Every word typed has to appear somewhere in an article's title, summary,
 * keywords, topic or text. Results are built with textContent, never
 * innerHTML. Without this file the page still lists every topic. */
(function () {
  "use strict";

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
  items.forEach(function (it) {
    it.title_ = norm(it.title);
    it.hay = norm([it.title, it.summary, it.keywords, it.topic, it.text].join(" "));
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

  function search() {
    var words = norm(input.value).split(/\s+/).filter(Boolean);
    list.textContent = "";
    if (!words.length) { box.hidden = true; return; }
    var hits = items.filter(function (it) {
      return words.every(function (w) { return it.hay.indexOf(w) >= 0; });
    });
    // A match in the title first, then the page's own order.
    hits.sort(function (x, y) {
      var tx = words.some(function (w) { return x.title_.indexOf(w) >= 0; }) ? 0 : 1;
      var ty = words.some(function (w) { return y.title_.indexOf(w) >= 0; }) ? 0 : 1;
      return tx - ty || items.indexOf(x) - items.indexOf(y);
    });
    hits.forEach(function (it) { list.appendChild(row(it)); });
    none.hidden = hits.length > 0;
    box.hidden = false;
  }

  input.addEventListener("input", search);
  // A query left in the field by the back button runs again.
  if (input.value) search();
})();
