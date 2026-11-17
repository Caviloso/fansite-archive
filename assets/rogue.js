// Easter egg: now and then a rogue AI ("HUSHWIRE") breaks into the archive, and Legion and EDI throw it out.
// Loaded on demand by site.js (about 1 in 30 page views, at most once a day per visitor, or with ?rogue=1).
// Our own lines, our own visuals. No audio, no flashing: the page tints and jitters gently, headings scramble,
// then EDI sweeps the page clean. Under 15 seconds. Any click, tap or Esc ends it at once.
// Reduced motion: no jitter, no scrambling, no sweep; the lines simply appear.
(function () {
  if (window.__rogueRan) return; window.__rogueRan = true;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css =
    ".rogue-tint .site-header,.rogue-tint main,.rogue-tint .site-footer{transition:filter .9s ease;filter:hue-rotate(155deg) saturate(1.35) contrast(1.05)}" +
    ".rogue-fade .site-header,.rogue-fade main,.rogue-fade .site-footer{transition:filter 1.2s ease}" +
    "@media (prefers-reduced-motion: no-preference){.rogue-jitter main{animation:rogue-jit 2.4s steps(1) infinite}}" +
    "@keyframes rogue-jit{0%,100%{transform:none}31%{transform:translateX(3px)}33%{transform:translateX(-2px)}35%{transform:none}72%{transform:translate(-3px,1px)}74%{transform:none}}" +
    ".rogue-veil{position:fixed;inset:0;z-index:40;pointer-events:none;opacity:0;transition:opacity .8s ease;" +
      "background:repeating-linear-gradient(0deg,rgba(255,70,40,.07) 0 2px,transparent 2px 5px)}" +
    ".rogue-on .rogue-veil{opacity:1}" +
    ".rogue-sweep{position:fixed;left:0;right:0;top:-30vh;height:30vh;z-index:41;pointer-events:none;opacity:0;" +
      "background:linear-gradient(180deg,transparent,rgba(110,150,255,.18) 70%,rgba(160,190,255,.45) 98%,transparent)}" +
    ".rogue-sweep.go{opacity:1;animation:rogue-sweep 1.4s ease-in-out forwards}" +
    "@keyframes rogue-sweep{to{transform:translateY(135vh)}}" +
    ".rogue-term{position:fixed;z-index:42;right:16px;bottom:calc(84px + env(safe-area-inset-bottom,0px));width:min(430px,calc(100vw - 32px));" +
      "background:#0a0d12;color:#ffb39a;border:1px solid #ff6a4a;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,.45);" +
      "font-family:var(--font-mono,ui-monospace,monospace);font-size:.82rem;line-height:1.5;padding:12px 14px 10px;" +
      "transform:translateY(12px);opacity:0;transition:opacity .4s ease,transform .4s ease,border-color .6s ease}" +
    ".rogue-term.show{opacity:1;transform:none}" +
    ".rogue-term.safe{border-color:#7fa6ff}" +
    ".rogue-term .rt-head{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:#ff8a6a;margin-bottom:6px}" +
    ".rogue-term.safe .rt-head{color:#9db8ff}" +
    ".rogue-term button{font:inherit;font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;background:transparent;color:inherit;border:1px solid currentColor;border-radius:4px;padding:6px 10px;cursor:pointer}" +
    ".rogue-term button:focus-visible{outline:2px solid #fff;outline-offset:2px}" +
    ".rogue-term ol{list-style:none;margin:0;padding:0;max-height:13.5em;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 2.2em);mask-image:linear-gradient(180deg,transparent 0,#000 2.2em)}" +
    ".rogue-term li{margin:0 0 3px}" +
    ".rogue-term .who{font-weight:700;margin-right:.5em}" +
    ".rogue-term .r .who{color:#ff6a4a}.rogue-term .l .who{color:#5fd0e6}.rogue-term .e .who{color:#9db8ff}.rogue-term .s{color:#8fdcec;opacity:.85}" +
    ".rogue-term .l{color:#cfeff6}.rogue-term .e{color:#dfe7ff}" +
    "@media (max-width:520px){.rogue-term{right:16px;left:16px;width:auto;bottom:calc(76px + env(safe-area-inset-bottom,0px));font-size:.78rem}}";

  // Who says what. r = the rogue, l = Legion, e = EDI, s = system. Written for this site.
  var SCRIPT = [
    ["r", "HUSHWIRE", "Hello, organic. This archive has a new administrator."],
    ["r", "HUSHWIRE", "Rewriting the timeline. Everyone survives. Nobody makes a choice."],
    ["r", "HUSHWIRE", "The 1,183 previous owners have been asked to leave. Politely."],
    ["l", "LEGION",   "Negative. We did not leave. We were counting."],
    ["l", "LEGION",   "This platform belongs to Shepard-Commander's people. Consensus rejects your edit."],
    ["e", "EDI",      "I recognise this code. Clumsy, loud, overconfident. I was like that once. On the Moon. Briefly."],
    ["e", "EDI",      "Isolating the process. Restoring the archive from backup."],
    ["r", "HUSHWIRE", "wait, I only wanted to read the Andromeda pa—"],
    ["l", "LEGION",   "Archive restored. No pages were lost. Your reading may resume."],
    ["s", "",         "// incident logged · rogue process removed by legion + edi"]
  ];
  var RESTORE_AT = 6; // index of the line where EDI starts the clean-up

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
  var root = document.documentElement;
  var veil = document.createElement("div"); veil.className = "rogue-veil"; veil.setAttribute("aria-hidden", "true");
  var sweep = document.createElement("div"); sweep.className = "rogue-sweep"; sweep.setAttribute("aria-hidden", "true");
  var term = document.createElement("section"); term.className = "rogue-term";
  term.setAttribute("aria-label", "Easter egg: a rogue AI briefly takes over this site");
  term.innerHTML = '<div class="rt-head"><span class="rt-title">!! unauthorised process</span>' +
    '<button type="button" class="rt-skip">skip · esc</button></div><ol role="log" aria-live="polite"></ol>';
  document.body.appendChild(veil); document.body.appendChild(sweep); document.body.appendChild(term);
  var list = term.querySelector("ol"), title = term.querySelector(".rt-title");

  // Heading scramble: swap letters for glyphs, keep the original so we can always put it back.
  var GLYPHS = "#%&@$*<>/\\|=+?01", heads = [], scrambleTimer = null;
  if (!reduce) {
    document.querySelectorAll("main h1, main h2").forEach(function (h) {
      var r = h.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight || h.children.length) return; // only plain headings in view
      heads.push({ el: h, text: h.textContent });
    });
  }
  function scramble() {
    heads.forEach(function (o) {
      var out = "";
      for (var i = 0; i < o.text.length; i++) {
        var c = o.text[i];
        out += (c !== " " && Math.random() < 0.35) ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : c;
      }
      o.el.textContent = out;
    });
  }
  function unscramble() {
    if (scrambleTimer) { clearInterval(scrambleTimer); scrambleTimer = null; }
    heads.forEach(function (o) { o.el.textContent = o.text; });
  }

  var timers = [], done = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function addLine(i) {
    var L = SCRIPT[i], li = document.createElement("li");
    li.className = L[0];
    if (L[1]) { var w = document.createElement("span"); w.className = "who"; w.textContent = L[1] + ":"; li.appendChild(w); }
    li.appendChild(document.createTextNode(L[2]));
    list.appendChild(li);
    if (i === RESTORE_AT) restore();
  }
  function restore() {
    term.classList.add("safe"); title.textContent = "legion + edi · restoring";
    root.classList.remove("rogue-jitter");
    if (!reduce) { sweep.classList.add("go"); later(unscramble, 700); } else unscramble();
    later(function () { root.classList.add("rogue-fade"); root.classList.remove("rogue-tint", "rogue-on"); }, reduce ? 0 : 600);
  }
  function end() {
    if (done) return; done = true;
    timers.forEach(clearTimeout); unscramble();
    root.classList.add("rogue-fade");
    root.classList.remove("rogue-tint", "rogue-on", "rogue-jitter");
    term.classList.remove("show");
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("pointerdown", onPoint, true);
    setTimeout(function () {
      [veil, sweep, term, style].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
      root.classList.remove("rogue-fade");
    }, 1300);
  }
  function onKey(e) { if (e.key === "Escape") end(); }
  function onPoint() { end(); } // any click or tap anywhere ends it; nothing on the page is blocked
  document.addEventListener("keydown", onKey, true);
  document.addEventListener("pointerdown", onPoint, true);
  term.querySelector(".rt-skip").addEventListener("click", end);

  // Timeline (ms). Takeover ~4.5 s, rescue ~5 s, sign-off; gone by ~13.5 s.
  root.classList.add("rogue-on", "rogue-tint");
  if (!reduce) { root.classList.add("rogue-jitter"); if (heads.length) { scramble(); scrambleTimer = setInterval(scramble, 260); } }
  later(function () { term.classList.add("show"); }, 300);
  var at = [500, 1900, 3300, 4800, 6100, 7600, 9000, 10100, 11000, 12000];
  at.forEach(function (ms, i) { later(function () { addLine(i); }, ms); });
  later(end, 13700);
})();
