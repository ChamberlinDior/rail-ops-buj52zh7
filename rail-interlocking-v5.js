(function () {
  "use strict";
  const railNodes = [
    { id: "OWE-IN", type: "junction", x: 20, y: 88 },
    { id: "OWE-A", type: "platform", x: 235, y: 62 },
    { id: "OWE-B", type: "platform", x: 235, y: 92 },
    { id: "OWE-F", type: "terminal", x: 235, y: 122 },
    { id: "NDJ-IN", type: "junction", x: 310, y: 194 },
    { id: "NDJ-1", type: "platform", x: 480, y: 174 },
    { id: "NDJ-2", type: "platform", x: 480, y: 204 },
    { id: "NDJ-W", type: "terminal", x: 480, y: 234 },
    { id: "LOP-IN", type: "junction", x: 545, y: 174 },
    { id: "LOP-1", type: "platform", x: 685, y: 154 },
    { id: "LOP-2", type: "platform", x: 685, y: 184 },
    { id: "LOP-F", type: "siding", x: 685, y: 214 },
    { id: "MDA-IN", type: "junction", x: 735, y: 75 },
    { id: "MDA-1", type: "platform", x: 925, y: 55 },
    { id: "MDA-M1", type: "terminal", x: 925, y: 85 },
    { id: "MDA-M2", type: "terminal", x: 925, y: 115 },
    { id: "MDA-D", type: "depot", x: 925, y: 145 },
  ];
  const railSegments = [
    {
      id: "RT-OWE-01",
      from: "OWE-IN",
      to: "OWE-A",
      path: "M20 88 L68 88 L92 62 L235 62",
      state: "reserved",
      maxSpeed: 40,
    },
    {
      id: "RT-OWE-02",
      from: "OWE-IN",
      to: "OWE-B",
      path: "M20 88 L235 92",
      state: "free",
      maxSpeed: 30,
    },
    {
      id: "RT-OWE-03",
      from: "OWE-IN",
      to: "OWE-F",
      path: "M68 88 L95 122 L235 122",
      state: "occupied",
      maxSpeed: 20,
    },
    {
      id: "RT-COR-01",
      from: "OWE-A",
      to: "NDJ-IN",
      path: "M235 62 L270 62 L300 118 L300 194 L310 194",
      state: "free",
      maxSpeed: 80,
    },
    {
      id: "RT-NDJ-01",
      from: "NDJ-IN",
      to: "NDJ-1",
      path: "M310 194 L350 194 L372 174 L480 174",
      state: "occupied",
      maxSpeed: 40,
    },
    {
      id: "RT-NDJ-02",
      from: "NDJ-IN",
      to: "NDJ-2",
      path: "M310 194 L480 204",
      state: "reserved",
      maxSpeed: 30,
    },
    {
      id: "RT-NDJ-W",
      from: "NDJ-IN",
      to: "NDJ-W",
      path: "M350 194 L375 234 L480 234",
      state: "free",
      maxSpeed: 15,
    },
    {
      id: "RT-LOP-01",
      from: "LOP-IN",
      to: "LOP-1",
      path: "M480 174 L545 174 L570 154 L685 154",
      state: "reserved",
      maxSpeed: 50,
    },
    {
      id: "RT-LOP-02",
      from: "LOP-IN",
      to: "LOP-2",
      path: "M480 204 L545 204 L570 184 L685 184",
      state: "free",
      maxSpeed: 40,
    },
    {
      id: "RT-LOP-F",
      from: "LOP-IN",
      to: "LOP-F",
      path: "M545 204 L575 214 L685 214",
      state: "occupied",
      maxSpeed: 20,
    },
    {
      id: "RT-COR-02",
      from: "LOP-1",
      to: "MDA-IN",
      path: "M685 154 L715 154 L735 125 L735 75",
      state: "free",
      maxSpeed: 80,
    },
    {
      id: "RT-MDA-01",
      from: "MDA-IN",
      to: "MDA-1",
      path: "M735 75 L770 75 L790 55 L925 55",
      state: "free",
      maxSpeed: 40,
    },
    {
      id: "RT-MDA-M1",
      from: "MDA-IN",
      to: "MDA-M1",
      path: "M735 75 L925 85",
      state: "reserved",
      maxSpeed: 20,
    },
    {
      id: "RT-MDA-M2",
      from: "MDA-IN",
      to: "MDA-M2",
      path: "M770 75 L795 115 L925 115",
      state: "occupied",
      maxSpeed: 15,
    },
    {
      id: "RT-MDA-D",
      from: "MDA-IN",
      to: "MDA-D",
      path: "M790 115 L810 145 L925 145",
      state: "maintenance",
      maxSpeed: 10,
    },
  ];
  const complexes = [
    {
      id: "OWENDO",
      name: "OWENDO · TERMINAL",
      x: 18,
      y: 28,
      w: 225,
      platforms: [
        ["QUAI 1", 62, "EXP-620 · 18:42"],
        ["QUAI 2", 92, "Libre"],
        ["FRET / PORT", 122, "HC-118"],
      ],
    },
    {
      id: "NDJOLE",
      name: "NDJOLÉ",
      x: 308,
      y: 142,
      w: 180,
      platforms: [
        ["QUAI 1", 174, "EXP-620"],
        ["QUAI 2", 204, "Réservé"],
        ["TERMINAL BOIS", 234, "Chargement"],
      ],
    },
    {
      id: "LOPE",
      name: "LOPÉ · CROISEMENT",
      x: 543,
      y: 122,
      w: 150,
      platforms: [
        ["VOIE 1", 154, "Priorité 1"],
        ["VOIE 2", 184, "Libre"],
        ["ÉVITEMENT", 214, "MIN-641"],
      ],
    },
    {
      id: "MOANDA",
      name: "MOANDA · MINIER",
      x: 733,
      y: 22,
      w: 200,
      platforms: [
        ["QUAI VOY.", 55, "Libre"],
        ["MINIÈRE 1", 85, "Réservée"],
        ["MINIÈRE 2", 115, "MIN-642"],
        ["DÉPÔT", 145, "Maintenance"],
      ],
    },
  ];
  function segment(s) {
    return `<path class="inter-segment ${s.state}" data-inter-segment="${s.id}" d="${s.path}" data-speed="${s.maxSpeed}"/>`;
  }
  function signal(x, y, id, state = "green") {
    return `<g class="inter-signal ${state}" data-inter-signal="${id}" transform="translate(${x} ${y})"><path d="M0 0 l8 -5 v10z"/><circle cx="13" cy="0" r="4"/></g>`;
  }
  function switcher(x, y, id, position = "direct") {
    return `<g class="inter-switch ${position}" data-inter-switch="${id}" transform="translate(${x} ${y})"><circle r="5"/><path d="M-12 0 L12 0 M0 0 L11 -10"/></g>`;
  }
  function buffer(x, y) {
    return `<g class="buffer" transform="translate(${x} ${y})"><path d="M0 -8 V8 M5 -6 V6"/></g>`;
  }
  function consist(id, x, y, type, state, label) {
    let units =
        type === "passenger" ? ["V1", "V2", "V3", "V4"] : type === "mineral" ? ["M", "M", "M", "M", "M"] : ["W", "W", "W", "W"],
      labelWidth = type === "cargo" ? 155 : 135;
    return `<g class="inter-train ${type}" data-inter-train="${id}" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="Train ${id}, ${label}, ${state}"><g class="train-label-box"><rect x="-7" y="-37" width="${labelWidth}" height="24" rx="6"/><circle cx="5" cy="-25" r="4"/><text class="train-name" x="14" y="-27">${id}</text><text class="train-state" x="14" y="-18">${label} · ${state}</text></g><g class="vehicle-row"><g class="locomotive"><path d="M0 -9 H18 L24 -3 V8 H0 Z"/><rect class="cab-window" x="13" y="-6" width="6" height="5" rx="1"/><path class="train-nose" d="M24 -3 L28 1 L24 5 Z"/><circle cx="6" cy="9" r="3"/><circle cx="19" cy="9" r="3"/></g>${units.map((u, i) => `<g class="rail-vehicle" transform="translate(${31 + i * 20} 0)"><rect x="0" y="-7" width="17" height="14" rx="2"/><text x="8.5" y="2">${u}</text><circle cx="4" cy="8" r="2"/><circle cx="13" cy="8" r="2"/></g>`).join("")}</g><path class="direction-tip" d="M-8 0 l6 -5 v10z"/></g>`;
  }
  function svg() {
    return `<svg class="rail-network-v3 interlocking-svg" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-label="Plan opérationnel des voies SETRAG"><g class="complex-backs">${complexes.map((c) => `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.platforms.length * 30 + 22}" rx="8"/><text x="${c.x + 8}" y="${c.y + 15}">${c.name}</text>`).join("")}</g><g class="inter-routes">${railSegments.map(segment).join("")}</g><g class="platform-bars">${complexes.flatMap((c) => c.platforms.map((p) => `<g data-inter-platform="${c.id}-${p[0]}"><rect x="${c.x + 45}" y="${p[1] - 10}" width="${c.w - 55}" height="5" rx="2"/><text x="${c.x + 7}" y="${p[1] - 5}">${p[0]}</text><text class="platform-state" x="${c.x + c.w - 8}" y="${p[1] - 5}">${p[2]}</text></g>`)).join("")}</g><g class="inter-switches">${switcher(68, 88, "AIG-OWE-01")}${switcher(350, 194, "AIG-NDJ-02", "diverted")}${switcher(545, 184, "AIG-LOP-03", "locked")}${switcher(770, 75, "AIG-MDA-04")}</g><g class="inter-signals">${signal(245, 62, "S-OWE-01")}${signal(290, 194, "S-NDJ-E", "yellow")}${signal(495, 174, "S-NDJ-S")}${signal(530, 204, "S-LOP-E", "red")}${signal(700, 154, "S-LOP-S")}${signal(720, 75, "S-MDA-E", "yellow")}${signal(935, 85, "S-MDA-M1", "red")}</g><g class="buffers">${buffer(238, 122)}${buffer(484, 234)}${buffer(690, 214)}${buffer(932, 85)}${buffer(932, 115)}${buffer(932, 145)}</g><g class="direction-arrows"><text x="268" y="56">▶</text><text x="500" y="168">▶</text><text x="702" y="148">▶</text><text x="748" y="69">▶</text></g><g class="industrial-labels"><text x="88" y="145">↳ Port · Hydrocarbures</text><text x="374" y="257">↳ Parc à grumes</text><text x="805" y="170">↳ Chargement manganèse</text></g>${consist("EXP-620", 390, 174, "passenger", "À l’heure", "72 km/h")}${consist("MIN-641", 585, 214, "mineral", "+12 min", "3 150 t")}${consist("MIN-642", 830, 115, "mineral", "Chargement", "2 980 t")}${consist("HC-118", 125, 122, "cargo", "Position estimée", "920 000 L")}<g class="inter-alert"><path d="M520 244 l8 14 h-16z"/><text x="535" y="255">LTV 40 · PK 316–321</text></g></svg>`;
  }
  function info(rows) {
    return `<div class="train-info-list">${rows.map((x) => `<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div>`;
  }
  function panel(title, rows) {
    let root = document.querySelector("#trainOverlay");
    if (!root) return;
    root.innerHTML = `<div class="train-overlay-back"><aside class="train-side-drawer"><button class="drawer-x" data-inter-close>×</button><span class="train-eyebrow">PLAN DE VOIES · SIMULATION</span><h2>${title}</h2>${info(rows)}</aside></div>`;
    root.querySelector("[data-inter-close]").onclick = () =>
      (root.innerHTML = "");
  }
  function bind(stage) {
    stage.querySelectorAll("[data-inter-segment]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(`Segment ${x.dataset.interSegment}`, [
            [
              "État",
              x.classList.contains("occupied")
                ? "Occupé"
                : x.classList.contains("reserved")
                  ? "Réservé"
                  : x.classList.contains("maintenance")
                    ? "Maintenance"
                    : "Libre",
            ],
            ["Vitesse maximale", x.dataset.speed + " km/h"],
            ["Dernier passage", "EXP-620 · 18:41"],
            ["Protection", "Signaux encadrants actifs"],
          ])),
    );
    stage.querySelectorAll("[data-inter-switch]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(`Aiguillage ${x.dataset.interSwitch}`, [
            [
              "Position",
              x.classList.contains("diverted") ? "Déviée" : "Directe",
            ],
            ["État", "Verrouillé"],
            ["Itinéraire", "EXP-620 vers voie principale"],
            ["Dernière commande", "18:41:12"],
          ])),
    );
    stage.querySelectorAll("[data-inter-signal]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(`Signal ${x.dataset.interSignal}`, [
            [
              "État",
              x.classList.contains("red")
                ? "Rouge"
                : x.classList.contains("yellow")
                  ? "Jaune"
                  : "Vert",
            ],
            ["Train concerné", "EXP-620"],
            ["Cause", "Itinéraire et canton contrôlés"],
            ["Dernier changement", "18:41:22"],
          ])),
    );
    stage.querySelectorAll("[data-inter-platform]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(`Voie à quai`, [
            ["Identifiant", x.dataset.interPlatform],
            ["Longueur utile", "420 m"],
            ["État", "Réservée"],
            ["Prochain mouvement", "Entrée EXP-620 · 18:42"],
          ])),
    );
    stage.querySelectorAll("[data-inter-train]").forEach(
      (x) =>
        (x.onclick = () => {
          let original = document.querySelector(
            `[data-train="${x.dataset.interTrain}"]`,
          );
          original?.click();
        }),
    );
  }
  function install() {
    let stage = document.querySelector(".rail-stage[data-network-v3]");
    if (!stage || stage.dataset.interlockingV5) return;
    stage.dataset.interlockingV5 = "true";
    stage
      .querySelector(".rail-network-v3")
      ?.replaceWith(document.createRange().createContextualFragment(svg()));
    stage.querySelectorAll(".net-ltv,.net-crossing").forEach((x) => x.remove());
    let signalLayer = stage.querySelector(".inter-signals");
    signalLayer?.insertAdjacentHTML(
      "beforeend",
      `${signal(28, 88, "S-OWE-E")}${signal(245, 92, "S-OWE-V2", "yellow")}${signal(245, 122, "S-OWE-F", "red")}${signal(495, 204, "S-NDJ-V2", "red")}${signal(495, 234, "S-NDJ-BOIS", "yellow")}${signal(530, 174, "S-LOP-E1")}${signal(700, 184, "S-LOP-V2", "yellow")}${signal(700, 214, "S-LOP-F", "red")}${signal(940, 55, "S-MDA-V")}${signal(940, 115, "S-MDA-M2", "yellow")}${signal(940, 145, "S-MDA-D", "red")}`,
    );
    stage.insertAdjacentHTML(
      "beforeend",
      '<div class="rail-live-summary"><span><i class="green"></i><b>4 trains visibles</b></span><span><i class="blue"></i>3 itinéraires réservés</span><span><i class="red"></i>4 voies occupées</span><span><i class="yellow"></i>18 signaux actifs</span></div>',
    );
    bind(stage);
  }
  let phase = 0;
  function animate() {
    let stage = document.querySelector(".rail-stage[data-interlocking-v5]");
    if (!stage) return;
    phase = (phase + 1) % 6;
    let exp = stage.querySelector('[data-inter-train="EXP-620"]'),
      min = stage.querySelector('[data-inter-train="MIN-641"]'),
      route = stage.querySelector('[data-inter-segment="RT-LOP-01"]'),
      signalEl = stage.querySelector('[data-inter-signal="S-LOP-E"]'),
      sw = stage.querySelector('[data-inter-switch="AIG-LOP-03"]');
    if (exp)
      exp.style.transform = `translate(${390 + phase * 28}px ${phase < 3 ? 174 : 154}px)`;
    if (min)
      min.style.transform = `translate(${585 + (phase > 3 ? phase * 5 : 0)}px 214px)`;
    route?.classList.toggle("active-route", phase >= 1 && phase <= 4);
    signalEl?.classList.toggle("red", phase < 4);
    signalEl?.classList.toggle("green", phase >= 4);
    sw?.classList.toggle("diverted", phase < 3);
    stage.querySelectorAll(".inter-signal").forEach((s, i) => {
      if (i % 3 !== phase % 3) return;
      s.classList.remove("green", "yellow", "red", "just-changed");
      s.classList.add(phase < 2 ? "green" : phase < 4 ? "yellow" : "red");
      requestAnimationFrame(() => s.classList.add("just-changed"));
    });
    stage.querySelectorAll(".inter-segment.reserved").forEach((r) =>
      r.classList.toggle("route-flow", phase % 2 === 0),
    );
  }
  new MutationObserver(install).observe(document.body, {
    childList: true,
    subtree: true,
  });
  install();
  animate();
  window.SETRAGRailModel = { railNodes, railSegments, complexes };
})();
