const searchInput = document.getElementById("search");
const offers = document.querySelectorAll(".offer-card");
const filtersModal = document.getElementById("filtersModal");
const overlay = document.getElementById("overlay");
const openFilters = document.getElementById("openFilters");
const closeFilters = document.getElementById("closeFilters");
const resetFilters = document.getElementById("resetFilters");
const backToTop = document.getElementById("backToTop");
const filtersForm = document.getElementById("filtersForm");

// Affichage de la modale
openFilters.addEventListener("click", () => {
  filtersModal.style.display = "block";
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
});

// Fermer la modale
function closeModal() {
  filtersModal.style.display = "none";
  overlay.style.display = "none";
  document.body.style.overflow = "";
}

closeFilters.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Recherche live
searchInput.addEventListener("input", filterOffers);

// Appliquer les filtres (ne sert qu'à fermer)
filtersForm.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
});

// Réinitialiser
resetFilters.addEventListener("click", () => {
  document.querySelectorAll("#filtersModal input[type=checkbox]").forEach(cb => cb.checked = false);
  searchInput.value = "";
  offers.forEach(offer => offer.style.display = "block");
  updateCounters(); // remettre les bons compteurs
});

// Fonction de tri
function filterOffers() {
  const searchText = searchInput.value.toLowerCase();
  const selectedLocations = Array.from(document.querySelectorAll(".filter-location:checked")).map(i => i.value);
  const selectedTypes = Array.from(document.querySelectorAll(".filter-type:checked")).map(i => i.value);

  offers.forEach(offer => {
    const title = offer.querySelector("h3").textContent.toLowerCase();
    const location = offer.dataset.location;
    const type = offer.dataset.type;

    const matchesSearch = title.includes(searchText);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(location);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);

    if (matchesSearch && matchesLocation && matchesType) {
      offer.style.display = "block";
    } else {
      offer.style.display = "none";
    }
  });

  updateCounters();
}

// Scroll top
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Génération dynamique des filtres + compteurs fixes pour lieux
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.offer-card');

  // --- Génération Lieux (compteurs fixes) ---
  const lieuxMap = new Map();
  cards.forEach(card => {
    const lieu = card.dataset.location;
    if (lieu) {
      lieuxMap.set(lieu, (lieuxMap.get(lieu) || 0) + 1);
    }
  });

  const lieuFilterGroup = document.querySelectorAll('.filter-group')[0];
  lieuFilterGroup.innerHTML = "<strong>Lieu</strong>";

  [...lieuxMap.entries()].sort().forEach(([lieu, count]) => {
    const label = document.createElement("label");
    label.setAttribute('data-location', lieu);
    label.innerHTML = `
      <input type="checkbox" value="${lieu}" class="filter-location" />
      ${lieu} (<span class="lieu-count">${count}</span>)
    `;
    lieuFilterGroup.appendChild(label);
  });

  // --- Génération Types (compteurs dynamiques) ---
  const typesMap = new Map();
  cards.forEach(card => {
    const type = card.dataset.type;
    if (type) {
      typesMap.set(type, (typesMap.get(type) || 0) + 1);
    }
  });

  const typeFilterGroup = document.querySelectorAll('.filter-group')[1];
  typeFilterGroup.innerHTML = "<strong>Catégorie</strong>";

  [...typesMap.entries()].sort().forEach(([type, count]) => {
    const label = document.createElement("label");
    label.setAttribute('data-type', type);
    label.innerHTML = `
      <input type="checkbox" value="${type}" class="filter-type" />
      ${type} (<span class="type-count">${count}</span>)
    `;
    typeFilterGroup.appendChild(label);
  });

  // Ajouter écouteurs pour appliquer les filtres en live
  document.querySelectorAll(".filter-location, .filter-type").forEach(cb => {
    cb.addEventListener("change", filterOffers);
  });

  updateCounters();
});

// Mise à jour des compteurs dynamiques (types uniquement)
function updateCounters() {
  const visibleOffers = Array.from(offers).filter(offer => offer.style.display !== "none");

  // Compteurs types dynamiques
  const typeLabels = document.querySelectorAll('label[data-type]');
  typeLabels.forEach(label => {
    const type = label.getAttribute('data-type');
    const count = visibleOffers.filter(o => o.dataset.type === type).length;
    const span = label.querySelector('.type-count');
    if (span) span.textContent = count;
  });

  // PAS de mise à jour des lieux (compteurs restent fixes)
}
