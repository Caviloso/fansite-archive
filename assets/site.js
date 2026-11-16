// N7 Day countdown: counts down to the next 7 November (local time).
(function () {
  var el = document.getElementById("n7-countdown");
  if (!el) return;
  function nextN7(now) {
    var y = now.getFullYear();
    var start = new Date(y, 10, 7);          // 7 Nov, 00:00
    var end = new Date(y, 10, 8);            // the whole day counts
    if (now >= start && now < end) return null;  // it's N7 Day today
    if (now >= end) start = new Date(y + 1, 10, 7);
    return start;
  }
  function render() {
    var now = new Date();
    var target = nextN7(now);
    if (!target) {
      el.innerHTML = '<span class="num">Today</span><span class="unit">Happy N7 Day</span>';
      return;
    }
    var ms = target - now;
    var days = Math.floor(ms / 86400000);
    var hours = Math.floor((ms % 86400000) / 3600000);
    el.innerHTML =
      '<span class="num">' + days + '</span><span class="unit">days</span>' +
      '<span class="num">' + hours + '</span><span class="unit">hours</span>';
    var y = document.getElementById("n7-year");
    if (y) y.textContent = target.getFullYear();
  }
  render();
  setInterval(render, 60000);
})();

// Starfield behind the page header: our own drawing, slow drift, a few twinkles.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvases = document.querySelectorAll("canvas.stars");
  canvases.forEach(function (c) {
    var ctx = c.getContext("2d"); if (!ctx) return;
    var stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function seed() {
      var r = c.getBoundingClientRect(); w = r.width; h = r.height;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((w * h) / 2600); stars = [];
      for (var i = 0; i < n; i++) {
        var z = Math.random();
        stars.push({ x: Math.random() * w, y: Math.random() * h, z: z,
          r: z < 0.85 ? 0.4 + z * 0.7 : 1.1 + Math.random() * 0.9,
          t: Math.random() * Math.PI * 2, warm: Math.random() < 0.08 });
      }
    }
    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduce) { s.x -= 0.02 + s.z * 0.08; if (s.x < -2) s.x = w + 2; }
        var a = 0.35 + s.z * 0.55 + (reduce ? 0 : Math.sin(time / 900 + s.t) * 0.15 * s.z);
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = s.warm ? "#ffd2b0" : "#d9f6ff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(draw);
    }
    seed(); requestAnimationFrame(draw);
    window.addEventListener("resize", function () { seed(); if (reduce) draw(0); });
  });
})();

// N7 ring: how far we are through the year between two N7 Days.
(function () {
  var ring = document.getElementById("n7-ring"); if (!ring) return;
  var now = new Date(), y = now.getFullYear();
  var last = new Date(y, 10, 7); if (now < last) last = new Date(y - 1, 10, 7);
  var next = new Date(last.getFullYear() + 1, 10, 7);
  var pct = Math.max(0, Math.min(100, ((now - last) / (next - last)) * 100));
  requestAnimationFrame(function () { ring.setAttribute("stroke-dasharray", pct.toFixed(1) + " 100"); });
  var lbl = document.getElementById("n7-pct"); if (lbl) lbl.textContent = Math.round(pct) + "% of the way";
})();

// Platform readouts type themselves out. The full text is in the page first, so nothing is lost without JS.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var logs = document.querySelectorAll(".log");
  logs.forEach(function (log) {
    var lines = Array.prototype.slice.call(log.querySelectorAll("p"));
    var saved = lines.map(function (p) { return p.innerHTML; });
    log.setAttribute("aria-busy", "true");
    var minH = log.offsetHeight; log.style.minHeight = minH + "px";
    lines.forEach(function (p) { p.innerHTML = "&nbsp;"; });
    var i = 0;
    function nextLine() {
      if (i >= lines.length) { log.removeAttribute("aria-busy"); return; }
      var p = lines[i], html = saved[i];
      var tmp = document.createElement("div"); tmp.innerHTML = html;
      var key = tmp.querySelector(".k"); var keyHtml = key ? key.outerHTML + " " : "";
      if (key) key.remove();
      var text = tmp.textContent.replace(/^\s+/, ""), n = 0;
      var step = Math.max(1, Math.round(text.length / 30));
      p.classList.add("typing");
      (function type() {
        n = Math.min(text.length, n + step);
        p.innerHTML = keyHtml + text.slice(0, n).replace(/&/g, "&amp;").replace(/</g, "&lt;") || "&nbsp;";
        if (n < text.length) setTimeout(type, 18);
        else { p.classList.remove("typing"); p.innerHTML = html; i++; setTimeout(nextLine, 120); }
      })();
    }
    setTimeout(nextLine, 300);
  });
})();

// Small signs of life: the runtime count drifts, consensus keeps refreshing.
(function () {
  var rt = document.getElementById("runtimes"), ago = document.getElementById("consensus-ago");
  if (!rt || !ago) return;
  setInterval(function () {
    var n = 1183 + Math.round((Math.random() - 0.5) * 6);
    rt.textContent = n.toLocaleString("en-US");
    ago.textContent = (Math.random() * 0.09 + 0.01).toFixed(2);
  }, 2400);
})();

// For organics who open the developer console.
try {
  console.log("%cplatform.notice", "color:#5fd0e6;font-family:monospace;font-weight:bold",
    "\nYou are inspecting this platform. We are inspecting you as well.\nQuery: why does a geth need a code comment?\nResponse: insufficient data.");
} catch (e) {}

// Type "organic" anywhere on the page.
(function () {
  var buf = "", word = "organic";
  document.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    buf = (buf + (e.key || "")).slice(-word.length).toLowerCase();
    if (buf !== word) return;
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status");
    t.textContent = "Organic detected. Hello. We assume you are not the one who wrote this site. Or are you?";
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 6000);
  });
})();

// Timeline: switch between records, filter by era, open spoilers for finished games.
(function () {
  var tabs = document.querySelectorAll('.tl-tabs [role="tab"]');
  if (!tabs.length) return;
  document.documentElement.classList.add("js");
  function show(id) {
    tabs.forEach(function (t) {
      var on = t.id === id; t.setAttribute("aria-selected", on ? "true" : "false");
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { show(t.id); try { history.replaceState(null, "", t.id === "tab-lore" ? "#galaxy" : "#"); } catch (e) {} });
  });
  show(location.hash === "#galaxy" ? "tab-lore" : "tab-real");

  var chips = document.querySelectorAll(".eras .chip"), items = document.querySelectorAll(".lore li");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      var era = c.getAttribute("data-era");
      items.forEach(function (li) { li.hidden = era !== "all" && li.getAttribute("data-era") !== era; });
    });
  });

  var boxes = document.querySelectorAll(".finished input"), KEY = "meu-finished";
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
  function apply() {
    var done = [];
    boxes.forEach(function (b) { if (b.checked) done.push(b.value); });
    document.querySelectorAll("details.spoiler").forEach(function (d) {
      d.open = done.indexOf(d.getAttribute("data-game")) !== -1;
    });
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
  }
  boxes.forEach(function (b) { b.checked = saved.indexOf(b.value) !== -1; b.addEventListener("change", apply); });
  if (saved.length) apply();
})();
