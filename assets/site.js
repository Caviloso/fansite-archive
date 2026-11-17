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

// Starfield behind the page header: our own drawing. Three depth layers drift at different speeds,
// shift with scroll and the mouse (parallax), take the page's colour, and now and then a star falls.
// Reduced motion: one still frame. Phones: fewer stars. Paused while the header is off screen.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  var LAYERS = [ { depth: 0.25, size: [0.35, 0.8], speed: 0.03, alpha: 0.55, share: 0.6 },
                 { depth: 0.6,  size: [0.7, 1.3],  speed: 0.08, alpha: 0.8,  share: 0.3 },
                 { depth: 1.0,  size: [1.2, 2.1],  speed: 0.16, alpha: 1.0,  share: 0.1 } ];
  document.querySelectorAll("canvas.stars").forEach(function (c) {
    var ctx = c.getContext("2d"); if (!ctx) return;
    var sky = c.closest(".sky") || c.parentNode;
    var cs = getComputedStyle(sky);
    var tint = (cs.getPropertyValue("--star-tint") || "").trim() || "#d9f6ff";
    var warm = (cs.getPropertyValue("--star-warm") || "").trim() || "#ffd2b0";
    var stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var px = 0, py = 0, tx = 0, ty = 0, sy = 0, visible = true, running = false, shoot = null, nextShoot = 0;
    function seed() {
      var r = c.getBoundingClientRect(); w = r.width; h = r.height;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var total = Math.round((w * h) / (w < 600 ? 3600 : 2200)); stars = [];
      LAYERS.forEach(function (L, li) {
        var n = Math.round(total * L.share);
        for (var i = 0; i < n; i++) stars.push({ l: li, x: Math.random() * (w + 80) - 40, y: Math.random() * (h + 80) - 40,
          r: L.size[0] + Math.random() * (L.size[1] - L.size[0]), t: Math.random() * 6.3, warm: Math.random() < 0.08 });
      });
    }
    // The Milky Way: a diagonal band of faint stars, glow, clusters and dark dust lanes,
    // painted once per resize onto its own canvas and then moved as a single layer.
    var band = document.createElement("canvas"), PAD = 60;
    function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }
    function paintBand() {
      var bw = w + PAD * 2, bh = h + PAD * 2, small = w < 600;
      band.width = Math.round(bw * dpr); band.height = Math.round(bh * dpr);
      var b = band.getContext("2d"); b.setTransform(dpr, 0, 0, dpr, 0, 0);
      // band runs from lower left to upper right
      var x0 = -bw * 0.1, y0 = bh * 0.95, x1 = bw * 1.1, y1 = bh * 0.05;
      var dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy), nx = -dy / len, ny = dx / len;
      var sigma = Math.min(bh, bw) * 0.16;
      function at(t, off) { return [x0 + dx * t + nx * off, y0 + dy * t + ny * off]; }
      function blob(x, y, r, col, a) {
        var g = b.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(" + col + "," + a + ")"); g.addColorStop(1, "rgba(" + col + ",0)");
        b.fillStyle = g; b.fillRect(x - r, y - r, r * 2, r * 2);
      }
      var cols = ["120,150,255", "150,130,255", "110,200,240", "230,225,255"];
      for (var i = 0; i < (small ? 40 : 90); i++) {
        var t = Math.random(), p = at(t, gauss() * sigma * 0.6);
        blob(p[0], p[1], sigma * (0.5 + Math.random() * 1.1), cols[i % 4], i % 4 === 3 ? 0.05 : 0.075);
      }
      var n = Math.round((bw * bh) / (small ? 200 : 85));
      for (i = 0; i < n; i++) {
        p = at(Math.random(), gauss() * sigma);
        b.globalAlpha = 0.15 + Math.random() * 0.5;
        b.fillStyle = Math.random() < 0.15 ? "#cdd8ff" : (Math.random() < 0.1 ? "#ffe9d6" : "#e8f0ff");
        b.fillRect(p[0], p[1], Math.random() < 0.9 ? 0.7 : 1.2, Math.random() < 0.9 ? 0.7 : 1.2);
      }
      for (var k = 0; k < (small ? 6 : 14); k++) {
        var c0 = at(Math.random(), gauss() * sigma * 0.5), cr = 6 + Math.random() * 16;
        blob(c0[0], c0[1], cr * 2.2, "200,215,255", 0.08);
        for (i = 0; i < 40; i++) {
          b.globalAlpha = 0.3 + Math.random() * 0.6; b.fillStyle = "#eef3ff";
          b.fillRect(c0[0] + gauss() * cr, c0[1] + gauss() * cr, 0.8, 0.8);
        }
      }
      b.globalAlpha = 1;
      // dust lanes: soft, stretched dark streaks along the band that eat some light
      b.globalCompositeOperation = "destination-out";
      for (i = 0; i < (small ? 14 : 30); i++) {
        t = Math.random(); p = at(t, sigma * (0.1 + gauss() * 0.25));
        b.save(); b.translate(p[0], p[1]); b.rotate(Math.atan2(dy, dx) + gauss() * 0.08); b.scale(3.5 + Math.random() * 3, 1);
        var r = sigma * (0.12 + Math.random() * 0.18), g = b.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
        b.fillStyle = g; b.fillRect(-r, -r, r * 2, r * 2); b.restore();
      }
      b.globalCompositeOperation = "source-over";
    }
    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      if (band.width) { ctx.globalAlpha = 0.9; ctx.drawImage(band, -PAD + px * 0.12, -PAD + (py + sy) * 0.12, w + PAD * 2, h + PAD * 2); ctx.globalAlpha = 1; }
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i], L = LAYERS[s.l];
        if (!reduce) { s.x -= L.speed; if (s.x < -40) s.x = w + 40; }
        var x = s.x + px * L.depth, y = s.y + (py + sy) * L.depth;
        var a = L.alpha * (0.75 + (reduce ? 0 : Math.sin(time / 900 + s.t) * 0.25));
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = s.warm ? warm : tint;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.2832); ctx.fill();
        if (s.l === 2 && s.r > 1.7) { ctx.globalAlpha *= 0.25; ctx.beginPath(); ctx.arc(x, y, s.r * 3, 0, 6.2832); ctx.fill(); }
      }
      if (!reduce) {
        if (!shoot && time > nextShoot) {
          if (nextShoot) shoot = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.4, vx: -(6 + Math.random() * 4), vy: 2.2 + Math.random() * 1.5, life: 0 };
          nextShoot = time + 9000 + Math.random() * 14000;
        }
        if (shoot) {
          shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life++;
          var fade = Math.min(1, shoot.life / 6) * Math.max(0, 1 - shoot.life / 55);
          var g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
          g.addColorStop(0, tint); g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = fade; ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14); ctx.stroke();
          if (shoot.life > 55 || shoot.x < -100 || shoot.y > h + 100) shoot = null;
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible) requestAnimationFrame(draw); else running = false;
    }
    function start() { if (!running) { running = true; requestAnimationFrame(draw); } }
    seed(); paintBand(); start();
    window.addEventListener("resize", function () { seed(); paintBand(); if (reduce) start(); });
    if (reduce) return;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }).observe(sky);
    window.addEventListener("scroll", function () { sy = -window.scrollY * 0.25; }, { passive: true });
    if (fine) sky.addEventListener("pointermove", function (e) {
      var r = sky.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * -30;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -20;
    });
  });
  // The nebula glow drifts with scroll too, a little slower than the stars.
  if (!reduce) {
    var neb = document.querySelectorAll(".sky .nebula");
    if (neb.length) window.addEventListener("scroll", function () {
      var y = window.scrollY * 0.12; neb.forEach(function (n) { n.style.transform = "translate3d(0," + y + "px,0)"; });
    }, { passive: true });
  }
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

// Audio channel: the Mass Effect Theme, streamed from Spotify's official embed (nothing is hosted here).
// Browsers do not allow sound before a visitor interacts, so on Home it starts on the first click or tap.
// Spotify is only contacted after that interaction, or when the button is pressed.
(function () {
  var TRACK = "spotify:track:69ySIzFcdu5MDs7CNNTLLk", KEY = "meu-audio";
  var pref = null; try { pref = localStorage.getItem(KEY); } catch (e) {}
  var home = !!document.querySelector(".sky--home");

  var dock = document.createElement("div");
  dock.className = "audio-dock"; dock.setAttribute("data-state", "standby");
  dock.innerHTML =
    '<button type="button" class="audio-btn" aria-pressed="false" aria-label="Play the Mass Effect Theme">' +
      '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="audio-label">audio.channel: standby</span>' +
    '</button>' +
    '<div class="audio-player" hidden><button type="button" class="audio-hide" aria-label="Hide the player (music keeps playing)">hide</button><div id="audio-embed"></div>' +
      '<p class="audio-credit">Mass Effect Theme · Jack Wall &amp; Sam Hulick · streamed from Spotify</p></div>';
  document.body.appendChild(dock);

  var btn = dock.querySelector(".audio-btn"), label = dock.querySelector(".audio-label"),
      panel = dock.querySelector(".audio-player"), ctrl = null, loading = false, playing = false, wantPlay = false;

  function setState(s, text) {
    dock.setAttribute("data-state", s); label.textContent = "audio.channel: " + text;
    btn.setAttribute("aria-pressed", s === "playing" ? "true" : "false");
    btn.setAttribute("aria-label", s === "playing" ? "Pause the Mass Effect Theme" : "Play the Mass Effect Theme");
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function load(then) {
    if (ctrl) { then(); return; }
    wantPlay = true; if (loading) return; loading = true;
    setState("loading", "establishing link…"); panel.hidden = false;
    window.onSpotifyIframeApiReady = function (API) {
      API.createController(document.getElementById("audio-embed"),
        { uri: TRACK, width: "100%", height: 80 },
        function (c) {
          ctrl = c;
          c.addListener("ready", function () { if (wantPlay) { try { c.play(); } catch (e) {} } setState("ready", "linked · press play in the player"); });
          c.addListener("playback_update", function (e) {
            playing = !e.data.isPaused; if (playing) save("on");
            setState(playing ? "playing" : "paused", playing ? "playing" : "paused");
          });
        });
    };
    var s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1"; s.async = true;
    s.onerror = function () { setState("error", "link failed"); panel.hidden = true; };
    document.head.appendChild(s);
  }

  dock.querySelector(".audio-hide").addEventListener("click", function (e) { e.stopPropagation(); panel.hidden = true; });
  btn.addEventListener("click", function (e) {
    if (ctrl && panel.hidden) { panel.hidden = false; }
    e.stopPropagation(); disarm();
    if (!ctrl) { save("on"); load(function () {}); return; }
    if (playing) { ctrl.pause(); save("off"); } else { ctrl.resume ? ctrl.resume() : ctrl.togglePlay(); save("on"); }
  });

  // Home (or any page once a visitor has listened before): the first click, tap or key press starts the theme,
  // unless the visitor switched it off.
  function arm() { load(function () {}); disarm(); }
  function disarm() {
    document.removeEventListener("pointerdown", arm, true);
    document.removeEventListener("keydown", arm, true);
  }
  if (pref === "on" || (home && pref !== "off")) {
    setState("standby", "standby · engages on first contact");
    document.addEventListener("pointerdown", arm, true);
    document.addEventListener("keydown", arm, true);
  }
})();

// Phone menu: below 720px the links fold into a "Menu" button that opens a console-style panel.
// Without JavaScript the links simply wrap, so nothing is ever unreachable.
(function () {
  var header = document.querySelector(".site-header"), nav = header && header.querySelector(".nav");
  if (!nav) return;
  document.documentElement.classList.add("js");
  nav.id = nav.id || "site-nav";
  var links = nav.querySelectorAll("a");
  links.forEach(function (a, i) { a.setAttribute("data-n", (i + 1 < 10 ? "0" : "") + (i + 1)); });
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "menu-btn";
  btn.setAttribute("aria-controls", nav.id); btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<span class="menu-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="menu-label">Menu</span>';
  nav.parentNode.insertBefore(btn, nav);
  function set(open) {
    header.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
  }
  btn.addEventListener("click", function (e) { e.stopPropagation(); set(!header.classList.contains("menu-open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("menu-open")) { set(false); btn.focus(); } });
  document.addEventListener("click", function (e) { if (header.classList.contains("menu-open") && !header.contains(e.target)) set(false); });
  links.forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
  window.addEventListener("resize", function () { if (window.innerWidth > 720) set(false); });
})();

// Easter egg: once in a while a rogue AI "hacks" the archive and Legion and EDI restore it (assets/rogue.js, about 75 s, skippable).
// About 1 in 30 page views, never more than once a day per visitor, never on the error page, only after
// the visitor has been reading for a little while. Add ?rogue=1 to any address to see it right away.
(function () {
  var me = document.currentScript, base = me ? me.src.replace(/site\.js(\?.*)?$/, "") : "assets/";
  var force = /[?&]rogue=1\b/.test(location.search);
  var KEY = "meu-rogue-day", today = new Date().toISOString().slice(0, 10), last = null;
  try { last = localStorage.getItem(KEY); } catch (e) {}
  if (!force) {
    if (document.title.indexOf("Signal lost") !== -1 || /404/.test(location.pathname)) return;
    if (last === today || Math.random() >= 1 / 30) return;
  }
  function go() {
    if (document.hidden) { document.addEventListener("visibilitychange", function v() { if (!document.hidden) { document.removeEventListener("visibilitychange", v); go(); } }); return; }
    try { localStorage.setItem(KEY, today); } catch (e) {}
    var s = document.createElement("script"); s.src = base + "rogue.js"; s.async = true; document.head.appendChild(s);
  }
  setTimeout(go, force ? 1200 : 9000 + Math.random() * 12000);
})();
