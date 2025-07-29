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

// Appliquer les filtres via formulaire
filtersForm.addEventListener("submit", (e) => {
  e.preventDefault();
  filterOffers();
  closeModal();
});

// Réinitialiser
resetFilters.addEventListener("click", () => {
  document.querySelectorAll("#filtersModal input[type=checkbox]").forEach(cb => cb.checked = false);
  searchInput.value = "";
  offers.forEach(offer => offer.style.display = "block");
  updateCounters();
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

// Génération dynamique des filtres au chargement
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.offer-card');
  const lieuxSet = new Set();
  const typesSet = new Set();

  cards.forEach(card => {
    const lieu = card.dataset.location;
    const type = card.dataset.type;
    if (lieu) lieuxSet.add(lieu);
    if (type) typesSet.add(type);
  });

  // Filtres Lieux
  const lieuFilterGroup = document.querySelectorAll('.filter-group')[0];
  lieuFilterGroup.innerHTML = "<strong>Lieu</strong>";
  lieuxSet.forEach(lieu => {
    const label = document.createElement("label");
    label.setAttribute("data-location", lieu);
    label.innerHTML = `
      <input type="checkbox" value="${lieu}" class="filter-location" />
      ${lieu} <span class="lieu-count">0</span>
    `;
    lieuFilterGroup.appendChild(label);
  });

  // Filtres Types
  const typeFilterGroup = document.querySelectorAll('.filter-group')[1];
  typeFilterGroup.innerHTML = "<strong>Catégorie</strong>";
  typesSet.forEach(type => {
    const label = document.createElement("label");
    label.setAttribute("data-type", type);
    label.innerHTML = `
      <input type="checkbox" value="${type}" class="filter-type" />
      ${type} <span class="type-count">0</span>
    `;
    typeFilterGroup.appendChild(label);
  });

  updateCounters();
});

// Mise à jour des compteurs + griser / désactiver si aucun
function updateCounters() {
  const visibleOffers = Array.from(offers).filter(offer => offer.style.display !== "none");

  // Lieux
  const lieuLabels = document.querySelectorAll('label[data-location]');
  lieuLabels.forEach(label => {
    const lieu = label.getAttribute('data-location');
    const count = visibleOffers.filter(o => o.dataset.location === lieu).length;
    const span = label.querySelector('.lieu-count');
    if (span) span.textContent = count;

    const checkbox = label.querySelector('input');
    if (count === 0) {
      label.style.opacity = "0.5";
      checkbox.disabled = true;
    } else {
      label.style.opacity = "1";
      checkbox.disabled = false;
    }
  });

  // Types
  const typeLabels = document.querySelectorAll('label[data-type]');
  typeLabels.forEach(label => {
    const type = label.getAttribute('data-type');
    const count = visibleOffers.filter(o => o.dataset.type === type).length;
    const span = label.querySelector('.type-count');
    if (span) span.textContent = count;

    const checkbox = label.querySelector('input');
    if (count === 0) {
      label.style.opacity = "0.5";
      checkbox.disabled = true;
    } else {
      label.style.opacity = "1";
      checkbox.disabled = false;
    }
  });

  // Message si aucune offre
  let message = document.getElementById("noResultsMessage");
  if (!message) {
    message = document.createElement("p");
    message.id = "noResultsMessage";
    message.textContent = "Aucune offre ne correspond à vos critères.";
    message.style.textAlign = "center";
    message.style.marginTop = "2rem";
    message.style.display = "none";
    document.getElementById("offers").appendChild(message);
  }

  message.style.display = (visibleOffers.length === 0) ? "block" : "none";
}
