// ********************************* Importation des ressources ********************************************
import "./styles/style.css"; // Styles
import { cardTemplate } from "./templates/card.js"; // Modèle de carte
import { recipes } from "./public/recipes.js"; // Liste des recettes
import { performSearch } from "./algorithmes/algorithme1.js"; // Fonction de recherche
import { setupSearch } from "./templates/searchbar.js"; // Barre de recherche
import { setupDropdownSearch } from "./templates/input-search.js"; // Recherche dans les dropdowns
import { initializeDropdowns } from "./templates/initialize-dropdowns.js"; // Initialisation des dropdowns
import { templateOptions } from "./templates/template-options.js"; // Modèle des options

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
  recipeCount.textContent = `${count} recettes`; // Affiche le nombre de recettes
}

// ********************************* Affichage des recettes dans le DOM *******************************************
export function displayResults(results) {
  const recipesSection = document.querySelector(".cards");
  recipesSection.innerHTML = ""; // Réinitialise les recettes

  results.forEach((recipe) => {
    cardTemplate(recipe);
  });
  updateRecipeCount(results.length);
}

// ********************************* Gestion des filtres et options sélectionnées ********************************************
initializeDropdowns(); // Initialise les dropdowns
displayResults(recipes); // Affiche les recettes

export function removeSelectedOption(type, selectedOption) {
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    const index = selectedOptions[type].indexOf(selectedOption);
    if (index > -1) {
      selectedOptions[type].splice(index, 1); // Supprime l'option
    }
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null; // Réinitialise l'option unique
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

    function onClose(selectedOption) {
      removeSelectedOption(type, selectedOption); // Retire l'option

      // Recherche et mise à jour des résultats
      const searchValue = input.value.trim().toLowerCase();
      const results = performSearch(searchValue, selectedOption);
      displayResults(results);
    }

    if (Array.isArray(options)) {
      options.forEach((option) => {
        templateOptions(type, option, onClose); // Affiche chaque option
      });
    } else if (options) {
      templateOptions(type, options, onClose); // Affiche l'option unique
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

// ********************************* Mise à jour des résultats et affichage des options sélectionnées ********************************************
function updateResultsAndDisplay() {
  const results = performSearch(searchValue, selectedOptions); // Recherche
  displayResults(results);
  renderSelectedOptionsTags(); // Met à jour les tags
}

function moveOptionToSelected(container, selectedText, type) {
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedText;
  selectedOptionElement.classList.add("selected-option-dropdown");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Icône de suppression
  selectedOptionElement.appendChild(closeIcon);
  container.appendChild(selectedOptionElement);

  // Suppression de l'option sélectionnée
  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedText);
    selectedOptionElement.remove(); // Supprime du DOM
    updateResultsAndDisplay(); // Mise à jour des résultats
  });
}

// ********************************* Gestion des interactions des dropdowns pour les différents types ********************************************
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

      // Ajout de l'option
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

      updateResultsAndDisplay(); // Mise à jour de l'affichage
    });
  });

  renderSelectedOptions(type); // Affiche les options sélectionnées
}

handleDropdown("appliance");
handleDropdown("ustensils");
handleDropdown("ingredients");

// ********************************* Configuration de la barre de recherche et des dropdowns ********************************************
setupDropdownSearch(
  ".dropdown-content.dropdown-search",
  ".selected-options-container"
); // Recherche dans les dropdowns
