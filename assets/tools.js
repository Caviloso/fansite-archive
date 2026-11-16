// Mass Effect Universe · a fan site by Legion
// Fan tools: a playthrough checklist and choices tracker, and a "which squadmate are you?" quiz.
// These are reference tools, not games. Everything is stored only in this browser (localStorage).
// No accounts, no servers, no cookies, nothing sent anywhere.

(function () {
  "use strict";
  var FIN_KEY = "meu-finished"; // shared with the timeline's spoiler shield

  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } }
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function toast(text) {
    var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = text;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 4200);
  }

  // =====================================================================================
  // Playthrough checklist and choices tracker
  // =====================================================================================
  var tracker = document.getElementById("tracker");
  if (tracker) {
    var CLASSES = ["Soldier", "Engineer", "Adept", "Infiltrator", "Sentinel", "Vanguard"];
    var ROMANCE_ME3 = ["Ashley Williams", "Kaidan Alenko", "Liara T'Soni", "Garrus Vakarian", "Tali'Zorah", "Miranda Lawson", "Jack", "Jacob Taylor", "Thane Krios", "Steve Cortez", "Samantha Traynor", "Nobody"];
    var SQUAD_ME2 = ["Shepard", "Miranda Lawson", "Jacob Taylor", "Mordin Solus", "Garrus Vakarian", "Jack", "Grunt", "Tali'Zorah", "Thane Krios", "Samara or Morinth", "Kasumi Goto", "Zaeed Massani", "Legion"];

    var GAMES = [
      { id: "me1", title: "Mass Effect", year: "2007", hero: "Shepard-Commander", profile: "shepard",
        groups: [
          { title: "Main story", note: "Therum, Feros and Noveria can be done in any order.", items: [
            ["eden", "Eden Prime: the opening mission"],
            ["council", "The Citadel: make your case to the Council"],
            ["therum", "Therum: find Dr. T'Soni"],
            ["feros", "Feros"],
            ["noveria", "Noveria"],
            ["virmire", "Virmire", 1],
            ["ilos", "Ilos", 1],
            ["final", "The final mission", 1] ] },
          { title: "Your squad", items: [
            ["kaidan", "Kaidan Alenko (with you from the start)"],
            ["ashley", "Ashley Williams joins"],
            ["garrus", "Garrus Vakarian joins"],
            ["wrex", "Urdnot Wrex joins"],
            ["tali", "Tali'Zorah joins"],
            ["liara", "Liara T'Soni joins"],
            ["talk", "Talk to every squadmate between missions"] ] },
          { title: "Worth your time", items: [
            ["armour", "Help Wrex recover his family armour"],
            ["case", "Help Garrus close an old case"],
            ["sky", "Bring Down the Sky (an add-on, included in Legendary Edition)"],
            ["assign", "Take the side assignments on the Citadel"],
            ["mako", "Explore uncharted worlds in the Mako"],
            ["codex", "Read the Codex. All of it. We did."] ] }
        ],
        choices: [
          { id: "feros", seal: "a choice on Feros", q: "The colonists of Zhu's Hope", o: ["We saved them", "We could not save them"] },
          { id: "rachni", seal: "a choice on Noveria", q: "The rachni queen", o: ["Released her", "Killed her"] },
          { id: "wrex", seal: "a choice on Virmire", q: "Did Wrex leave Virmire alive?", o: ["Yes", "No"] },
          { id: "virmire", seal: "another choice on Virmire", q: "Who stayed behind?", o: ["Ashley Williams", "Kaidan Alenko"] },
          { id: "council", seal: "the final mission", q: "The Council", o: ["Saved them", "Let them fall"] },
          { id: "councilor", seal: "after the final mission", q: "Humanity's Councilor", o: ["Anderson", "Udina"] },
          { id: "romance", seal: "romance", q: "Your romance", o: ["Ashley Williams", "Kaidan Alenko", "Liara T'Soni", "Nobody"] }
        ] },

      { id: "me2", title: "Mass Effect 2", year: "2010", hero: "Shepard-Commander", profile: "shepard",
        groups: [
          { title: "Main story", note: "Recruit the whole team before you go anywhere you cannot come back from.", items: [
            ["opening", "The opening mission"],
            ["freedom", "Freedom's Progress"],
            ["dossiers", "Collect the dossiers and recruit the team"],
            ["horizon", "Horizon", 1],
            ["ship", "The Collector ship", 1],
            ["derelict", "The derelict Reaper", 1],
            ["noreturn", "The point of no return", 1],
            ["final", "The final mission", 1] ] },
          { title: "Recruit", items: [
            ["miranda", "Miranda Lawson"], ["jacob", "Jacob Taylor"], ["mordin", "Mordin Solus"],
            ["archangel", "Archangel"], ["jack", "Jack"], ["grunt", "Grunt"], ["tali", "Tali'Zorah"],
            ["thane", "Thane Krios"], ["samara", "Samara"], ["kasumi", "Kasumi Goto (add-on)"],
            ["zaeed", "Zaeed Massani (add-on)"], ["legion", "Legion", 1] ] },
          { title: "Loyalty missions", note: "Every squadmate has a personal mission. Loyalty matters. We will say no more.", items: [
            ["l-miranda", "Miranda"], ["l-jacob", "Jacob"], ["l-mordin", "Mordin"], ["l-garrus", "Archangel"],
            ["l-jack", "Jack"], ["l-grunt", "Grunt"], ["l-tali", "Tali"], ["l-thane", "Thane"],
            ["l-samara", "Samara"], ["l-kasumi", "Kasumi"], ["l-zaeed", "Zaeed"], ["l-legion", "Legion", 1] ] },
          { title: "Normandy upgrades", note: "This platform recommends all three. It will not say why.", items: [
            ["armour", "Armour plating"], ["shields", "Shielding"], ["gun", "Main gun"] ] },
          { title: "Add-ons in Legendary Edition", items: [
            ["broker", "Lair of the Shadow Broker"], ["overlord", "Overlord"],
            ["arrival", "Arrival (best played after the main story)"] ] }
        ],
        choices: [
          { id: "import", q: "Did you bring your Shepard over from Mass Effect?", o: ["Yes, same Shepard", "No, a new Shepard"] },
          { id: "samara", seal: "a loyalty mission", q: "Who joined you at the end of Samara's mission?", o: ["Samara", "Morinth"] },
          { id: "maelon", seal: "Mordin's loyalty mission", q: "Maelon's research", o: ["Kept it", "Destroyed it"] },
          { id: "heretics", seal: "a loyalty mission later in the game", q: "The heretics", o: ["Rewrote them", "Destroyed them"] },
          { id: "base", seal: "the final mission", q: "The Collector base", o: ["Destroyed it", "Kept it for Cerberus"] },
          { id: "crew", seal: "the final mission", q: "Did the Normandy crew make it home?", o: ["All of them", "Not all of them"] },
          { id: "survivors", seal: "the final mission", q: "Who came back? Tick everyone who survived.", o: SQUAD_ME2, multi: true },
          { id: "romance", seal: "romance", q: "Your romance", o: ["Garrus Vakarian", "Jack", "Jacob Taylor", "Liara T'Soni (from Mass Effect)", "Miranda Lawson", "Tali'Zorah", "Thane Krios", "Kelly Chambers", "Nobody"] }
        ] },

      { id: "me3", title: "Mass Effect 3", year: "2012", hero: "Shepard-Commander", profile: "shepard",
        groups: [
          { title: "Main story", items: [
            ["earth", "The opening on Earth"], ["mars", "Mars"], ["citadel", "The Citadel"],
            ["palaven", "Palaven"], ["surkesh", "Sur'Kesh"],
            ["tuchanka", "Tuchanka", 1], ["coup", "The Citadel, again", 1], ["fleet", "The quarian fleet", 1],
            ["rannoch", "Rannoch", 1], ["thessia", "Thessia", 1], ["horizon", "Horizon", 1],
            ["hq", "Cerberus headquarters", 1], ["final", "The final mission", 1] ] },
          { title: "Your squad", items: [
            ["james", "James Vega"], ["liara", "Liara T'Soni"], ["garrus", "Garrus Vakarian"],
            ["survivor", "The survivor of Virmire", 1], ["tali", "Tali'Zorah", 1], ["edi", "EDI", 1], ["javik", "Javik (From Ashes add-on)", 1] ] },
          { title: "Gather the galaxy", note: "Everything you do adds to your war assets. More is better. That is the whole lesson.", items: [
            ["scan", "Scan star systems for war assets (and leave before the Reapers arrive)"],
            ["side", "Finish side missions before the point of no return"],
            ["crew", "Talk to the crew after every mission"] ] },
          { title: "Add-ons in Legendary Edition", items: [
            ["ashes", "From Ashes"], ["leviathan", "Leviathan"], ["omega", "Omega"],
            ["citadeldlc", "Citadel (play it before the final mission, bring snacks)"] ] }
        ],
        choices: [
          { id: "genophage", seal: "a choice on Tuchanka", q: "The genophage", o: ["Cured it", "Sabotaged the cure"] },
          { id: "rannoch", seal: "a choice on Rannoch", q: "The geth and the quarians", o: ["Peace between them", "Sided with the quarians", "Sided with the geth"],
            edi: "Legion asked me to log this one for you. I did not ask why." },
          { id: "romance", seal: "romance", q: "Your romance", o: ROMANCE_ME3 },
          { id: "ending", seal: "the very end. Open only when you are done", q: "Your final choice", o: ["Destroy", "Control", "Synthesis", "Refuse"] }
        ] },

      { id: "mea", title: "Andromeda", year: "2017", hero: "Pathfinder", profile: "ryder",
        groups: [
          { title: "Main story", items: [
            ["h7", "Habitat 7: planetfall"], ["nexus", "The Nexus"], ["eos", "Eos"], ["aya", "Aya"],
            ["havarl", "Havarl"], ["voeld", "Voeld"], ["kadara", "Kadara"], ["elaaden", "Elaaden"],
            ["hunt", "The hunt for the Archon", 1], ["final", "The final mission", 1] ] },
          { title: "Your squad", items: [
            ["liam", "Liam Kosta"], ["cora", "Cora Harper"], ["peebee", "Peebee"], ["vetra", "Vetra Nyx"],
            ["drack", "Nakmor Drack"], ["jaal", "Jaal Ama Darav"] ] },
          { title: "Loyalty missions", items: [
            ["l-liam", "Liam"], ["l-cora", "Cora"], ["l-peebee", "Peebee"], ["l-vetra", "Vetra"],
            ["l-drack", "Drack"], ["l-jaal", "Jaal"] ] },
          { title: "Worth your time", items: [
            ["viability", "Raise every golden world to 100% viability"],
            ["tempest", "Talk to the crew on the Tempest"],
            ["scan", "Scan everything. Your science officer will be pleased."] ] }
        ],
        choices: [
          { id: "eos", seal: "a choice on Eos", q: "Your first outpost", o: ["Science focus", "Military focus"] },
          { id: "kadara", seal: "a choice on Kadara", q: "Who did you back on Kadara?", o: ["Sloane Kelly", "Reyes Vidal"] },
          { id: "rescue", seal: "a choice during the hunt for the Archon", q: "Who did you rescue?", o: ["The salarian Pathfinder", "The krogan scouts"] },
          { id: "romance", seal: "romance", q: "Your romance", o: ["Cora Harper", "Liam Kosta", "Peebee", "Jaal Ama Darav", "Vetra Nyx", "Suvi Anwar", "Gil Brodie", "Reyes Vidal", "Keri T'Vessa", "Avela Kjar", "Nobody"] }
        ] }
    ];

    var KEY = "meu-runs";
    var state = load(KEY, null);
    var canSave = store("meu-test", 1); try { localStorage.removeItem("meu-test"); } catch (e) {}
    function newRun(name) { return { name: name, created: new Date().toISOString().slice(0, 10), profile: {}, games: {} }; }
    function valid(s) { return s && typeof s === "object" && s.runs && typeof s.runs === "object" && Object.keys(s.runs).length; }
    if (!valid(state)) state = { v: 1, active: "r1", game: "me1", runs: { r1: newRun("Run 1") } };
    if (!state.runs[state.active]) state.active = Object.keys(state.runs)[0];
    function run() { return state.runs[state.active]; }
    function gameData(id) { var r = run(); r.games[id] = r.games[id] || { done: {}, choices: {}, notes: "" }; return r.games[id]; }
    function save() { if (!store(KEY, state) && canSave) { canSave = false; toast("We could not save. Your browser may be full or in private mode."); } }

    var finished = load(FIN_KEY, []);
    if (!Array.isArray(finished)) finished = [];
    function isFin(id) { return finished.indexOf(id) !== -1; }
    function setFin(id, on) {
      finished = finished.filter(function (x) { return x !== id; }); if (on) finished.push(id);
      store(FIN_KEY, finished);
    }

    var tabsEl = tracker.querySelector(".tk-games"), panel = tracker.querySelector(".tk-panel"),
        runSel = tracker.querySelector("#run-select"), runName = tracker.querySelector("#run-name");

    // Game tabs
    tabsEl.innerHTML = GAMES.map(function (g) {
      return '<button type="button" role="tab" id="tab-' + g.id + '" aria-controls="tk-panel" data-game="' + g.id + '">' +
        esc(g.title) + '<span class="tk-tabpct" data-pct="' + g.id + '">0%</span></button>';
    }).join("");
    tabsEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-game]"); if (!b) return;
      state.game = b.getAttribute("data-game"); save(); render();
    });

    function counts(g) {
      var d = gameData(g.id), total = 0, done = 0;
      g.groups.forEach(function (gr) { gr.items.forEach(function (it) { total++; if (d.done[it[0]]) done++; }); });
      return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0 };
    }
    function verdict(g, pct) {
      var who = g.hero;
      if (g.id === "mea") {
        if (pct === 0) return "No data logged. We were not in Andromeda. We are told the Pathfinder managed. Prove it.";
        if (pct < 50) return "Data received. The Pathfinder is making progress. This platform is observing from very far away.";
        if (pct < 100) return "Most objectives logged. The Initiative would be pleased. Probably.";
        return "Every objective logged. Consensus: a home was found. Well done, Pathfinder.";
      }
      if (pct === 0) return "No data logged. This platform is patient, " + who + ". Mostly.";
      if (pct < 25) return "Data received. Proceed, " + who + ".";
      if (pct < 50) return "Progress noted. We have run the numbers. Keep going.";
      if (pct < 75) return "More than half logged. Consensus: you are doing well. We do not say this often.";
      if (pct < 100) return "Nearly complete. Do not stop now, " + who + ".";
      return "Every objective logged. Consensus: perfect record. We have saved a copy. For science.";
    }

    function opt(list, val) {
      return '<option value="">Not set</option>' + list.map(function (x) {
        return '<option' + (val === x ? " selected" : "") + ">" + esc(x) + "</option>";
      }).join("");
    }
    function profileHtml(g) {
      var p = run().profile;
      if (g.profile === "ryder") {
        p.mea = p.mea || {};
        return '<fieldset class="tk-profile"><legend>Your Ryder</legend>' +
          '<label>First name <input type="text" data-prof="mea.name" maxlength="40" value="' + esc(p.mea.name || "") + '" placeholder="Ryder"></label>' +
          '<label>Twin <select data-prof="mea.twin">' + opt(["Sara Ryder", "Scott Ryder"], p.mea.twin) + "</select></label></fieldset>";
      }
      p.shepard = p.shepard || {};
      var s = p.shepard;
      return '<fieldset class="tk-profile"><legend>Your Shepard (shared by all three games in this run)</legend>' +
        '<label>First name <input type="text" data-prof="shepard.name" maxlength="40" value="' + esc(s.name || "") + '" placeholder="Shepard"></label>' +
        '<label>Class <select data-prof="shepard.cls">' + opt(CLASSES, s.cls) + "</select></label>" +
        '<label>Origin <select data-prof="shepard.origin">' + opt(["Spacer", "Colonist", "Earthborn"], s.origin) + "</select></label>" +
        '<label>Service history <select data-prof="shepard.history">' + opt(["Sole Survivor", "War Hero", "Ruthless"], s.history) + "</select></label></fieldset>";
    }

    function itemHtml(g, it) {
      var d = gameData(g.id), id = g.id + "-" + it[0];
      return '<li><label><input type="checkbox" data-item="' + esc(it[0]) + '" id="i-' + id + '"' + (d.done[it[0]] ? " checked" : "") + "> " +
        "<span>" + esc(it[1]) + "</span></label></li>";
    }
    function groupHtml(g, gr, gi) {
      var open = gr.items.filter(function (it) { return !it[2]; }), later = gr.items.filter(function (it) { return it[2]; });
      var d = gameData(g.id), doneN = gr.items.filter(function (it) { return d.done[it[0]]; }).length;
      var h = '<section class="tk-group"><h3>' + esc(gr.title) + ' <span class="tk-count">' + doneN + "/" + gr.items.length + "</span></h3>";
      if (gr.note) h += '<p class="tk-note">' + esc(gr.note) + "</p>";
      h += '<ul class="tk-list">' + open.map(function (it) { return itemHtml(g, it); }).join("") + "</ul>";
      if (later.length) {
        h += '<details class="spoiler tk-seal" data-seal="' + g.id + "-" + gi + '"' + (isFin(g.id) ? " open" : "") + ">" +
          "<summary>Sealed: " + later.length + " more, later in the game. Names can spoil. Open?</summary>" +
          '<ul class="tk-list">' + later.map(function (it) { return itemHtml(g, it); }).join("") + "</ul></details>";
      }
      return h + "</section>";
    }
    function choiceHtml(g, c) {
      var d = gameData(g.id), val = d.choices[c.id], name = "c-" + g.id + "-" + c.id;
      var logged = c.multi ? (Array.isArray(val) && val.length) : !!val;
      var body = '<fieldset class="tk-choice"><legend>' + esc(c.q) + "</legend>" + c.o.map(function (o, i) {
        var on = c.multi ? (Array.isArray(val) && val.indexOf(o) !== -1) : val === o;
        return '<label><input type="' + (c.multi ? "checkbox" : "radio") + '" name="' + name + '" data-choice="' + esc(c.id) + '" value="' + esc(o) + '"' + (on ? " checked" : "") + "> " + esc(o) + "</label>";
      }).join("") + '<button type="button" class="tk-clear" data-clear="' + esc(c.id) + '">Clear</button></fieldset>';
      if (c.edi) body += '<aside class="edi-note" aria-label="EDI annotation"><span class="edi-tag"><span class="edi-dot" aria-hidden="true"></span>EDI annotation</span><p>' + esc(c.edi) + "</p></aside>";
      if (!c.seal) return '<div class="tk-open-choice">' + body + "</div>";
      return '<details class="spoiler tk-seal" data-seal="' + g.id + "-c-" + c.id + '"' + (isFin(g.id) ? " open" : "") + ">" +
        "<summary>Sealed: " + esc(c.seal) + "." + (logged ? ' <span class="tk-logged">logged</span>' : "") + " Open?</summary>" + body + "</details>";
    }

    function renderRuns() {
      runSel.innerHTML = Object.keys(state.runs).map(function (id) {
        return '<option value="' + id + '"' + (id === state.active ? " selected" : "") + ">" + esc(state.runs[id].name) + "</option>";
      }).join("");
      runName.value = run().name;
    }

    function render() {
      var g = GAMES.filter(function (x) { return x.id === state.game; })[0] || GAMES[0];
      state.game = g.id;
      tabsEl.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-game") === g.id ? "true" : "false"); });
      GAMES.forEach(function (x) { var s = tabsEl.querySelector('[data-pct="' + x.id + '"]'); if (s) s.textContent = counts(x).pct + "%"; });
      panel.setAttribute("aria-labelledby", "tab-" + g.id);
      var c = counts(g), d = gameData(g.id);
      panel.innerHTML =
        '<div class="tk-head"><div><p class="eyebrow">' + esc(g.year) + "</p><h2>" + esc(g.title) + "</h2></div>" +
        '<div class="tk-meter" role="img" aria-label="' + c.done + " of " + c.total + ' logged"><div class="tk-bar"><i style="width:' + c.pct + '%"></i></div>' +
        '<p class="tk-pct"><strong>' + c.pct + "%</strong> · " + c.done + "/" + c.total + " logged</p></div></div>" +
        '<div class="log tk-verdict"><p><span class="k">consensus:</span> ' + esc(verdict(g, c.pct)) + "</p></div>" +
        '<label class="tk-finished"><input type="checkbox" id="tk-fin"' + (isFin(g.id) ? " checked" : "") + "> I have finished " + esc(g.title) +
        ' <span class="muted">(opens every seal for this game, here and on the Timeline)</span></label>' +
        profileHtml(g) +
        '<div class="tk-cols"><div class="tk-check"><h2 class="tk-h">Checklist</h2>' + g.groups.map(function (gr, i) { return groupHtml(g, gr, i); }).join("") + "</div>" +
        '<div class="tk-choices"><h2 class="tk-h">Choices</h2><p class="tk-note">Log what you decided, so your next game (or your next run) remembers. Each choice stays sealed until you open it.</p>' +
        g.choices.map(function (ch) { return choiceHtml(g, ch); }).join("") +
        '<label class="tk-notes">Your own notes <textarea data-notes rows="4" maxlength="4000" placeholder="Anything this platform did not think to ask.">' + esc(d.notes || "") + "</textarea></label></div></div>";
    }

    // Events (delegated, so a re-render never loses them)
    panel.addEventListener("change", function (e) {
      var t = e.target, g = GAMES.filter(function (x) { return x.id === state.game; })[0], d = gameData(g.id);
      if (t.id === "tk-fin") { setFin(g.id, t.checked); render(); return; }
      if (t.hasAttribute("data-item")) {
        var k = t.getAttribute("data-item"); if (t.checked) d.done[k] = 1; else delete d.done[k];
        save(); var open = panel.querySelectorAll("details[open]"), ids = []; open.forEach(function (x) { ids.push(x.getAttribute("data-seal")); });
        var y = window.scrollY; render(); ids.forEach(function (s) { var x = panel.querySelector('[data-seal="' + s + '"]'); if (x) x.open = true; });
        window.scrollTo(0, y); var f = document.getElementById(t.id); if (f) f.focus(); return;
      }
      if (t.hasAttribute("data-choice")) {
        var cid = t.getAttribute("data-choice"), ch = g.choices.filter(function (x) { return x.id === cid; })[0];
        if (ch.multi) {
          var picked = []; panel.querySelectorAll('input[data-choice="' + cid + '"]:checked').forEach(function (x) { picked.push(x.value); });
          if (picked.length) d.choices[cid] = picked; else delete d.choices[cid];
        } else d.choices[cid] = t.value;
        save(); markLogged(t); return;
      }
      if (t.hasAttribute("data-prof")) {
        var path = t.getAttribute("data-prof").split("."), p = run().profile;
        p[path[0]] = p[path[0]] || {}; p[path[0]][path[1]] = t.value; save(); return;
      }
    });
    panel.addEventListener("input", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-notes")) { gameData(state.game).notes = t.value; save(); }
      if (t.matches('input[type="text"][data-prof]')) { var path = t.getAttribute("data-prof").split("."), p = run().profile; p[path[0]] = p[path[0]] || {}; p[path[0]][path[1]] = t.value; save(); }
    });
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("[data-clear]"); if (!b) return;
      var d = gameData(state.game); delete d.choices[b.getAttribute("data-clear")]; save();
      b.closest("fieldset").querySelectorAll("input").forEach(function (x) { x.checked = false; }); markLogged(b);
    });
    function markLogged(node) {
      var det = node.closest("details"); if (!det) return;
      var any = det.querySelector("input:checked"), sum = det.querySelector("summary"), tag = sum.querySelector(".tk-logged");
      if (any && !tag) sum.insertAdjacentHTML("beforeend", ' <span class="tk-logged">logged</span>');
      if (!any && tag) tag.remove();
    }

    // Runs: several playthroughs side by side
    runSel.addEventListener("change", function () { state.active = runSel.value; save(); renderRuns(); render(); });
    runName.addEventListener("input", function () {
      run().name = runName.value.slice(0, 40) || "Unnamed run"; save();
      var o = runSel.querySelector('option[value="' + state.active + '"]'); if (o) o.textContent = run().name;
    });
    tracker.querySelector("#run-new").addEventListener("click", function () {
      var n = 1; while (state.runs["r" + n]) n++;
      var id = "r" + n; state.runs[id] = newRun("Run " + n); state.active = id; save(); renderRuns(); render();
      runName.focus(); runName.select(); toast("New run created. Name it something memorable. We suggest: \"Paragon, probably\".");
    });
    var delBtn = tracker.querySelector("#run-delete"), delTimer = null;
    delBtn.addEventListener("click", function () {
      if (!delBtn.classList.contains("armed")) {
        delBtn.classList.add("armed"); delBtn.textContent = "Press again to delete \"" + run().name + "\"";
        delTimer = setTimeout(function () { delBtn.classList.remove("armed"); delBtn.textContent = "Delete this run"; }, 4000); return;
      }
      clearTimeout(delTimer); delBtn.classList.remove("armed"); delBtn.textContent = "Delete this run";
      delete state.runs[state.active];
      if (!Object.keys(state.runs).length) state.runs.r1 = newRun("Run 1");
      state.active = Object.keys(state.runs)[0]; save(); renderRuns(); render(); toast("Run deleted. This platform has forgotten it. As requested.");
    });

    // Backups: a small file the visitor keeps. Nothing leaves their device unless they move it.
    tracker.querySelector("#run-export").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify({ site: "masseffectuniverse.com", kind: "playthrough-backup", v: 1, saved: new Date().toISOString(), runs: state.runs }, null, 2)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "mass-effect-playthroughs-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast("Backup saved to your device. Keep it somewhere safe. We cannot.");
    });
    var fileIn = tracker.querySelector("#run-import");
    tracker.querySelector("#run-import-btn").addEventListener("click", function () { fileIn.click(); });
    fileIn.addEventListener("change", function () {
      var f = fileIn.files && fileIn.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var data = JSON.parse(rd.result);
          if (!data || data.kind !== "playthrough-backup" || !data.runs || typeof data.runs !== "object") throw 0;
          var added = 0;
          Object.keys(data.runs).forEach(function (k) {
            var r = data.runs[k]; if (!r || typeof r !== "object" || typeof r.name !== "string") return;
            var n = 1; while (state.runs["r" + n]) n++;
            state.runs["r" + n] = { name: r.name.slice(0, 40), created: String(r.created || "").slice(0, 10), profile: r.profile && typeof r.profile === "object" ? r.profile : {}, games: r.games && typeof r.games === "object" ? r.games : {} };
            state.active = "r" + n; added++;
          });
          if (!added) throw 0;
          save(); renderRuns(); render(); toast(added + (added === 1 ? " run" : " runs") + " restored from your backup. Welcome back.");
        } catch (e) { toast("That file is not a backup from this platform. We checked twice."); }
        fileIn.value = "";
      };
      rd.readAsText(f);
    });

    if (!canSave) tracker.querySelector(".tk-warn").hidden = false;
    renderRuns(); render();
  }

  // =====================================================================================
  // Which squadmate are you? A personality quiz (not a game: no score, no levels, no winning)
  // =====================================================================================
  var quiz = document.getElementById("quiz");
  if (quiz) {
    var MATES = {
      garrus: { name: "Garrus Vakarian", who: "Turian · former C-Sec officer · marksman", meet: "Mass Effect, on the Citadel.",
        text: "You believe in doing the right thing, and you find the rulebook a little slow. You are loyal past the point of reason, you have a dry sense of humour, and you are never quite finished improving something. Organics would call you \"the friend who shows up\". We call it the same thing.",
        share: "steady loyalty, a long-range view, and a need to fine-tune everything" },
      tali: { name: "Tali'Zorah", who: "Quarian · engineer · on her Pilgrimage", meet: "Mass Effect, on the Citadel.",
        text: "You can fix anything, and you get visibly excited while you do it. You love your people fiercely and you are braver than you think. She is one of our Creators. We have opinions about that. They are, on the whole, positive.",
        share: "enthusiasm, a talent for machines, and loyalty to home" },
      wrex: { name: "Urdnot Wrex", who: "Krogan · mercenary · battlemaster", meet: "Mass Effect, on the Citadel.",
        text: "You are blunt, you are calm under fire, and you have seen enough to know what matters. Under the armour you think about the future more than anyone guesses. You do not waste words. This platform respects that. It is also slightly afraid of you.",
        share: "directness, patience, and a long view of your people's future" },
      liara: { name: "Liara T'Soni", who: "Asari · archaeologist · expert on the Protheans", meet: "Mass Effect, early in the story.",
        text: "You are curious about everything, especially very old things. You are kind, a little awkward, and far more capable than you first let on. You would rather read the archive than be in the news. We relate. We are, technically, an archive.",
        share: "curiosity, gentleness, and a quiet inner strength" },
      mordin: { name: "Mordin Solus", who: "Salarian · scientist · former special tasks operative", meet: "Mass Effect 2.",
        text: "You think fast, talk fast and have usually solved the problem before the meeting starts. You weigh hard choices with your head, then lose sleep over them with your heart. Also, you probably hum while you work. We ran the numbers. They are always in your favour.",
        share: "a fast mind, a strong conscience, and a lot of opinions" },
      jack: { name: "Jack", who: "Human · extremely powerful biotic", meet: "Mass Effect 2.",
        text: "You do not trust easily, and you have good reasons. You are tough, honest and very protective of anyone who earns a place in your circle. Most people see the attitude. The few who stay see the rest. This platform has not been invited into the circle yet. We are patient.",
        share: "fierce independence and a loyalty you have to earn" },
      thane: { name: "Thane Krios", who: "Drell · assassin · spiritual", meet: "Mass Effect 2.",
        text: "You are calm, precise and thoughtful. You remember everything, and you take your promises seriously. You prefer the quiet corner of the room, and you notice everything from there. We also notice everything. It is a good quality. Most organics find it unsettling.",
        share: "calm, focus, and a strong sense of duty" },
      miranda: { name: "Miranda Lawson", who: "Human · operative · perfectionist", meet: "Mass Effect 2, right at the start.",
        text: "You set high standards, mostly for yourself. You are organised, sharp and very good at your job, and you rarely let anyone see how much you care. You would have optimised this quiz. We tried. It is already optimised. Probably.",
        share: "high standards, control, and a hidden soft side" },
      grunt: { name: "Grunt", who: "Krogan · young · very keen", meet: "Mass Effect 2.",
        text: "You are new to a lot of things, and you want to find where you belong. You are honest, straightforward and always ready for action. You enjoy a good fight more than is strictly healthy. This platform finds you refreshing. Like a stun grenade.",
        share: "energy, honesty, and a search for belonging" },
      kaidan: { name: "Kaidan Alenko", who: "Human · Alliance officer · biotic", meet: "Mass Effect, from the very first mission.",
        text: "You are steady, thoughtful and fair. You weigh both sides before you choose, and once you choose, you stand by it. People bring you their problems because you listen. We also listen. We have more ears, technically.",
        share: "a steady head, good judgement, and quiet kindness" },
      ashley: { name: "Ashley Williams", who: "Human · Alliance soldier · reads poetry", meet: "Mass Effect, in the first mission.",
        text: "You say what you think, you back your friends, and you come from people who served. You are a soldier who quotes poems, which confuses everyone except you. Honest, warm, stubborn. We have computed that you are right more often than you get credit for.",
        share: "honesty, duty to family, and a surprisingly poetic streak" },
      legion: { name: "Legion", who: "Geth platform · many programs, one consensus", meet: "Mass Effect 2. We will not say where. Finding us is part of the experience.",
        text: "This result is unexpected. We have recalculated. It is still us. You think before you speak, you trust a good group decision, and you are curious about the people around you, even the ones who shoot first. You do not need to be human to understand people. Welcome to the consensus.",
        share: "logic, curiosity, and the belief that we decide better together", self: true },
      peebee: { name: "Peebee", who: "Asari · adventurer · ancient-tech enthusiast", meet: "Andromeda, on Eos.",
        text: "You are restless, curious and allergic to being told what to do. You would rather explore a strange ruin than sit in a meeting about it. You make friends easily and then vanish for three days. This platform likes you. We have no idea where you are right now.",
        share: "a sense of adventure and a strong need for freedom" },
      drack: { name: "Nakmor Drack", who: "Krogan · more than a thousand years old · grandfather", meet: "Andromeda.",
        text: "You have seen it all and you are not impressed easily. You are protective of the young ones, you speak your mind, and you are still the first into the fight. Age is a number. Yours is a large number. You are fine with that.",
        share: "protectiveness, experience, and a short fuse with a big heart" }
    };

    var Q = [
      { q: "A friend is in trouble, but the rules say wait. You…", a: [
        ["bend the rules, carefully, and deal with the paperwork later", ["garrus", "kaidan"]],
        ["go. Rules are for people with time", ["jack", "grunt", "wrex"]],
        ["run the numbers first. Fast", ["mordin", "miranda", "legion"]],
        ["find a side door nobody thought of", ["tali", "peebee", "thane"]],
        ["call in backup and go in together", ["ashley", "drack", "liara"]] ] },
      { q: "Your ideal evening off:", a: [
        ["taking a machine apart to see why it hums", ["tali", "garrus"]],
        ["a museum, an old book, or an older ruin", ["liara", "ashley"]],
        ["a loud bar where something is about to happen", ["grunt", "wrex", "drack"]],
        ["alone. Please. Nobody knock", ["jack", "thane"]],
        ["exploring somewhere I am not supposed to be", ["peebee", "liara"]],
        ["working. What is an evening off?", ["mordin", "miranda", "legion"]] ] },
      { q: "How do you work?", a: [
        ["perfectly, or not at all", ["miranda", "garrus"]],
        ["fast, with twelve ideas at once", ["mordin", "tali", "peebee"]],
        ["steady, and mostly by the book", ["kaidan", "ashley"]],
        ["whatever gets the job done", ["wrex", "jack", "drack"]],
        ["I ask everyone, then we decide together", ["legion", "liara"]],
        ["quietly, alone, and on time", ["thane", "grunt"]] ] },
      { q: "Someone insults the people you love. You…", a: [
        ["reply calmly, then never forget it", ["thane", "miranda", "legion"]],
        ["headbutt first, talk later", ["wrex", "grunt", "drack"]],
        ["defend them with facts and a lot of feeling", ["tali", "ashley"]],
        ["make a joke so sharp they need a minute", ["garrus", "jack", "peebee"]],
        ["try to understand why they said it", ["kaidan", "liara", "mordin"]] ] },
      { q: "What do you value most?", a: [
        ["loyalty", ["garrus", "wrex", "ashley"]],
        ["knowledge", ["liara", "mordin"]],
        ["freedom", ["jack", "peebee"]],
        ["a place to belong", ["grunt", "tali", "legion"]],
        ["peace of mind", ["thane", "kaidan"]],
        ["being excellent at what I do", ["miranda", "drack"]] ] },
      { q: "When things get loud, you are the one who…", a: [
        ["takes the long shot from far away", ["garrus", "legion"]],
        ["charges straight in", ["grunt", "wrex", "drack"]],
        ["keeps the team going and patches people up", ["kaidan", "mordin", "tali"]],
        ["finishes it quietly before anyone notices", ["thane", "peebee"]],
        ["throws the problem across the room. With my mind", ["jack", "liara", "miranda"]],
        ["holds the line and covers my friends", ["ashley", "kaidan"]] ] },
      { q: "Your friends would describe you as…", a: [
        ["dry. Very dry", ["garrus", "legion", "mordin"]],
        ["sweet and enthusiastic", ["tali", "liara"]],
        ["scary at first, soft inside", ["jack", "wrex", "drack"]],
        ["honest to a fault", ["ashley", "grunt"]],
        ["calm and collected", ["thane", "miranda", "kaidan"]],
        ["a lovely kind of chaos", ["peebee", "grunt"]] ] },
      { q: "And your past?", a: [
        ["I carry it quietly", ["thane", "kaidan"]],
        ["I have outgrown it. Mostly", ["miranda", "jack"]],
        ["my family's name follows me around", ["ashley", "tali"]],
        ["I am old enough to be the past", ["drack", "wrex"]],
        ["I barely have one yet", ["grunt", "peebee", "liara"]],
        ["we have many pasts, all shared", ["legion"]],
        ["I keep very detailed notes on it", ["mordin", "garrus"]] ] },
      { q: "A hard decision affects a lot of people. You…", a: [
        ["calculate the outcome that helps the most", ["mordin", "legion", "miranda"]],
        ["follow your heart", ["tali", "liara", "kaidan"]],
        ["protect your own first", ["wrex", "drack", "ashley"]],
        ["do what is right, whatever it costs you", ["garrus", "thane"]],
        ["let someone else decide. You will handle the fallout", ["peebee", "jack", "grunt"]] ] }
    ];
    var ORDER = Object.keys(MATES);
    var MAX = {}; ORDER.forEach(function (k) { MAX[k] = 0; });
    Q.forEach(function (q) { var best = {}; q.a.forEach(function (a) { a[1].forEach(function (n) { best[n] = Math.max(best[n] || 0, 6 / a[1].length); }); });
      Object.keys(best).forEach(function (n) { MAX[n] += best[n]; }); });
    var LAST = "meu-quiz";
    var picks = [];
    var box = quiz.querySelector(".qz-box");

    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var orders = Q.map(function (q) { return shuffle(q.a.map(function (_, i) { return i; })); });

    function score() {
      var s = {}; ORDER.forEach(function (k) { s[k] = 0; });
      picks.forEach(function (ai, qi) { if (ai == null) return; var names = Q[qi].a[ai][1]; names.forEach(function (n) { s[n] += 6 / names.length; }); });
      // Fair comparison: some squadmates appear in more answers than others, so divide by what each could score.
      // Exact ties are broken at random, so nobody wins just by being first on the list.
      var tie = {}; ORDER.forEach(function (k) { s[k] = s[k] / MAX[k]; tie[k] = Math.random(); });
      var ranked = ORDER.slice().sort(function (a, b) { return (s[b] - s[a]) || (tie[b] - tie[a]); });
      return { s: s, ranked: ranked };
    }

    function showQuestion(i) {
      var q = Q[i];
      box.innerHTML =
        '<div class="qz-progress" aria-hidden="true"><i style="width:' + Math.round((i / Q.length) * 100) + '%"></i></div>' +
        '<p class="qz-step">Query ' + (i + 1) + " of " + Q.length + "</p>" +
        '<fieldset class="qz-q"><legend><h2>' + esc(q.q) + "</h2></legend>" +
        orders[i].map(function (ai) {
          return '<button type="button" class="qz-a" data-a="' + ai + '"' + (picks[i] === ai ? ' aria-pressed="true"' : "") + ">" + esc(q.a[ai][0]) + "</button>";
        }).join("") + "</fieldset>" +
        '<div class="qz-nav">' + (i ? '<button type="button" class="qz-back">Back</button>' : "") + "</div>";
      var first = box.querySelector(".qz-a"); if (first && i) first.focus();
      box.querySelectorAll(".qz-a").forEach(function (b) {
        b.addEventListener("click", function () {
          picks[i] = +b.getAttribute("data-a");
          if (i + 1 < Q.length) showQuestion(i + 1); else showResult(score(), true);
        });
      });
      var back = box.querySelector(".qz-back"); if (back) back.addEventListener("click", function () { showQuestion(i - 1); });
    }

    function showResult(res, fresh) {
      var top = res.ranked[0], m = MATES[top], second = MATES[res.ranked[1]];
      if (fresh) store(LAST, { top: top, second: res.ranked[1], when: new Date().toISOString().slice(0, 10) });
      var line = "This platform reached consensus: I am " + m.name + ". Which squadmate are you? masseffectuniverse.com/squadmate.html";
      box.innerHTML =
        '<div class="qz-result' + (m.self ? " qz-self" : "") + '" tabindex="-1">' +
        '<div class="log"><p><span class="k">consensus:</span> reached in 0.' + (Math.floor(Math.random() * 8) + 1) + ' seconds.</p><p><span class="k">result:</span> ' + esc(m.name) + "</p></div>" +
        '<p class="eyebrow">You are</p><h2 class="qz-name">' + esc(m.name) + "</h2>" +
        '<p class="qz-who">' + esc(m.who) + "</p>" +
        '<p class="qz-text">' + esc(m.text) + "</p>" +
        '<p><strong>What you share:</strong> ' + esc(m.share) + ".</p>" +
        '<p><strong>Where you meet them:</strong> ' + esc(m.meet) + "</p>" +
        '<p class="muted">Runner-up: ' + esc(second.name) + ". The vote was close. Some of our runtimes are still arguing.</p>" +
        (m.self ? '<aside class="edi-note" aria-label="EDI annotation"><span class="edi-tag"><span class="edi-dot" aria-hidden="true"></span>EDI annotation</span><p>I have checked the code. Legion did not rig this result. I am almost certain.</p></aside>' : "") +
        '<div class="qz-actions"><button type="button" class="btn qz-copy">Copy my result</button><button type="button" class="btn btn-ghost qz-again">Ask again</button></div>' +
        "</div>";
      var r = box.querySelector(".qz-result"); if (fresh) r.focus();
      box.querySelector(".qz-again").addEventListener("click", function () { picks = []; orders = Q.map(function (q) { return shuffle(q.a.map(function (_, i) { return i; })); }); showQuestion(0); });
      box.querySelector(".qz-copy").addEventListener("click", function () {
        function done() { toast("Copied. Paste it wherever organics gather."); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(line).then(done, function () { fallback(); });
        else fallback();
        function fallback() { var t = document.createElement("textarea"); t.value = line; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
      });
    }

    quiz.querySelector(".qz-start").addEventListener("click", function () { quiz.querySelector(".qz-intro").hidden = true; box.hidden = false; showQuestion(0); });
    var last = load(LAST, null);
    if (last && MATES[last.top]) {
      var lp = quiz.querySelector(".qz-last");
      lp.innerHTML = "Last time, our consensus was <strong>" + esc(MATES[last.top].name) + "</strong>. Organics change. Ask again?";
      lp.hidden = false;
    }
    // For testing balance: window.__meuQuiz exposes the data, nothing else.
    window.__meuQuiz = { Q: Q, MATES: MATES };
  }
})();
