// ********************************* Importation des ressources ********************************************
import "./styles/style.css"; // Importation des styles
import { cardTemplate } from "./templates/card.js"; // Modèle pour l'affichage des cartes recettes
import { recipes } from "./public/recipes.js"; // Liste des recettes
import { performSearch } from "./algorithmes/algorithme1.js"; // Algorithme de recherche
import { setupSearch } from "./templates/searchbar.js"; // Configuration de la barre de recherche
import { templateOptions } from "./templates/template-options.js"; // Template pour l'affichage des options sélectionnées
import { setupDropdownSearch } from "./templates/input-search.js"; // Configuration des recherches par dropdown/input
import {
  getAllAppliances,
  getAllUstensils,
  getAllIngredients,
} from "./templates/get-all-types.js"; // Récupération des types d'éléments

// ********************************* Initialisation des variables ********************************************
// Tableau pour stocker les options sélectionnées
const selectedOptions = {
  ingredients: [],
  ustensils: [],
  appliance: null,
};
let searchValue = ""; // Variable pour stocker la valeur de la recherche

// ********************************* Mise à jour du compteur de recettes *******************************************
// Fonction pour mettre à jour l'affichage du nombre de recettes disponibles
function updateRecipeCount(count) {
  const recipeCount = document.querySelector(".nbr-recettes");
  recipeCount.textContent = `${count} recettes`; // Affichage dynamique du nombre de recettes
}

// ********************************* Affichage des recettes dans le DOM *******************************************
// Fonction pour afficher les résultats de la recherche sous forme de cartes
export function displayResults(results) {
  const recipesSection = document.querySelector(".cards"); // Sélection de la section où afficher les recettes
  recipesSection.innerHTML = ""; // Réinitialisation des recettes actuelles

  // Parcourt chaque recette et appelle le template de carte
  results.forEach((recipe) => {
    cardTemplate(recipe);
  });
  updateRecipeCount(results.length); // Mise à jour du compteur de recettes
}

// ********************************* Récupération des listes uniques d'éléments *******************************************
// Récupération des appareils, ustensiles et ingrédients des recettes
getAllAppliances(recipes);
getAllUstensils(recipes);
getAllIngredients(recipes);

// ********************************* Gestion des options de dropdown ********************************************
// Fonction pour afficher les options dans un dropdown (menu déroulant)
export function renderDropdownOptions(container, options, type) {
  container.innerHTML = ""; // Réinitialise le contenu du dropdown
  options.forEach((option) => {
    const optionElement = document.createElement("p");
    optionElement.classList.add("dropdown-option");
    optionElement.textContent = option; // Ajoute l'option au dropdown
    container.appendChild(optionElement);
  });
}

// ********************************* Configuration de la barre de recherche principale ********************************************
// Initialisation de la barre de recherche
setupSearch();

// ********************************* Gestion des filtres et options sélectionnées ********************************************
// Fonction pour supprimer une option sélectionnée
export function removeSelectedOption(type, selectedOption) {
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    const index = selectedOptions[type].indexOf(selectedOption); // Recherche l'option
    if (index > -1) {
      selectedOptions[type].splice(index, 1); // Supprime l'option du tableau
    }
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null; // Réinitialise l'option
  } else {
    console.error("Type d'option inconnu : ", type);
  }
}

// ********************************* Affichage des options sélectionnées ********************************************
// Fonction pour gérer le rendu des tags des options sélectionnées
function renderSelectedOptionsTags() {
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  selectedOptionDisplay.innerHTML = ""; // Réinitialise l'affichage des options sélectionnées

  for (const type in selectedOptions) {
    const options = selectedOptions[type];
    if (Array.isArray(options)) {
      options.forEach((option) => {
        templateOptions(type, option); // Affiche chaque option sélectionnée
      });
    } else if (options) {
      templateOptions(type, options); // Affiche l'option unique
    }
  }
}

// ********************************* Gestion des interactions dans les dropdowns ********************************************
// Fonction pour déplacer une option sélectionnée dans le conteneur visuel
function moveOptionToSelected(container, selectedText, type) {
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedText; // Texte de l'option sélectionnée
  selectedOptionElement.classList.add("selected-option-dropdown");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Ajoute une icône pour la suppression
  selectedOptionElement.appendChild(closeIcon);
  container.appendChild(selectedOptionElement);

  // Ajout d'un événement pour retirer l'option
  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedText); // Supprime l'option sélectionnée
    selectedOptionElement.remove(); // Retire l'élément du DOM
    const results = performSearch(searchValue, selectedOptions); // Relance la recherche
    displayResults(results); // Actualise les résultats
    renderSelectedOptionsTags(); // Actualise les tags d'options
  });
}

// Fonction pour gérer l'affichage des options sélectionnées dans le dropdown
function renderSelectedDropdownOptions(container, type) {
  container.innerHTML = ""; // Réinitialise le conteneur
  const options = Array.isArray(selectedOptions[type])
    ? selectedOptions[type]
    : [selectedOptions[type]];
  options.forEach((option) => {
    moveOptionToSelected(container, option, type); // Affiche chaque option sélectionnée
  });
}

// ********************************* Gestion des interactions pour chaque dropdown ********************************************
// Gestion des ingrédients dans le dropdown
const dropdownOptionsIngredients = document.querySelectorAll(
  "#ingredients.dropdown .dropdown-option"
);
dropdownOptionsIngredients.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedText = option.textContent.trim(); // Récupère le texte sélectionné
    if (!selectedOptions.ingredients.includes(selectedText)) {
      selectedOptions.ingredients.push(selectedText); // Ajoute l'option sélectionnée
      const results = performSearch(searchValue, selectedOptions); // Relance la recherche
      displayResults(results); // Met à jour l'affichage des recettes
      renderSelectedOptionsTags(); // Actualise l'affichage des tags
      const selectedOptionsContainer = document.querySelector(
        "#ingredients.dropdown .selected-options-container"
      );
      renderSelectedDropdownOptions(selectedOptionsContainer, "ingredients");
    }
  });
});

// Gestion des appareils dans le dropdown
const dropdownOptionsAppliance = document.querySelectorAll(
  "#appliance.dropdown .dropdown-option"
);
dropdownOptionsAppliance.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedText = option.textContent.trim();
    if (
      !selectedOptions.appliance ||
      selectedOptions.appliance !== selectedText
    ) {
      selectedOptions.appliance = selectedText; // Sélectionne l'appareil
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results);
      renderSelectedOptionsTags();
      const selectedOptionsContainer = document.querySelector(
        "#appliance.dropdown .selected-options-container"
      );
      renderSelectedDropdownOptions(selectedOptionsContainer, "appliance");

      // Affiche uniquement l'option sélectionnée
      dropdownOptionsAppliance.forEach((option) => {
        option.style.display =
          option.textContent.trim() === selectedText ? "block" : "none";
      });
    }
  });
});

// Gestion des ustensiles dans le dropdown
const dropdownOptionsUstensils = document.querySelectorAll(
  "#ustensils.dropdown .dropdown-option"
);
dropdownOptionsUstensils.forEach((option) => {
  option.addEventListener("click", () => {
    selectedOptions.ustensils.push(option.textContent); // Ajoute l'option sélectionnée
    const results = performSearch(searchValue, selectedOptions); // Relance la recherche
    displayResults(results); // Met à jour les résultats
    renderSelectedOptionsTags();
    const selectedOptionsContainer = document.querySelector(
      "#ustensils.dropdown .selected-options-container"
    );
    renderSelectedDropdownOptions(selectedOptionsContainer, "ustensils");
  });
});

// ********************************* Configuration des recherches par input ********************************************
// Configuration de la recherche dans les dropdowns via l'input
setupDropdownSearch();
