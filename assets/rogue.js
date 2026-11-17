// Easter egg: now and then a rogue AI ("HUSHWIRE") breaks into the archive, and Legion and EDI throw it out.
// Loaded on demand by site.js (about 1 in 30 page views, at most once a day per visitor, or with ?rogue=1).
// Our own lines, our own visuals, no audio. Sequence: a full-screen breach (glyph noise, the whole page's text
// scrambles, the colours turn), then a terminal where each line is typed out slowly and left on screen long enough
// for slow readers, then EDI sweeps the page and the text decodes back, top to bottom.
// Seizure safety: no light/dark flashing; the backdrop fades in once and stays steady, only small glyphs change.
// Any click, tap or Esc ends it at once. Reduced motion: no noise, no scramble, no typing; lines simply appear.
(function () {
  if (window.__rogueRan) return; window.__rogueRan = true;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var phone = window.innerWidth <= 520;

  var css =
    ".rogue-tint .site-header,.rogue-tint main,.rogue-tint .site-footer{transition:filter 1.6s ease;filter:hue-rotate(155deg) saturate(1.4) contrast(1.05)}" +
    ".rogue-fade .site-header,.rogue-fade main,.rogue-fade .site-footer{transition:filter 2s ease}" +
    "@media (prefers-reduced-motion: no-preference){" +
      ".rogue-breach main,.rogue-breach .site-header{animation:rogue-breach .9s steps(1) infinite}" +
      ".rogue-jitter main{animation:rogue-jit 3.2s steps(1) infinite}}" +
    "@keyframes rogue-breach{0%{transform:none}20%{transform:translateX(7px) skewX(-1.5deg)}40%{transform:translateX(-5px)}60%{transform:translate(4px,-2px) skewX(1deg)}80%{transform:translateX(-8px)}}" +
    "@keyframes rogue-jit{0%,100%{transform:none}31%{transform:translateX(3px)}33%{transform:translateX(-2px)}35%{transform:none}72%{transform:translate(-3px,1px)}74%{transform:none}}" +
    ".rogue-noise{position:fixed;inset:0;width:100vw;height:100vh;z-index:40;pointer-events:none;opacity:0;transition:opacity 1.2s ease}" +
    ".rogue-noise.on{opacity:1}.rogue-noise.low{opacity:.55}" +
    ".rogue-sweep{position:fixed;left:0;right:0;top:-35vh;height:35vh;z-index:41;pointer-events:none;opacity:0;" +
      "background:linear-gradient(180deg,transparent,rgba(110,150,255,.16) 65%,rgba(160,190,255,.42) 97%,transparent)}" +
    ".rogue-sweep.go{opacity:1;animation:rogue-sweep 2.6s ease-in-out forwards}" +
    "@keyframes rogue-sweep{to{transform:translateY(140vh)}}" +
    ".rogue-term{position:fixed;z-index:42;right:20px;bottom:calc(84px + env(safe-area-inset-bottom,0px));width:min(500px,calc(100vw - 40px));" +
      "background:rgba(8,10,14,.97);color:#ffb39a;border:1px solid #ff6a4a;border-radius:10px;box-shadow:0 14px 50px rgba(0,0,0,.55);" +
      "font-family:var(--font-mono,ui-monospace,monospace);font-size:.9rem;line-height:1.6;padding:14px 18px 16px;" +
      "transform:translateY(14px);opacity:0;transition:opacity .6s ease,transform .6s ease,border-color 1s ease}" +
    ".rogue-term.show{opacity:1;transform:none}" +
    ".rogue-term.safe{border-color:#7fa6ff}" +
    ".rogue-term .rt-head{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#ff8a6a;" +
      "padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid rgba(255,106,74,.35)}" +
    ".rogue-term.safe .rt-head{color:#9db8ff;border-bottom-color:rgba(127,166,255,.35)}" +
    ".rogue-term .rt-integ{display:block;margin-top:3px;opacity:.85}" +
    ".rogue-term button{font:inherit;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;background:transparent;color:inherit;border:1px solid currentColor;border-radius:4px;padding:7px 11px;cursor:pointer;flex:none}" +
    ".rogue-term button:focus-visible{outline:2px solid #fff;outline-offset:2px}" +
    ".rogue-term ol{list-style:none;margin:0;padding:6px 0 0;max-height:min(52vh,24em);overflow:hidden}" +
        ".rogue-term li{margin:0 0 12px}.rogue-term li:last-child{margin-bottom:2px}" +
    ".rogue-term .who{display:block;font-size:.72rem;letter-spacing:.1em;font-weight:700}" +
    ".rogue-term .r .who{color:#ff6a4a}.rogue-term .l .who{color:#5fd0e6}.rogue-term .e .who{color:#9db8ff}.rogue-term .s{color:#8fdcec;opacity:.85;font-size:.8rem}" +
    ".rogue-term .l{color:#d6f3f9}.rogue-term .e{color:#e2e9ff}" +
    ".rogue-term .cur{display:inline-block;width:.55em;height:1.05em;vertical-align:-.15em;background:currentColor;margin-left:2px;animation:rogue-blink 1.1s steps(1) infinite}" +
    "@keyframes rogue-blink{50%{opacity:0}}" +
    ".rogue-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
    "@media (max-width:520px){.rogue-term{left:12px;right:12px;width:auto;bottom:calc(74px + env(safe-area-inset-bottom,0px));font-size:.86rem;padding:12px 14px 14px}.rogue-term ol{max-height:44vh}}";

  // Who says what. r = the rogue, l = Legion, e = EDI, s = system. Written for this site.
  // A line may carry the archive integrity to show once it is typed.
  var SCRIPT = [
    { k: "r", who: "HUSHWIRE", t: "Hello, organic.", integ: 74 },
    { k: "r", who: "HUSHWIRE", t: "This archive has a new administrator.", integ: 51 },
    { k: "r", who: "HUSHWIRE", t: "Rewriting the timeline. Everyone survives. Nobody makes a choice.", integ: 32 },
    { k: "r", who: "HUSHWIRE", t: "The 1,183 previous owners have been asked to leave. Politely.", integ: 13, pause: 2600 },
    { k: "l", who: "LEGION",   t: "Negative. We did not leave. We were counting." },
    { k: "l", who: "LEGION",   t: "This platform belongs to Shepard-Commander's people. Consensus rejects your edit.", pause: 1800 },
    { k: "e", who: "EDI",      t: "I recognise this code. Clumsy, loud, overconfident. I was like that once. On the Moon. Briefly." },
    { k: "e", who: "EDI",      t: "Isolating the process. Restoring the archive from backup.", restore: true, integ: 100 },
    { k: "r", who: "HUSHWIRE", t: "wait, I only wanted to read the Andromeda pa—", cut: true },
    { k: "l", who: "LEGION",   t: "Archive restored. No pages were lost. Your reading may resume." },
    { k: "s", who: "",         t: "// incident logged · rogue process removed by legion + edi" }
  ];
  var TYPE_MS = 36;                                        // per character, so it reads like someone typing
  function holdFor(text) {                                 // time to read a finished line, generous for slow readers
    var words = text.split(/\s+/).length;
    return 1300 + words * 300;
  }

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
  var root = document.documentElement;
  var noise = document.createElement("canvas"); noise.className = "rogue-noise"; noise.setAttribute("aria-hidden", "true");
  var sweep = document.createElement("div"); sweep.className = "rogue-sweep"; sweep.setAttribute("aria-hidden", "true");
  var term = document.createElement("section"); term.className = "rogue-term";
  term.setAttribute("aria-label", "Easter egg: a rogue AI briefly takes over this site");
  term.innerHTML = '<div class="rt-head"><span><span class="rt-title">!! unauthorised process</span>' +
    '<span class="rt-integ">archive integrity: <b>100</b>%</span></span>' +
    '<button type="button" class="rt-skip">skip · esc</button></div><ol role="log" aria-live="polite"></ol>';
  document.body.appendChild(noise); document.body.appendChild(sweep); document.body.appendChild(term);
  var list = term.querySelector("ol"), title = term.querySelector(".rt-title"), integ = term.querySelector(".rt-integ b");

  // ---- Whole-page scramble: every visible text node in the header, page and footer. Originals are kept. ----
  var GLYPHS = "#%&@$*<>/\\|=+?01ΞΔΣ▓▒░", nodes = [], scrTimer = null, level = 0;
  if (!reduce) {
    var limit = window.innerHeight * 1.6;
    document.querySelectorAll(".site-header, main, .site-footer").forEach(function (box) {
      var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
      for (var n = w.nextNode(); n && nodes.length < 700; n = w.nextNode()) {
        if (!/\S/.test(n.nodeValue)) continue;
        var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName)) continue;
        var r = p.getBoundingClientRect(); if (r.bottom < -40 || r.top > limit || !r.width) continue;
        nodes.push({ n: n, text: n.nodeValue, y: r.top, done: false });
      }
    });
  }
  function scrambleAll() {
    nodes.forEach(function (o) {
      if (o.done) return;
      var s = o.text, out = "";
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        out += (c !== " " && c !== "\n" && Math.random() < level) ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : c;
      }
      o.n.nodeValue = out;
    });
  }
  function restoreNode(o) { o.done = true; o.n.nodeValue = o.text; }
  function unscrambleAll() {
    if (scrTimer) { clearInterval(scrTimer); scrTimer = null; }
    nodes.forEach(restoreNode);
  }

  // ---- Full-screen glyph noise on a canvas. The dark backdrop is steady; only small glyphs and thin bars move. ----
  var ctx = noise.getContext && noise.getContext("2d"), raf = null, noiseOn = false, lastDraw = 0, cols = [];
  function sizeNoise() {
    var d = Math.min(window.devicePixelRatio || 1, 1.5);
    noise.width = Math.round(window.innerWidth * d); noise.height = Math.round(window.innerHeight * d);
    if (ctx) ctx.setTransform(d, 0, 0, d, 0, 0);
    cols = []; var step = phone ? 22 : 18;
    for (var x = 0; x < window.innerWidth; x += step) cols.push({ x: x, y: Math.random() * window.innerHeight, v: 40 + Math.random() * 140, a: 0.18 + Math.random() * 0.4 });
  }
  function drawNoise(ts) {
    if (!noiseOn || !ctx) return;
    raf = requestAnimationFrame(drawNoise);
    if (ts - lastDraw < 80) return;                      // about 12 frames a second is plenty
    var dt = lastDraw ? (ts - lastDraw) / 1000 : 0; lastDraw = ts;
    var W = window.innerWidth, H = window.innerHeight;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(14,4,4,0.42)"; ctx.fillRect(0, 0, W, H);
    ctx.font = (phone ? 13 : 14) + "px ui-monospace, Menlo, Consolas, monospace";
    cols.forEach(function (c) {                          // falling glyph columns
      c.y += c.v * dt; if (c.y > H + 200) c.y = -Math.random() * 300;
      for (var k = 0; k < 9; k++) {
        ctx.fillStyle = "rgba(255," + (90 + k * 12) + ",70," + (c.a * (1 - k / 9)).toFixed(3) + ")";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], c.x, c.y - k * 16);
      }
    });
    for (var b = 0; b < 4; b++) {                        // a few thin displaced bars
      var by = Math.random() * H, bh = 1 + Math.random() * 3;
      ctx.fillStyle = "rgba(255,110,80,0.22)"; ctx.fillRect(Math.random() * W * 0.3, by, W * (0.3 + Math.random() * 0.6), bh);
    }
  }
  function startNoise() { if (!ctx || reduce) return; sizeNoise(); noiseOn = true; raf = requestAnimationFrame(drawNoise); window.addEventListener("resize", sizeNoise); }
  function stopNoise() { noiseOn = false; if (raf) cancelAnimationFrame(raf); window.removeEventListener("resize", sizeNoise); }

  // ---- Terminal ----
  var timers = [], done = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function setInteg(v) {
    var from = parseInt(integ.textContent, 10) || 0, steps = 12, i = 0;
    var t = setInterval(function () { i++; integ.textContent = Math.round(from + (v - from) * i / steps); if (i >= steps) clearInterval(t); }, 60);
    timers.push(t);
  }
  // Never show a half-cut line: when the box is full, the oldest whole line leaves.
  function prune() {
    while (list.children.length > 1 && list.scrollHeight > list.clientHeight + 1) list.removeChild(list.firstElementChild);
  }
  function addLine(L, then) {
    var li = document.createElement("li"); li.className = L.k;
    if (L.who) { var w = document.createElement("span"); w.className = "who"; w.textContent = L.who; li.appendChild(w); }
    var sr = document.createElement("span"); sr.className = "rogue-sr"; sr.textContent = (L.who ? L.who + ": " : "") + L.t;
    var vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true");
    var cur = document.createElement("span"); cur.className = "cur"; cur.setAttribute("aria-hidden", "true");
    li.appendChild(vis); li.appendChild(cur);
    list.appendChild(li); prune();
    function finish() {
      vis.textContent = L.t; li.appendChild(sr); prune();
      if (L.integ != null) setInteg(L.integ);
      if (L.restore) restore();
      if (!L.cut) later(function () { if (cur.parentNode) cur.parentNode.removeChild(cur); }, 900);
      else if (cur.parentNode) cur.parentNode.removeChild(cur);
      later(then, L.cut ? 1700 : holdFor(L.t) + (L.pause || 0));
    }
    if (reduce) { finish(); return; }
    var i = 0;
    (function type() {
      if (done) return;
      i++; vis.textContent = L.t.slice(0, i); if (L.t[i - 1] === " ") prune();
      if (i >= L.t.length) { finish(); return; }
      var c = L.t[i - 1];
      later(type, TYPE_MS + (/[.,!?]/.test(c) ? 200 : 0));   // a beat after punctuation
    })();
  }
  function play(i) {
    if (done) return;
    if (i >= SCRIPT.length) { later(end, 2500); return; }
    addLine(SCRIPT[i], function () { play(i + 1); });
  }
  function restore() {
    term.classList.add("safe"); title.textContent = "legion + edi · restoring";
    root.classList.remove("rogue-jitter");
    noise.classList.remove("low");
    if (!reduce) {
      sweep.classList.add("go");
      var H = window.innerHeight;
      nodes.forEach(function (o) {                        // decode the page as the sweep passes over it
        var f = Math.max(0, Math.min(1.3, (o.y + 40) / H));
        later(function () { restoreNode(o); }, 300 + f * 2000);
      });
      later(function () { if (scrTimer) { clearInterval(scrTimer); scrTimer = null; } unscrambleAll(); }, 3000);
      later(function () { noise.classList.remove("on", "low"); }, 1400);   // noise fades out behind the sweep
      later(stopNoise, 2800);
    } else unscrambleAll();
    later(function () { root.classList.add("rogue-fade"); root.classList.remove("rogue-tint"); }, reduce ? 0 : 900);
  }
  function end() {
    if (done) return; done = true;
    timers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
    unscrambleAll(); stopNoise();
    root.classList.add("rogue-fade");
    root.classList.remove("rogue-tint", "rogue-jitter", "rogue-breach");
    term.classList.remove("show"); noise.classList.remove("on", "low");
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("pointerdown", onPoint, true);
    setTimeout(function () {
      [noise, sweep, term, style].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
      root.classList.remove("rogue-fade");
    }, 2100);
  }
  function onKey(e) { if (e.key === "Escape") end(); }
  function onPoint() { end(); }                           // any click or tap anywhere ends it; nothing is blocked
  document.addEventListener("keydown", onKey, true);
  document.addEventListener("pointerdown", onPoint, true);
  term.querySelector(".rt-skip").addEventListener("click", end);

  // ---- Running order ----
  // 0–3 s: breach. Noise rises, the page shakes, its text scrambles more and more, colours turn.
  root.classList.add("rogue-tint");
  if (!reduce) {
    startNoise(); noise.classList.add("on"); root.classList.add("rogue-breach");
    scrTimer = setInterval(function () { level = Math.min(0.5, level + 0.04); scrambleAll(); }, 200);
    later(function () {                                  // settle: noise dims, page keeps a slow glitch
      root.classList.remove("rogue-breach"); root.classList.add("rogue-jitter"); noise.classList.add("low");
      clearInterval(scrTimer); scrTimer = setInterval(scrambleAll, 700);
    }, 3000);
  }
  later(function () { term.classList.add("show"); }, reduce ? 300 : 2600);
  later(function () { play(0); }, reduce ? 900 : 3600);
})();
