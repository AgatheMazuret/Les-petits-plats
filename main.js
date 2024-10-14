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
const selectedOptions = {
  ingredients: [],
  ustensils: [],
  appliance: null,
};
let searchValue = "";

// ********************************* Mise à jour du compteur de recettes *******************************************
function updateRecipeCount(count) {
  const recipeCount = document.querySelector(".nbr-recettes");
  recipeCount.textContent = `${count} recettes`; // Affichage dynamique du nombre de recettes
}

// ********************************* Affichage des recettes dans le DOM *******************************************
export function displayResults(results) {
  const recipesSection = document.querySelector(".cards");
  recipesSection.innerHTML = ""; // Réinitialise les recettes actuelles

  results.forEach((recipe) => {
    cardTemplate(recipe);
  });
  updateRecipeCount(results.length);
}

// ********************************* Gestion des filtres et options sélectionnées ********************************************
export function removeSelectedOption(type, selectedOption) {
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    const index = selectedOptions[type].indexOf(selectedOption);
    if (index > -1) {
      selectedOptions[type].splice(index, 1); // Supprime l'option
    }
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null; // Réinitialise l'option unique (appliance)
  }
}

// ********************************* Rendu des options sélectionnées sous forme de tags ********************************************
function renderSelectedOptionsTags() {
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  selectedOptionDisplay.innerHTML = ""; // Réinitialise l'affichage

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

// ********************************* Affichage et gestion des interactions du dropdown ********************************************
function renderSelectedOptions(type) {
  const selectedOptionsContainer = document.querySelectorAll(
    `div.dropdown.${type} .selected-options-display`
  );

  selectedOptionsContainer.forEach((container) => {
    container.innerHTML = ""; // Réinitialise le conteneur
    const options = selectedOptions[type];
    const optionsArray = Array.isArray(options) ? options : [options];

    optionsArray.forEach((option) => {
      moveOptionToSelected(container, option, type);
    });
  });
}

function moveOptionToSelected(container, selectedText, type) {
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedText;
  selectedOptionElement.classList.add("selected-option-dropdown");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Icône de suppression
  selectedOptionElement.appendChild(closeIcon);
  container.appendChild(selectedOptionElement);

  // Gère la suppression de l'option sélectionnée
  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedText);
    selectedOptionElement.remove(); // Supprime l'élément du DOM
    updateResultsAndDisplay(); // Mise à jour des résultats
  });
}

// Gestion des interactions des dropdowns pour les différents types
export function handleDropdown(type) {
  const selectedOptionsContainer = document.querySelectorAll(
    `div.dropdown.${type} .selected-options-display`
  );
  const dropdownOptions = document.querySelectorAll(
    `div.dropdown.${type} .options-container p`
  );

  dropdownOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedText = option.textContent.trim();

      // Ajout de l'option sélectionnée selon le type
      if (
        type === "ingredients" &&
        !selectedOptions.ingredients.includes(selectedText)
      ) {
        selectedOptions.ingredients.push(selectedText);
      } else if (type === "appliance") {
        selectedOptions.appliance = selectedText;
        dropdownOptions.forEach((opt) => {
          opt.style.display =
            opt.textContent.trim() === selectedText ? "block" : "none"; // Cache les autres options
        });
      } else if (
        type === "ustensils" &&
        !selectedOptions.ustensils.includes(selectedText)
      ) {
        selectedOptions.ustensils.push(selectedText);
      }

      updateResultsAndDisplay(); // Actualise l'affichage
    });
  });

  renderSelectedOptions(type); // Affichage initial des options sélectionnées
}

// Mise à jour des résultats et affichage des options sélectionnées
function updateResultsAndDisplay() {
  const results = performSearch(searchValue, selectedOptions); // Effectue la recherche
  displayResults(results);
  renderSelectedOptionsTags(); // Met à jour les tags des options sélectionnées
}

// Initialisation des dropdowns pour chaque type
handleDropdown("ingredients");
handleDropdown("appliance");
handleDropdown("ustensils");

// ********************************* Configuration de la barre de recherche et des dropdowns ********************************************
getAllAppliances(recipes); // Récupère tous les appareils
getAllUstensils(recipes); // Récupère tous les ustensiles
getAllIngredients(recipes); // Récupère tous les ingrédients
setupSearch(); // Barre de recherche principale
setupDropdownSearch(); // Recherche dans les dropdowns
displayResults(recipes); // Affichage initial des recettes
