(function () {
  "use strict";
  const trains = [
    {
      id: "EXP-620",
      mission: "Express voyageurs",
      route: "Owendo → Franceville",
      position: "Lopé",
      next: "Booué · 18:42",
      load: "642 voyageurs",
      speed: 72,
      delay: 0,
      status: "À l’heure",
      type: "passenger",
      progress: 43,
      lane: 1,
      loco: "CC-2200-04",
      driver: "Jean-Pierre Raponda",
      cars: "8 voitures",
      signal: "Voie libre",
    },
    {
      id: "OMN-218",
      mission: "Omnibus voyageurs",
      route: "Franceville → Owendo",
      position: "Booué",
      next: "Lopé · 19:08",
      load: "385 voyageurs",
      speed: 48,
      delay: 18,
      status: "Retard 18 min",
      type: "delayed",
      progress: 57,
      lane: 2,
      loco: "CC-2200-09",
      driver: "Patrick Mabika",
      cars: "7 voitures",
      signal: "Vigilance",
    },
    {
      id: "MIN-641",
      mission: "Manganèse · Comilog",
      route: "Moanda → Owendo",
      position: "PK 487",
      next: "Lastourville · 17:05",
      load: "3 150 t",
      speed: 56,
      delay: 12,
      status: "Retard léger",
      type: "freight",
      progress: 72,
      lane: 2,
      loco: "CC-2200-17",
      driver: "Éric Okoumba",
      cars: "45 wagons",
      signal: "Voie réservée",
    },
    {
      id: "MIN-642",
      mission: "Manganèse enrichi",
      route: "Moanda → Owendo",
      position: "Milolé",
      next: "Lastourville · 18:12",
      load: "2 980 t",
      speed: 61,
      delay: 0,
      status: "À l’heure",
      type: "freight",
      progress: 66,
      lane: 2,
      loco: "CC-2200-12",
      driver: "Clovis Agondjo",
      cars: "42 wagons",
      signal: "Voie libre",
    },
    {
      id: "BOIS-204",
      mission: "Grumes certifiées",
      route: "Ndjolé → Owendo",
      position: "PK 118",
      next: "Ntoum · 17:44",
      load: "1 180 t",
      speed: 50,
      delay: 0,
      status: "À l’heure",
      type: "freight",
      progress: 24,
      lane: 2,
      loco: "CC-2200-06",
      driver: "Serge Rombi",
      cars: "28 wagons",
      signal: "Voie libre",
    },
    {
      id: "HC-118",
      mission: "Hydrocarbures · Gasoil",
      route: "Owendo → Franceville",
      position: "Booué",
      next: "Ivindo · 18:31",
      load: "920 000 L",
      speed: 44,
      delay: 0,
    status: "Position estimée",
      type: "incident",
      progress: 59,
      lane: 1,
      loco: "CC-2200-21",
      driver: "Alain Nziengui",
      cars: "18 citernes",
    signal: "Radio intermittente",
    },
    {
      id: "FRET-332",
      mission: "Fret général",
      route: "Owendo → Franceville",
      position: "Ndjolé",
      next: "Lopé · 20:04",
      load: "840 t",
      speed: 54,
      delay: 0,
      status: "À l’heure",
      type: "freight",
      progress: 31,
      lane: 1,
      loco: "CC-2200-11",
      driver: "David Lekogo",
      cars: "22 wagons",
      signal: "Voie libre",
    },
    {
      id: "MAINT-017",
      mission: "Inspection de la voie",
      route: "Booué → PK 246",
      position: "PK 231",
      next: "Zone travaux · 18:20",
      load: "8 agents",
      speed: 18,
      delay: 0,
      status: "Mode travaux",
      type: "maintenance",
      progress: 51,
      lane: 1,
      loco: "DRAISINE-07",
      driver: "Luc Mbadinga",
      cars: "2 unités",
      signal: "Autorisation travaux",
    },
  ];
  let selected = "EXP-620",
    filter = "all",
    activeTab = "summary",
    followMode = false,
    lastFrame = performance.now(),
    scenario = 0;
  const help = (t) =>
    `<span class="train-help" title="${t}" aria-label="Aide : ${t}">!</span>`;
  function marker(t) {
    return `<button class="train-marker-pro svg-motion lane-${t.lane} ${t.type} ${t.id === selected ? "selected" : ""}" data-train="${t.id}" style="offset-distance:${t.progress}%" title="${t.mission} · ${t.route} · prochaine gare ${t.next}"><b>${t.lane === 1 ? "→" : "←"} ${t.id}</b><small>${t.type === "freight" ? t.load : t.speed + " km/h"} · ${t.status}</small><span class="mini-consist">${t.type === "passenger" || t.type === "delayed" ? "LOC—V1—V2" : "LOC—W1—W2—W3"}</span></button>`;
  }
  function rail() {
    let stations = [
        [4, "Owendo"],
        [16, "Ntoum"],
        [29, "Ndjolé"],
        [43, "Lopé"],
        [56, "Booué"],
        [69, "Lastourville"],
        [83, "Moanda"],
        [96, "Franceville"],
      ],
      blocks = [4, 16, 29, 43, 56, 69, 83, 96];
    return `<section class="rail-control ${followMode ? "following" : ""}"><div class="rail-control-head"><div><h2>Vue ferroviaire animée</h2><p>Simulation temps réel · Actualisation toutes les 10 secondes <span class="refresh-dot"></span></p></div><div class="rail-tools"><button data-main-tool="filters">Filtres</button><button data-main-tool="incidents">Incidents <b>1</b></button><button data-main-tool="follow" class="${followMode ? "active" : ""}">${followMode ? "Arrêter le suivi" : "Suivre"}</button><button data-main-tool="full">Plein écran</button><button data-main-tool="more" aria-label="Plus d’options">•••</button></div><div class="layers-menu" id="layersMenu"><b>Affichage</b>${[
      ["signals", "Signaux"],
      ["blocks", "Cantons"],
      ["limits", "Limitations"],
      ["works", "Travaux"],
      ["switches", "Aiguillages"],
      ["crossings", "Croisements"],
    ]
      .map(
        (x) =>
          `<label><input type="checkbox" data-layer="${x[0]}" checked> ${x[1]}</label>`,
      )
      .join(
        "",
      )}<button data-main-tool="center">Revenir à la vue complète</button></div></div><div class="rail-stage"><span class="rail-label outbound">VOIE A · OWENDO → FRANCEVILLE</span><span class="rail-label inbound">VOIE B · FRANCEVILLE → OWENDO</span><div class="rail-line outbound"></div><div class="rail-line inbound"></div><div class="rail-blocks">${blocks
      .slice(0, -1)
      .map(
        (x, i) =>
          `<button class="rail-block ${i === 3 ? "works" : i === 4 ? "occupied" : "free"}" data-block="C-${String(i + 11).padStart(2, "0")}" style="left:${x}%;width:${blocks[i + 1] - x}%" title="Canton C-${i + 11} · ${i === 3 ? "Travaux" : i === 4 ? "Occupé" : "Libre"}"></button>`,
      )
      .join("")}</div><div class="rail-signals">${stations
      .slice(1, -1)
      .map(
        (s, i) =>
          `<button class="rail-signal ${i === 3 ? "yellow" : i === 4 ? "red" : "green"}" data-signal="S-${s[1].slice(0, 3).toUpperCase()}-${i + 1}" style="left:${s[0] - 2}%"><i></i></button>`,
      )
      .join(
        "",
      )}</div><div class="rail-stations">${stations.map((s, i) => `<button class="rail-station ${[0, 2, 3, 4, 6, 7].includes(i) ? "major" : ""}" data-station="${s[1]}" style="left:${s[0]}%"><i></i><b>${s[1]}</b></button>`).join("")}${stations.map((s) => `<span class="rail-station inbound" style="left:${s[0]}%"><i></i></span>`).join("")}</div>${trains.map(marker).join("")}<button class="rail-alert" data-incident="INC-316">⚠ PK 316 · 40 km/h</button><span class="crossing-note">Croisement Lopé · 19:04</span></div></section>`;
  }
  function row(t) {
    let c = t.delay ? "warn" : t.type === "incident" ? "bad" : "";
    return `<tr data-train="${t.id}" class="${t.id === selected ? "selected" : ""}"><td><b>${t.id}</b><small>${t.loco}</small></td><td><b>${t.mission}</b><small>${t.cars}</small></td><td>${t.route}</td><td><b>${t.position}</b><small>${t.speed} km/h</small></td><td>${t.load}</td><td>${t.next}</td><td>${t.delay ? "+" + t.delay + " min" : "À l’heure"}</td><td><span class="train-pill ${c}">${t.status}</span></td><td><button class="row-menu" data-row-menu="${t.id}" aria-label="Actions pour ${t.id}">•••</button></td></tr>`;
  }
  function tabContent(tab, t) {
    let isP = t.type === "passenger" || t.type === "delayed",
      data = {
        summary: `<h4>Progression</h4><div class="train-progress"><i style="width:${t.progress}%"></i></div><p><b>${Math.round(t.progress)} %</b> du trajet effectué · arrivée estimée 20:18</p><div class="train-info-list"><div><span>État actuel</span><b class="motion-state">En marche</b></div><div><span>Priorité</span><b>${isP ? "Voyageurs prioritaire" : "Fret programmé"}</b></div><div><span>Transmission</span><b>GPS 98 % · Radio connectée</b></div><div><span>Prévision simulée</span><b>${t.delay ? "Retard stable" : "Arrivée à l’heure probable"}</b></div></div>`,
        route: `<h4>Étapes du trajet</h4><div class="journey-mini"><span class="done">Départ</span><i></i><span class="current">${t.position}</span><i></i><span>${t.next.split(" · ")[0]}</span><i></i><span>Arrivée</span></div><div class="train-info-list"><div><span>Arrivée prévue</span><b>18:38</b></div><div><span>Arrivée estimée</span><b>${t.delay ? "18:" + (38 + t.delay) : "18:38"}</b></div><div><span>Voie / canton</span><b>Voie ${t.lane === 1 ? "A" : "B"} · C-${Math.round(t.progress / 4) + 10}</b></div><div><span>Opération prévue</span><b>${isP ? "42 montées · 31 descentes" : "Contrôle chargement"}</b></div></div><button class="inline-more" data-train-action="stops">Voir tous les arrêts</button>`,
        composition: `<h4>${isP ? "Voitures et occupation" : "Wagons et marchandises"}</h4><div class="composition-mini"><button class="loco">${t.loco}</button>${Array.from({ length: 6 }, (_, i) => `<button>${isP ? "V" : "W"}${String(i + 1).padStart(2, "0")}<small>${isP ? 72 - i * 4 + "%" : Math.round(58 + i * 3) + " t"}</small></button>`).join("")}</div><p>${t.cars} · contrôle technique conforme · aucune anomalie bloquante.</p>`,
        team: `<h4>Équipe en mission</h4><div class="crew-mini"><span class="crew-avatar">${t.driver
          .split(" ")
          .map((x) => x[0])
          .join("")
          .slice(
            0,
            2,
          )}</span><div><b>${t.driver}</b><small>Conducteur principal · En mission</small><em>Canal OPS-${t.id.slice(-3)}</em></div></div><div class="crew-mini"><span class="crew-avatar alt">DE</span><div><b>Diane Moukagni</b><small>${isP ? "Chef de train" : "Responsable fret"} · En mission</small><em>Radio connectée</em></div></div>`,
        events: `<h4>Alertes actives</h4>${t.delay ? `<article class="alert-item warn"><b>Retard · ${t.delay} min</b><span>Impact : croisement à Lopé à surveiller.</span><small>Action : confirmer la priorité.</small></article>` : ""}<article class="alert-item"><b>Limitation · PK 316</b><span>Travaux de voie · vitesse limitée à 40 km/h.</span><small>Action : acquitter la consigne.</small></article>`,
      };
    return (
      data[tab] +
      `<div class="train-actionbar"><button class="primary" data-train-action="follow">${followMode ? "Arrêter le suivi" : "Suivre ce train"}</button><button data-train-action="contact">Contacter</button><button data-train-action="moreDetail">Autres •••</button></div>`
    );
  }
  function detail() {
    let t = trains.find((x) => x.id === selected) || trains[0],
      tabs = [
        ["summary", "Synthèse"],
        ["route", "Trajet"],
        ["composition", "Composition"],
        ["team", "Équipe"],
        ["events", "Alertes"],
      ];
    return `<aside class="train-detail"><div class="train-detail-top"><small>DERNIÈRE TRANSMISSION · IL Y A 4 S</small><h3>${t.id} <span class="detail-state">${t.status}</span></h3><p>${t.mission} · ${t.route}</p></div><div class="train-detail-metrics"><div><small>POSITION</small><b>${t.position}</b></div><div><small>VITESSE</small><b>${t.speed} km/h</b></div><div><small>CHARGE</small><b>${t.load}</b></div><div><small>PROCHAINE GARE</small><b>${t.next}</b></div><div><small>LOCOMOTIVE</small><b>${t.loco}</b></div><div><small>SIGNAL</small><b>${t.signal}</b></div></div><nav class="train-tabs">${tabs.map((x) => `<button class="${activeTab === x[0] ? "active" : ""}" data-train-tab="${x[0]}">${x[1]}</button>`).join("")}</nav><div class="train-tab-body" id="trainTabBody">${tabContent(activeTab, t)}</div></aside>`;
  }
  function page() {
    return `<div class="train-premium"><header class="train-compact-head"><div><span class="train-eyebrow">SUPERVISION FERROVIAIRE</span><h1>Trains & circulations ${help("Position, direction, vitesse et état de tous les trains.")}</h1><p>Simulation temps réel · Actualisation toutes les 10 secondes</p></div><div><span class="sync-state"><i></i> Synchronisé il y a 4 s</span><button data-train-action="refresh">Actualiser</button></div></header><div class="train-kpis five"><button data-filter="all"><i></i><small>TRAINS ACTIFS</small><b>18</b><span>5 voyageurs · 13 fret</span></button><button class="warn" data-filter="delayed"><i></i><small>RETARDS</small><b>2</b><span>Maximum 18 min</span></button><button class="bad" data-filter="incident"><i></i><small>INCIDENTS</small><b>1</b><span>0 interruption</span></button><button><i></i><small>PONCTUALITÉ</small><b>91%</b><span>Objectif 95%</span></button><button><i></i><small>TRANSMISSION</small><b>17 / 18</b><span>1 position estimée</span></button></div>${rail()}<div class="train-main-grid"><section class="train-list-card"><div class="train-section-head"><h2>Circulations</h2><p>Cliquez sur une ligne pour ouvrir la fiche du train.</p></div><div class="train-filters"><input id="trainSearch" placeholder="Rechercher train, gare, locomotive…"><select id="trainType"><option value="all">Tous</option><option value="passenger">Voyageurs</option><option value="freight">Fret</option><option value="delayed">En retard</option></select><button class="btn ghost" data-train-action="columns">Colonnes</button><button class="btn ghost" data-train-action="export">Exporter</button></div><div class="train-table-wrap"><table class="train-pro-table"><thead><tr><th>TRAIN</th><th>MISSION</th><th>TRAJET</th><th>POSITION</th><th>CHARGE</th><th>PROCHAINE ÉTAPE</th><th>ÉCART</th><th>STATUT</th><th></th></tr></thead><tbody>${trains.map(row).join("")}</tbody></table></div><footer class="train-pagination"><span>1–8 sur 18 trains</span><button disabled>←</button><button>1</button><button>2</button><button>3</button><button>→</button></footer></section>${detail()}</div><div id="trainOverlay"></div></div>`;
  }
  function filterRows() {
    document.querySelectorAll(".train-pro-table tbody tr").forEach((r) => {
      let t = trains.find((x) => x.id === r.dataset.train);
      r.style.display =
        filter === "all" ||
        t.type === filter ||
        (filter === "delayed" && t.delay)
          ? ""
          : "none";
    });
    toast("Filtre appliqué");
  }
  function overlay(html) {
    let o = document.querySelector("#trainOverlay");
    if (o) {
      o.innerHTML = `<div class="train-overlay-back"><aside class="train-side-drawer"><button class="drawer-x" data-close-overlay>×</button>${html}</aside></div>`;
      o.querySelector("[data-close-overlay]").onclick = () =>
        (o.innerHTML = "");
    }
  }
  function incidents() {
    overlay(
      `<span class="train-eyebrow">TEMPS RÉEL</span><h2>Incidents actifs</h2><p class="drawer-intro">Cliquez sur un incident pour voir la zone et le train concerné.</p><button class="incident-card" data-incident-pick="HC-118"><b>Mineur · Voie</b><strong>Limitation au PK 316</strong><span>HC-118 · depuis 12 min</span><small>Équipe Voie 02 · fin estimée 19:10</small></button><button class="incident-card info" data-incident-pick="OMN-218"><b>Information · Signalisation</b><strong>Signal fermé à Booué</strong><span>OMN-218 · depuis 4 min</span><small>Régulation en cours</small></button>`,
    );
    document.querySelectorAll("[data-incident-pick]").forEach(
      (b) =>
        (b.onclick = () => {
          selected = b.dataset.incidentPick;
          document.querySelector("#trainOverlay").innerHTML = "";
          renderTrains();
        }),
    );
  }
  function pop(title, rows) {
    overlay(
      `<h2>${title}</h2><div class="train-info-list">${rows.map((x) => `<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div><button class="btn primary" data-close-overlay>Fermer</button>`,
    );
  }
  function toggleFollow() {
    followMode = !followMode;
    renderTrains();
    toast(followMode ? `Suivi de ${selected} activé` : "Suivi arrêté");
  }
  function bindPremium() {
    document.querySelectorAll("[data-train]").forEach(
      (x) =>
        (x.onclick = (e) => {
          if (e.target.closest(".row-menu")) return;
          selected = x.dataset.train;
          renderTrains();
        }),
    );
    document.querySelectorAll("[data-train-tab]").forEach(
      (b) =>
        (b.onclick = () => {
          activeTab = b.dataset.trainTab;
          document
            .querySelectorAll("[data-train-tab]")
            .forEach((x) => x.classList.toggle("active", x === b));
          document.querySelector("#trainTabBody").innerHTML = tabContent(
            activeTab,
            trains.find((x) => x.id === selected),
          );
          bindPremium();
        }),
    );
    document.querySelectorAll("[data-main-tool]").forEach(
      (b) =>
        (b.onclick = () => {
          let a = b.dataset.mainTool;
          if (a === "incidents") incidents();
          if (a === "follow") toggleFollow();
          if (a === "full")
            document.querySelector(".rail-control")?.requestFullscreen?.();
          if (a === "more")
            document.querySelector("#layersMenu")?.classList.toggle("open");
          if (a === "filters") document.querySelector("#trainType")?.focus();
          if (a === "center") {
            followMode = false;
            renderTrains();
          }
        }),
    );
    document
      .querySelectorAll("[data-layer]")
      .forEach(
        (c) =>
          (c.onchange = () =>
            document
              .querySelector(".rail-control")
              ?.classList.toggle("hide-" + c.dataset.layer, !c.checked)),
      );
    document.querySelectorAll("[data-signal]").forEach(
      (b) =>
        (b.onclick = () =>
          pop(`Signal ${b.dataset.signal}`, [
            ["État", b.classList.contains("red") ? "Rouge" : "Autorisé"],
            [
              "Cause",
              b.classList.contains("red")
                ? "Canton suivant occupé"
                : "Itinéraire libre",
            ],
            ["Train concerné", "OMN-218"],
            ["Depuis", "18:41"],
          ])),
    );
    document.querySelectorAll("[data-block]").forEach(
      (b) =>
        (b.onclick = () =>
          pop(`Canton ${b.dataset.block}`, [
            [
              "État",
              b.classList.contains("works")
                ? "Travaux"
                : b.classList.contains("occupied")
                  ? "Occupé"
                  : "Libre",
            ],
            ["PK début / fin", "PK 286 → PK 331"],
            ["Vitesse autorisée", "40 km/h"],
            ["Dernier passage", "EXP-620 · 18:36"],
          ])),
    );
    document.querySelectorAll("[data-station]").forEach(
      (b) =>
        (b.onclick = () =>
          pop(`Gare de ${b.dataset.station}`, [
            ["Voies disponibles", "2 / 3"],
            ["Prochain train", selected],
            ["Opération", "Croisement planifié"],
            ["État", "Opérationnelle"],
          ])),
    );
    document
      .querySelectorAll("[data-incident]")
      .forEach((b) => (b.onclick = incidents));
    document.querySelectorAll("[data-row-menu]").forEach(
      (b) =>
        (b.onclick = (e) => {
          e.stopPropagation();
          pop(`Actions · ${b.dataset.rowMenu}`, [
            ["Ouvrir", "Fiche complète"],
            ["Suivre", "Centrer la vue"],
            ["Équipe", "Contacter par radio"],
            ["Document", "Générer un rapport"],
          ]);
        }),
    );
    document.querySelectorAll("[data-train-action]").forEach(
      (b) =>
        (b.onclick = () => {
          let a = b.dataset.trainAction;
          if (a === "follow") return toggleFollow();
          if (a === "moreDetail")
            return pop("Autres informations", [
              ["Signalisation", "Historique des signaux"],
              ["Documents", "3 documents"],
              ["Rapport", "Disponible au format PDF"],
            ]);
          if (a === "stops")
            return pop("Tous les arrêts", [
              ["Départ", "Effectué à 16:20"],
              [
                "Position actuelle",
                trains.find((x) => x.id === selected).position,
              ],
              ["Prochain arrêt", trains.find((x) => x.id === selected).next],
              ["Arrivée", "Prévue à 20:18"],
            ]);
          toast(
            {
              contact: "Canal radio ouvert",
              refresh: "Synchronisation terminée",
              export: "Export prêt",
              columns: "Choix des colonnes ouvert",
            }[a] || "Action effectuée",
          );
        }),
    );
    let s = document.querySelector("#trainSearch");
    if (s)
      s.oninput = () =>
        document
          .querySelectorAll(".train-pro-table tbody tr")
          .forEach(
            (r) =>
              (r.style.display = r.textContent
                .toLowerCase()
                .includes(s.value.toLowerCase())
                ? ""
                : ""),
          );
    let t = document.querySelector("#trainType");
    if (t)
      t.onchange = () => {
        filter = t.value;
        filterRows();
      };
    document.querySelectorAll("[data-filter]").forEach(
      (b) =>
        (b.onclick = () => {
          filter = b.dataset.filter;
          filterRows();
        }),
    );
  }
  function renderTrains() {
    let root = document.querySelector("#content");
    if (!root) return;
    root.innerHTML = page();
    bindPremium();
    if (window.lucide) lucide.createIcons();
  }
  pages.trains = function () {
    setTimeout(renderTrains, 0);
    return '<div class="op-loading"><i></i><i></i><i></i></div>';
  };
  function animate(now) {
    let dt = Math.min(40, now - lastFrame);
    lastFrame = now;
    trains.forEach((t) => {
      let near = [16, 29, 43, 56, 69, 83].some(
          (p) => Math.abs(t.progress - p) < 1.2,
        ),
        factor = near ? 0.18 : 1;
      if (t.id === "OMN-218" && scenario % 600 < 110) factor = 0;
      t.progress +=
        (((t.lane === 1 ? 1 : -1) * t.speed * dt) / 900000) * factor;
      if (t.progress > 97) t.progress = 4;
      if (t.progress < 4) t.progress = 96;
    });
    if (current === "trains") {
      document.querySelectorAll(".train-marker-pro").forEach((m) => {
        let t = trains.find((x) => x.id === m.dataset.train),
          atStation = Math.abs(t.progress - 56) < 1;
        m.style.offsetDistance = t.progress + "%";
        if (t)
          m.querySelector("small").textContent =
            (atStation
              ? "BOOUÉ · Arrêt"
              : t.type === "freight"
                ? t.load
                : t.speed + " km/h") +
            " · " +
            (atStation ? "03:24" : t.status);
      });
      let phase = scenario % 900,
        signal = document.querySelectorAll(".rail-signal")[3];
      if (signal) {
        signal.className =
          "rail-signal " +
          (phase < 250
            ? "green"
            : phase < 430
              ? "yellow"
              : phase < 600
                ? "red"
                : "green");
      }
      let t = trains.find((x) => x.id === selected),
        bar = document.querySelector(".train-progress i");
      if (bar && t) bar.style.width = t.progress + "%";
      let state = document.querySelector(".motion-state");
      if (state && t)
        state.textContent =
          Math.abs(t.progress - 56) < 1
            ? "Arrêt en gare"
            : phase < 430
              ? "Ralentissement"
              : "En marche";
      if (followMode && t)
        document
          .querySelector(".rail-control")
          ?.style.setProperty("--selected-position", t.progress + "%");
    }
    scenario++;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
