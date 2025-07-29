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
searchInput.addEventListener("input", () => {
  filterOffers();
});

// Appliquer les filtres en direct quand une case est cochée/décochée
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("filter-location") || e.target.classList.contains("filter-type")) {
    filterOffers();
  }
});

// Bouton "Appliquer les filtres" = juste fermer la modale
filtersForm.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
});

// Réinitialiser
resetFilters.addEventListener("click", () => {
  document.querySelectorAll("#filtersModal input[type=checkbox]").forEach(cb => cb.checked = false);
  searchInput.value = "";
  offers.forEach(offer => offer.style.display = "block");
  updateCounters();
});

// Fonction de tri / filtrage
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

// Génération dynamique des filtres + compteurs au chargement
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.offer-card');

  // --- Génération Lieux ---
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

  // --- Génération Types ---
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

  updateCounters();
});

// Mise à jour des compteurs dynamique selon la logique décrite
function updateCounters() {
  const allOffers = Array.from(offers);

  const selectedLocations = Array.from(document.querySelectorAll(".filter-location:checked")).map(i => i.value);
  const selectedTypes = Array.from(document.querySelectorAll(".filter-type:checked")).map(i => i.value);

  const locationLabels = document.querySelectorAll('label[data-location]');
  const typeLabels = document.querySelectorAll('label[data-type]');

  // Cas 1 : aucun filtre → tous les compteurs
  if (selectedLocations.length === 0 && selectedTypes.length === 0) {
    locationLabels.forEach(label => {
      const lieu = label.getAttribute('data-location');
      const count = allOffers.filter(o => o.dataset.location === lieu).length;
      label.querySelector('.lieu-count').textContent = count;
    });

    typeLabels.forEach(label => {
      const type = label.getAttribute('data-type');
      const count = allOffers.filter(o => o.dataset.type === type).length;
      label.querySelector('.type-count').textContent = count;
    });
    return;
  }

  // Cas 2 : lieu sélectionné uniquement → update types
  if (selectedLocations.length > 0 && selectedTypes.length === 0) {
    typeLabels.forEach(label => {
      const type = label.getAttribute('data-type');
      const count = allOffers.filter(o =>
        selectedLocations.includes(o.dataset.location) &&
        o.dataset.type === type
      ).length;
      label.querySelector('.type-count').textContent = count;
    });

    locationLabels.forEach(label => {
      const lieu = label.getAttribute('data-location');
      const count = allOffers.filter(o => o.dataset.location === lieu).length;
      label.querySelector('.lieu-count').textContent = count;
    });
    return;
  }

  // Cas 3 : type sélectionné uniquement → update lieux
  if (selectedTypes.length > 0 && selectedLocations.length === 0) {
    locationLabels.forEach(label => {
      const lieu = label.getAttribute('data-location');
      const count = allOffers.filter(o =>
        selectedTypes.includes(o.dataset.type) &&
        o.dataset.location === lieu
      ).length;
      label.querySelector('.lieu-count').textContent = count;
    });

    typeLabels.forEach(label => {
      const type = label.getAttribute('data-type');
      const count = allOffers.filter(o => o.dataset.type === type).length;
      label.querySelector('.type-count').textContent = count;
    });
    return;
  }

  // Cas 4 : les deux filtres sont actifs → ne rien modifier
}
