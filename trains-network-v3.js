(function () {
  "use strict";
  const stations = [
    [55, 118, "Owendo"],
    [180, 104, "Ntoum"],
    [305, 136, "Ndjolé"],
    [430, 91, "Lopé"],
    [555, 151, "Booué"],
    [680, 116, "Lastourville"],
    [820, 144, "Moanda"],
    [945, 105, "Franceville"],
  ];
  function network() {
    return `<svg class="rail-network-v3" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-label="Schéma détaillé du réseau SETRAG"><path class="rail-bed-v3" d="M35 118 C105 118 116 88 180 104 S255 154 305 136 S380 69 430 91 S505 174 555 151 S625 90 680 116 S766 172 820 144 S900 82 970 108"/><path class="route-v3 main" d="M35 118 C105 118 116 88 180 104 S255 154 305 136 S380 69 430 91 S505 174 555 151 S625 90 680 116 S766 172 820 144 S900 82 970 108"/><path class="route-v3 return" d="M35 210 C105 210 118 178 180 194 S250 238 305 219 S380 154 430 178 S500 247 555 230 S625 169 680 196 S765 249 820 226 S902 171 970 195"/><g class="sidings">${[
      [250, 305, 355, 136, 176, 142],
      [375, 430, 485, 91, 52, 114],
      [500, 555, 610, 151, 188, 157],
      [625, 680, 735, 116, 78, 125],
      [765, 820, 875, 144, 185, 151],
    ]
      .map(
        (x, i) =>
          `<path class="siding ${i === 1 ? "active" : ""}" d="M${x[0]} ${x[3]} Q${x[1]} ${x[4]} ${x[2]} ${x[5]}"/><path class="switch ${i === 1 ? "diverted" : ""}" d="M${x[0]} ${x[3]} l15 ${x[4] < x[3] ? -9 : 9}"/>`,
      )
      .join(
        "",
      )}</g><g class="branches"><path d="M55 118 Q70 58 105 48"/><path d="M70 128 Q95 160 125 165"/><path d="M305 136 Q325 194 365 198"/><path d="M555 151 Q575 285 630 294"/><path d="M820 144 Q815 61 860 46"/><path d="M945 105 Q950 54 980 43"/></g><g class="terminal-labels"><text x="73" y="40">DÉPÔT OWENDO</text><text x="78" y="179">HYDROCARBURES</text><text x="326" y="216">TERMINAL BOIS</text><text x="590" y="312">ATELIER VOIE</text><text x="815" y="35">TERMINAL MINIER</text><text x="914" y="34">DÉPÔT</text></g><g class="station-zones">${stations.map((s, i) => `<g data-net-station="${s[2]}" class="station-zone"><rect x="${s[0] - 26}" y="${s[1] - 17}" width="52" height="7" rx="2"/><rect x="${s[0] - 20}" y="${s[1] + 10}" width="40" height="5" rx="2"/><circle cx="${s[0]}" cy="${s[1]}" r="5"/><text x="${s[0]}" y="${s[1] - 24}">${s[2]}</text><text class="platform-label" x="${s[0]}" y="${s[1] + 27}">Quai ${(i % 3) + 1}</text></g>`).join("")}</g><g class="block-lines"><path data-net-block="CT-OWE-01" class="net-block free" d="M35 118 C105 118 116 88 180 104"/><path data-net-block="CT-NTM-03" class="net-block reserved" d="M180 104 C240 116 260 152 305 136"/><path data-net-block="CT-NDJ-02" class="net-block occupied" d="M305 136 C365 113 385 70 430 91"/><path data-net-block="CT-BOP-04" class="net-block works" d="M430 91 C500 114 510 173 555 151"/><path data-net-block="CT-MDA-02" class="net-block free" d="M680 116 C750 130 770 168 820 144"/></g><g class="net-signals">${stations
      .slice(1, -1)
      .map(
        (s, i) =>
          `<g data-net-signal="S-${s[2].slice(0, 3).toUpperCase()}-${i + 1}" class="net-signal ${i === 3 ? "yellow" : i === 4 ? "red" : "green"}" transform="translate(${s[0] - 18} ${s[1] - 10})"><rect width="9" height="23" rx="3"/><circle cx="4.5" cy="5" r="3"/></g>`,
      )
      .join("")}</g><g class="pk-marks">${[
      [35, 270, "PK 0"],
      [180, 278, "PK 82"],
      [305, 286, "PK 118"],
      [430, 250, "PK 214"],
      [555, 285, "PK 316"],
      [820, 286, "PK 487"],
      [955, 270, "PK 648"],
    ]
      .map((p) => `<text x="${p[0]}" y="${p[1]}">${p[2]}</text>`)
      .join(
        "",
      )}</g><g class="infra"><text x="225" y="190">╳ PN-12</text><text x="735" y="210">╳ PN-31</text><text x="465" y="305">≋ PONT OGOOUÉ</text><text x="640" y="53">◖ TUNNEL</text><text x="875" y="266">▲ SECTEUR ROCHEUX</text></g></svg><div class="net-ltv" data-incident="INC-316"><b>LTV 40</b><span>PK 316–321 · travaux</span></div><div class="net-crossing"><b>Croisement Lopé · 19:04</b><span>EXP-620 prioritaire · MIN-641 évitement</span></div><div class="net-zoom"><button data-net-zoom="network" class="active">Réseau</button><button data-net-zoom="sector">Secteur</button><button data-net-zoom="station">Gare</button></div>`;
  }
  function panel(title, body) {
    let root = document.querySelector("#trainOverlay");
    if (!root) return;
    root.innerHTML = `<div class="train-overlay-back"><aside class="train-side-drawer"><button class="drawer-x" data-net-close>×</button><span class="train-eyebrow">SUPERVISION FERROVIAIRE</span><h2>${title}</h2>${body}</aside></div>`;
    root.querySelector("[data-net-close]").onclick = () =>
      (root.innerHTML = "");
  }
  function info(rows) {
    return `<div class="train-info-list">${rows.map((x) => `<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div>`;
  }
  function bind(stage) {
    stage.querySelectorAll("[data-net-signal]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(
            `Signal ${x.dataset.netSignal}`,
            info([
              [
                "État",
                x.classList.contains("red")
                  ? "Rouge"
                  : x.classList.contains("yellow")
                    ? "Jaune"
                    : "Vert",
              ],
              ["Type", "Signal d’entrée"],
              ["Cause", "Occupation du canton suivant"],
              ["Dernier changement", "18:41:22"],
              ["Train concerné", "OMN-218"],
            ]),
          )),
    );
    stage.querySelectorAll("[data-net-block]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(
            `Canton ${x.dataset.netBlock}`,
            info([
              [
                "État",
                x.classList.contains("works")
                  ? "Travaux"
                  : x.classList.contains("occupied")
                    ? "Occupé"
                    : "Libre",
              ],
              ["Limites", "PK 286 → PK 331"],
              ["Vitesse", "40 km/h"],
              ["Signal d’entrée", "S-BOP-04"],
              ["Dernier train", "EXP-620 · 18:36"],
            ]),
          )),
    );
    stage.querySelectorAll("[data-net-station]").forEach(
      (x) =>
        (x.onclick = () =>
          panel(
            `Zone ferroviaire · ${x.dataset.netStation}`,
            info([
              ["Quais", "2 disponibles sur 3"],
              ["Voie d’évitement", "Réservée"],
              ["Signal d’entrée", "Jaune"],
              ["Prochain train", "EXP-620"],
              ["Opération", "Croisement planifié"],
            ]),
          )),
    );
    stage.querySelectorAll("[data-net-zoom]").forEach(
      (x) =>
        (x.onclick = () => {
          stage
            .querySelectorAll("[data-net-zoom]")
            .forEach((b) => b.classList.remove("active"));
          x.classList.add("active");
          stage.dataset.zoom = x.dataset.netZoom;
          toast(`Zoom ${x.textContent} activé`);
        }),
    );
    stage.querySelector(".net-ltv").onclick = () =>
      panel(
        "Limitation temporaire de vitesse",
        info([
          ["Zone", "PK 316 à PK 321"],
          ["Vitesse", "40 km/h"],
          ["Cause", "Renouvellement de voie"],
          ["Fin prévue", "03/08/2026 · 06:00"],
          ["Impact", "+4 à +7 minutes"],
        ]),
      );
  }
  function enrichDetail() {
    let list = document
      .querySelector(".motion-state")
      ?.closest(".train-info-list");
    if (list && !list.querySelector(".next-signal-row"))
      list.insertAdjacentHTML(
        "beforeend",
        '<div class="next-signal-row"><span>Prochain signal</span><b>S-BOP-04 · 3,8 km · Jaune</b></div><div><span>Dernière activité</span><b>Canton CT-NDJ-02 libéré</b></div>',
      );
  }
  function upgrade() {
    enrichDetail();
    let stage = document.querySelector(".rail-stage");
    if (!stage || stage.dataset.networkV3) return;
    stage.dataset.networkV3 = "true";
    stage.insertAdjacentHTML("afterbegin", network());
    let menu = document.querySelector("#layersMenu");
    if (menu && !menu.querySelector("[data-net-legend]"))
      menu.insertAdjacentHTML(
        "beforeend",
        "<button data-net-legend>Légende complète</button>",
      );
    menu?.querySelector("[data-net-legend]")?.addEventListener("click", () =>
      panel(
        "Légende du réseau",
        info([
          ["Train voyageurs", "Bleu / vert"],
          ["Train minéralier", "Violet"],
          ["Canton libre", "Vert"],
          ["Canton occupé", "Bleu"],
          ["Travaux / LTV", "Orange hachuré"],
          ["Signal fermé", "Rouge"],
          ["Position estimée", "Halo gris"],
        ]),
      ),
    );
    bind(stage);
    let control = stage.closest(".rail-control");
    control?.classList.add("hide-blocks", "hide-switches", "hide-crossings");
    ["blocks", "switches", "crossings"].forEach((name) => {
      let input = menu?.querySelector(`[data-layer="${name}"]`);
      if (input) input.checked = false;
    });
  }
  new MutationObserver(upgrade).observe(document.body, {
    childList: true,
    subtree: true,
  });
  upgrade();
  let phase = 0;
  setInterval(() => {
    let stage = document.querySelector(".rail-stage[data-network-v3]");
    if (!stage) return;
    phase = (phase + 1) % 4;
    let signals = stage.querySelectorAll(".net-signal"),
      blocks = stage.querySelectorAll(".net-block"),
      s = signals[2],
      b = blocks[2];
    if (s) {
      s.classList.remove("green", "yellow", "red");
      s.classList.add(
        phase === 0
          ? "green"
          : phase === 1
            ? "yellow"
            : phase === 2
              ? "red"
              : "green",
      );
    }
    if (b) {
      b.classList.toggle("occupied", phase === 2);
      b.classList.toggle("reserved", phase === 1);
    }
    let sw = stage.querySelector(".switch.diverted");
    if (sw) sw.classList.toggle("moving", phase === 1);
  }, 4500);
})();
