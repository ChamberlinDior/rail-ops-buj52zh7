(function () {
  "use strict";
  const I = (n) => `<i data-lucide="${n}"></i>`;
  const G = {
    "Vue d’ensemble": [
      "Cette page résume toute l’activité.",
      [
        "Les grands chiffres",
        "Ils montrent les ventes, les voyageurs et les alertes.",
      ],
      ["Les graphiques", "Ils montrent si l’activité monte ou baisse."],
      ["Les alertes", "Cliquez dessus pour voir le problème."],
    ],
    "Centre des opérations": [
      "Cette page sert à surveiller le réseau en direct.",
      [
        "Les chiffres du haut",
        "Ils indiquent les trains, retards, incidents, voyageurs, fret et agents.",
      ],
      [
        "La ligne ferroviaire",
        "Elle montre où sont les trains et dans quel sens ils roulent.",
      ],
      ["Le tableau", "Cliquez sur un train pour ouvrir tous ses détails."],
      [
        "Les onglets",
        "Ils donnent accès aux passagers, bagages, agents, gares et ressources.",
      ],
    ],
    "Ventes & prestations": [
      "Cette page sert à vendre et à suivre toutes les prestations.",
      [
        "Nouvelle opération",
        "Utilisez ce bouton pour créer un billet, un bagage, un colis ou une marchandise.",
      ],
      [
        "Le tableau",
        "Il contient toutes les ventes avec leur paiement et leur impression.",
      ],
      [
        "La fiche à droite",
        "Cliquez sur une ligne pour voir le client, le trajet, le paiement et les documents.",
      ],
      ["Les chiffres", "Cliquez sur une carte pour filtrer la liste."],
    ],
    "Trains & circulations": [
      "Cette page donne à la direction une vue claire de tous les trains et permet aux équipes de réagir rapidement.",
      [
        "Commencer par les cinq chiffres",
        "Ils donnent immédiatement les trains actifs, les retards, les incidents, la ponctualité et la qualité des transmissions.",
      ],
      [
        "Présenter le réseau",
        "Ce plan montre les voies principales, les faisceaux, les embranchements et les itinéraires accordés sur le corridor SETRAG.",
      ],
      [
        "Montrer les gares",
        "Owendo, Ndjolé, Lopé et Moanda sont représentées avec leurs quais, voies d’évitement, fret, dépôts et terminaux.",
      ],
      [
        "Montrer les compositions",
        "Chaque train apparaît directement sur sa voie avec sa locomotive, ses voitures ou ses wagons et un statut court.",
      ],
      [
        "Expliquer les couleurs",
        "Le gris indique une voie libre, le bleu une réservation, le rouge une occupation, le vert un itinéraire accordé et l’orange une maintenance.",
      ],
      [
        "Expliquer les zones spécialisées",
        "Owendo possède ses dépôts et son terminal hydrocarbures. Ndjolé dessert le bois. Moanda possède son terminal minier. Franceville dispose d’un dépôt.",
      ],
      [
        "Suivre un train",
        "Cliquez sur une capsule puis sur Suivre. Le train reste sélectionné, son parcours est mis en valeur et sa fiche reste ouverte.",
      ],
      [
        "Expliquer le mouvement",
        "Les trains avancent sans saut. Ils ralentissent avant une gare ou un signal, peuvent s’arrêter, puis repartent progressivement.",
      ],
      [
        "Présenter les cantons",
        "Les couleurs montrent les portions libres, réservées, occupées ou en travaux. Un clic donne les PK, la vitesse et le dernier passage.",
      ],
      [
        "Présenter les signaux",
        "Les feux passent du vert au jaune puis au rouge selon l’occupation. Un clic explique l’état, la cause et le train concerné.",
      ],
      [
        "Montrer un croisement",
        "À Lopé, l’Express est prioritaire et le minéralier utilise la voie d’évitement. Les aiguillages et signaux organisent le passage.",
      ],
      [
        "Montrer les risques",
        "Le bouton Incidents ouvre les événements actifs. La limitation PK 316–321 indique la cause, la vitesse et l’impact attendu.",
      ],
      [
        "Changer le niveau de détail",
        "Réseau montre toute la ligne. Secteur montre les cantons. Gare agrandit quais, aiguillages et opérations locales.",
      ],
      [
        "Ouvrir la fiche du train",
        "Synthèse montre la progression. Trajet montre les arrêts. Composition montre voitures ou wagons. Équipe montre les agents. Alertes montre les actions utiles.",
      ],
      [
        "Expliquer les transmissions",
        "Le train reste visible même si son GPS est faible. La dernière position est conservée et marquée comme estimée.",
      ],
      [
        "Passer en plein écran",
        "Ce mode transforme la vue en écran de salle de contrôle et masque les éléments administratifs inutiles.",
      ],
      [
        "Terminer avec le tableau",
        "Le tableau confirme les mêmes informations que le réseau. Recherche, filtres, colonnes, export et menu d’actions restent disponibles.",
      ],
    ],
    "Voitures & places": [
      "Cette page montre les voitures et les sièges.",
      ["La composition", "Elle indique les voitures du train et leur classe."],
      [
        "Le plan des places",
        "Une place libre peut être vendue. Une place grise est déjà prise.",
      ],
      ["Les chiffres", "Ils montrent combien de places restent disponibles."],
    ],
    "Tarification & yield": [
      "Cette page sert à gérer les prix.",
      ["Les tarifs", "Ils montrent le prix par trajet et par classe."],
      ["La simulation", "Elle permet de tester un prix avant de le publier."],
      ["La publication", "Elle rend le nouveau tarif disponible à la vente."],
    ],
    Voyageurs: [
      "Cette page regroupe les informations utiles sur les voyageurs.",
      [
        "La recherche",
        "Entrez un nom ou une référence pour trouver une personne.",
      ],
      [
        "La fiche",
        "Elle montre les billets, trajets, bagages et besoins d’assistance.",
      ],
      ["La sécurité", "Chaque consultation sensible est enregistrée."],
    ],
    "Cartes RFID / NFC": [
      "Cette page sert à créer et gérer les cartes sans contact.",
      [
        "Les cartes",
        "Vous voyez le titulaire, le solde et la date de validité.",
      ],
      ["Créer une carte", "Ce bouton prépare une nouvelle carte."],
      [
        "Bloquer une carte",
        "Cette action empêche son utilisation en cas de perte.",
      ],
    ],
    Paiements: [
      "Cette page montre l’argent reçu et les paiements à vérifier.",
      [
        "Les moyens de paiement",
        "Espèces, carte bancaire, Airtel Money et Moov Money.",
      ],
      [
        "Le rapprochement",
        "Il vérifie que le montant reçu correspond à la vente.",
      ],
      ["Les écarts", "Ils signalent les paiements qui demandent un contrôle."],
    ],
    "Caisses & rapprochement": [
      "Cette page sert à ouvrir, compter et fermer les caisses.",
      ["La caisse", "Elle montre l’agent, la gare et le montant attendu."],
      [
        "Le comptage",
        "Il compare l’argent déclaré avec le montant du système.",
      ],
      ["La clôture", "Elle ferme la journée et crée le rapport de caisse."],
    ],
    "Contrôles & fraude": [
      "Cette page suit les contrôles de billets.",
      ["Les contrôles", "Ils indiquent combien de billets ont été lus."],
      [
        "Les anomalies",
        "Elles montrent les billets invalides ou déjà utilisés.",
      ],
      [
        "Les terminaux",
        "Ils indiquent quel appareil est utilisé par chaque contrôleur.",
      ],
    ],
    "Rapports & KPI": [
      "Cette page sert à créer des rapports.",
      ["Choisir un rapport", "Sélectionnez le sujet et la période."],
      ["Créer le fichier", "Le système prépare un PDF ou un fichier Excel."],
      [
        "Programmer",
        "Cette option crée le rapport automatiquement à la date choisie.",
      ],
    ],
    "Utilisateurs & rôles": [
      "Cette page gère les personnes autorisées à utiliser le système.",
      ["Les utilisateurs", "Vous voyez leur rôle, leur site et leur état."],
      ["Les droits", "Chaque rôle donne accès seulement aux fonctions utiles."],
      [
        "La sécurité",
        "Les comptes sensibles utilisent une protection renforcée.",
      ],
    ],
    "Journal d’audit": [
      "Cette page garde la preuve des actions importantes.",
      ["Qui ?", "Elle montre la personne qui a fait l’action."],
      ["Quoi ?", "Elle montre ce qui a été consulté ou changé."],
      ["Quand ?", "Elle donne la date, l’heure et le résultat."],
    ],
    Paramètres: [
      "Cette page règle le fonctionnement du système.",
      [
        "Les réglages",
        "Ils changent les règles de vente, de sécurité ou d’exploitation.",
      ],
      ["Les boutons", "Activez ou désactivez une option."],
      ["Enregistrer", "Ce bouton confirme les changements."],
    ],
    "Terminaux & batteries": [
      "Cette page surveille les appareils utilisés sur le terrain.",
      [
        "Les appareils",
        "Vous voyez leur agent, batterie et dernière connexion.",
      ],
      [
        "Les alertes",
        "Elles signalent une batterie faible ou un appareil hors ligne.",
      ],
      [
        "Synchroniser",
        "Cette action envoie les dernières opérations au système.",
      ],
    ],
    "Analytique opérationnelle locale": [
      "Cette page aide à prévoir l’activité.",
      ["Les prévisions", "Elles donnent une estimation des besoins à venir."],
      ["Les anomalies", "Elles signalent une situation inhabituelle."],
      ["La décision", "Un responsable vérifie toujours avant d’agir."],
    ],
  };
  let step = 0;
  function ensure() {
    let a = document.querySelector(".top-actions");
    if (!a || a.querySelector("#globalGuide")) return;
    let b = document.createElement("button");
    b.id = "globalGuide";
    b.className = "global-guide-btn";
    b.innerHTML = I("presentation") + "<span>Guide simple</span>";
    b.title = "Expliquer cette page avec des mots simples";
    a.insertBefore(b, a.firstChild);
    if (window.lucide) lucide.createIcons();
  }
  function get() {
    let name =
      document.querySelector("#crumb")?.textContent.trim() || "Vue d’ensemble";
    return {
      name,
      data: G[name] || [
        "Cette page vous aide à faire votre travail.",
        [
          "La partie principale",
          "Elle contient les informations les plus importantes.",
        ],
        ["Les boutons", "Cliquez dessus pour effectuer une action."],
      ],
    };
  }
  function draw() {
    let { name, data } = get(),
      items = data.slice(1),
      root = document.querySelector("#modalRoot");
    step = Math.min(step, items.length - 1);
    root.innerHTML = `<div class="guide-backdrop"><aside class="guide-panel simple"><header><div><span>PRÉSENTATION POUR LA DIRECTION · SETRAG</span><h2>${name}</h2><p>${data[0]}</p></div><button class="guide-close">×</button></header><div class="guide-mode"><span>${I("volume-2")} Discours guidé en français simple</span><b>Partie ${step + 1} sur ${items.length}</b></div><section class="guide-scroll"><article class="guide-purpose"><h3>Message principal</h3><p>${data[0]}</p></article><h3>Points à présenter</h3><div class="guide-blocks">${items.map((x, i) => `<article class="${i === step ? "current" : ""}"><i>${i + 1}</i><div><b>${x[0]}</b><p>${x[1]}</p></div></article>`).join("")}</div><article class="speaker-card"><span>${I("message-circle")}</span><div><b>Phrase à dire devant la direction</b><p>« ${items[step][0]}. ${items[step][1]} »</p></div></article><div class="guide-tip"><b>Conseil de présentation</b><span>Montrez une seule fonction à la fois. Cliquez sur l’élément concerné, laissez la direction lire le résultat, puis passez au point suivant.</span></div></section><footer><button class="guide-close">Fermer</button><div><button data-guide-nav="prev" ${step === 0 ? "disabled" : ""}>← Retour</button><button class="primary" data-guide-nav="next">${step === items.length - 1 ? "Terminer la présentation" : "Point suivant →"}</button></div></footer></aside></div>`;
    root
      .querySelectorAll(".guide-close")
      .forEach((x) => (x.onclick = () => (root.innerHTML = "")));
    if (window.lucide) lucide.createIcons();
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("#globalGuide")) {
      step = 0;
      draw();
      return;
    }
    let b = e.target.closest("[data-guide-nav]");
    if (!b) return;
    let max = get().data.length - 2;
    if (b.dataset.guideNav === "prev") step = Math.max(0, step - 1);
    else if (step < max) step++;
    else {
      document.querySelector("#modalRoot").innerHTML = "";
      toast("Guide terminé");
      return;
    }
    draw();
  });
  new MutationObserver(ensure).observe(document.body, {
    childList: true,
    subtree: true,
  });
  ensure();
})();
