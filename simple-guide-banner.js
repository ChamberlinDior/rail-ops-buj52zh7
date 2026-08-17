(function () {
  "use strict";
  const tips = {
    "Vue d�?Tensemble":
      "Regardez les chiffres puis cliquez sur une alerte pour voir le détail.",
    "Centre des opérations":
      "Sélectionnez un train pour suivre sa mission en direct.",
    "Ventes & prestations":
      "Cliquez sur « Nouvelle opération » pour créer une vente.",
    "Trains & circulations":
      "Cliquez sur un train pour afficher sa position et sa fiche.",
    "Voitures & places": "Choisissez une voiture puis cliquez sur une place.",
    "Tarification & yield":
      "Sélectionnez un tarif pour le vérifier ou le simuler.",
    Voyageurs: "Recherchez un voyageur pour afficher sa fiche.",
    "Cartes RFID / NFC": "Cliquez sur une carte pour vérifier son état.",
    Paiements: "Cliquez sur un écart pour retrouver le paiement concerné.",
    "Caisses & rapprochement":
      "Sélectionnez une caisse pour contrôler son solde.",
    "Contrôles & fraude":
      "Cliquez sur une anomalie pour voir le contrôle associé.",
    "Rapports & KPI": "Choisissez un rapport puis cliquez sur Générer.",
    "Utilisateurs & rôles": "Sélectionnez un utilisateur pour voir ses droits.",
    "Journal d�?Taudit": "Recherchez une action pour voir qui l�?Ta réalisée.",
    Paramètres: "Modifiez une option puis cliquez sur Enregistrer.",
    "Terminaux & batteries":
      "Cliquez sur un terminal pour voir son agent et sa batterie.",
    "Analytique opérationnelle locale":
      "Cliquez sur une prévision pour voir son explication.",
  };
  function add() {
    let root = document.querySelector("#content");
    if (!root || root.querySelector(":scope > .simple-guide-banner")) return;
    let name =
        document.querySelector("#crumb")?.textContent.trim() ||
        "Vue d�?Tensemble",
      text = tips[name] || "Cliquez sur un élément pour afficher ses détails.",
      banner = document.createElement("div");
    banner.className = "simple-guide-banner";
    banner.innerHTML = `<span>i</span><b>Guide rapide</b><p>${text}</p><button data-open-main-guide>Voir la présentation</button>`;
    root.insertBefore(banner, root.children[1] || root.firstChild);
    banner.querySelector("button").onclick = () =>
      document.querySelector("#globalGuide")?.click();
  }
  new MutationObserver(add).observe(document.body, {
    childList: true,
    subtree: true,
  });
  add();
})();
