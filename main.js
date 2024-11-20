// ********************************* Importation des ressources ********************************************
// ---- Import des styles ----
import "./styles/style.css"; // Styles

// ---- Import des modules ----
import { cardTemplate } from "./templates/card.js"; // Modèle de carte
import { recipes } from "./public/recipes.js"; // Liste des recettes
import { performSearch } from "./algorithmes/algorithme1.js"; // Fonction de recherche

// ---- Import des templates et utilitaires ----
import { setupSearch } from "./templates/searchbar.js"; // Barre de recherche
import { setupDropdownSearch } from "./templates/input-search.js"; // Recherche dans les dropdowns
import { initializeDropdowns } from "./templates/initialize-dropdowns.js"; // Initialisation des dropdowns
import { moveOptionBelowSearch } from "./templates/template-options.js"; // Position des options dans le dropdown
import {
  displayResults,
  updateRecipeCount,
} from "./templates/displayResults.js"; // Affichage des résultats

// ********************************* Initialisation des variables ********************************************
// ---- Structure des options sélectionnées ----
const selectedOptions = {
  ingredients: [],
  ustensils: [],
  appliance: null,
};

// ---- Valeurs de recherche ----
let searchValue = "";

// ********************************* Initialisation de l'application ********************************************
// ---- Mise à jour du compteur de recettes ----
updateRecipeCount();

// ---- Initialisation de l'affichage ----
initializeDropdowns(); // Initialise les dropdowns
displayResults(recipes); // Affiche les recettes

// ********************************* Gestion des options sélectionnées ********************************************

/* ----- Syncroniser les suppressions d'options sélectionnées ----- */
function synchroRemove(type, selectedOption) {
  /* ------Suppression de l'option sous le dropdwon quand on supprime une option dans le dropdown------ */
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  const selectedOptionElement = selectedOptionDisplay.querySelector(
    `[data-type="${type}"]`
  );

  if (selectedOptionElement) {
    selectedOptionElement.remove();
  }
  /* ------Suppression de l'option dans le dropdwon quand on supprime une option sous le dropdown------ */
  const optionSearch = document.querySelector(".option-search");
  if (optionSearch) {
    optionSearch.remove();
  }
}
// ---- Suppression d'une option sélectionnée ----
export function removeSelectedOption(type, selectedOption) {
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    const index = selectedOptions[type].indexOf(selectedOption);
    if (index > -1) {
      selectedOptions[type].splice(index, 1); // Supprime l'option
    }
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null; // Réinitialise l'option unique
  }
  synchroRemove(type, selectedOption);
}

// ---- Rendu des options sélectionnées ----
function renderSelectedOptions() {
  // ---- Sélection du conteneur d'affichage ----
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  selectedOptionDisplay.innerHTML = ""; // Réinitialise l'affichage

  // ---- Affichage des options par type ----
  for (const type in selectedOptions) {
    const options = selectedOptions[type];

    function onClose(selectedOption) {
      removeSelectedOption(type, selectedOption); // Retire l'option
      const searchValue = input.value.trim().toLowerCase(); // Met à jour la recherche
      displayResults(recipes); // Rafraîchit l'affichage
    }

    if (Array.isArray(options)) {
      options.forEach((option) => {
        templateOptions(type, option, onClose); // Affiche chaque option
      });
    } else if (options) {
      templateOptions(type, options, onClose); // Affiche l'option unique
    }
  }

  // ---- Activation de la barre de recherche ----
  setupSearch(".search", recipes, displayResults);
}

renderSelectedOptions("ingredients");
renderSelectedOptions("appliance");
renderSelectedOptions("ustensils");

// ---- Template pour une option sélectionnée ----
function templateOptions(type, selectedOption) {
  // ---- Vérification et création des éléments ----
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );

  if (!selectedOptionDisplay) {
    console.error("Le conteneur spécifié est introuvable.");
    return;
  }

  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedOption;
  selectedOptionElement.classList.add("selected-option-option");
  selectedOptionElement.setAttribute("data-type", type);
  selectedOptionDisplay.appendChild(selectedOptionElement);

  // ---- Création de l'icône de fermeture ----
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  selectedOptionElement.appendChild(closeIcon);

  // ---- Gestion de la suppression ----
  closeIcon.addEventListener("click", () => {
    selectedOptionElement.remove();
    removeSelectedOption(type, selectedOption);
    displayResults(recipes); // Affiche les résultats mis à jour
  });
}

// ********************************* Gestion des dropdowns ********************************************
// ---- Recherche dans les dropdowns ----
setupDropdownSearch(
  ".dropdown-content.dropdown-search",
  ".selected-options-container"
);

// ---- Ajout d'une option sélectionnée dans un dropdown ----
function insertSelectedItemAfterSearch(selectedText, dropdownContainer, type) {
  const container = document.querySelector(dropdownContainer);
  if (!container) {
    console.error(
      `Le conteneur ${dropdownContainer} n'existe pas dans le DOM.`
    );
    return;
  }

  const inputDropdownSearch = container.querySelector(".dropdown-search");
  if (!inputDropdownSearch) {
    console.error(
      `Aucun champ .dropdown-search trouvé dans ${dropdownContainer}.`
    );
    return;
  }

  // Empêche l'ajout de doublons dans ce conteneur
  const existingItem = Array.from(
    container.querySelectorAll(".option-search")
  ).find((item) => item.textContent.includes(selectedText));
  if (existingItem) {
    console.warn("Cet élément est déjà sélectionné dans ce dropdown.");
    return;
  }

  const selectedItem = document.createElement("div");
  selectedItem.textContent = selectedText;
  selectedItem.classList.add("option-search");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  selectedItem.appendChild(closeIcon);

  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedText); // Retire l'option
    selectedItem.remove(); // Supprime l'élément sélectionné
  });

  inputDropdownSearch.insertAdjacentElement("afterend", selectedItem);

  // --- Ajout du performSearch pour mettre à jour les résultats
  const searchValue = inputDropdownSearch.value.trim().toLowerCase();
  const results = performSearch(searchValue, selectedOptions); // Met à jour les résultats filtrés
  displayResults(results); // Affiche les nouveaux résultats
}

// ---- Gestion des événements sur les options de dropdown ----

function handleDropdown(
  dropdownSelector, // Sélecteur pour cibler le menu déroulant
  selectedOptionsKey // Clé pour stocker les options sélectionnées
) {
  // Sélectionne le menu déroulant dans le DOM en utilisant le sélecteur fourni
  const dropdown = document.querySelector(dropdownSelector);

  // Si le menu déroulant n'est pas trouvé, afficher une erreur dans la console et arrêter l'exécution
  if (!dropdown) {
    console.error(`Dropdown "${dropdownSelector}" not found.`);
    return;
  }

  // Récupère toutes les options disponibles dans le menu déroulant
  const dropdownOptions = dropdown.querySelectorAll(".dropdown-option");

  // Ajoute un gestionnaire d'événements "click" à chaque option du menu déroulant
  dropdownOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      // Récupère le texte de l'option sélectionnée, en supprimant les espaces inutiles
      const selectedText = option.textContent.trim();

      // Vérifie si l'option n'est pas déjà sélectionnée
      if (
        (Array.isArray(selectedOptions[selectedOptionsKey]) &&
          !selectedOptions[selectedOptionsKey].includes(selectedText)) || // Si l'option n'est pas déjà dans la liste
        selectedOptions[selectedOptionsKey] !== selectedText // Si l'option n'est pas déjà sélectionnée
      ) {
        // Ajoute l'option sélectionnée au tableau correspondant
        if (Array.isArray(selectedOptions[selectedOptionsKey])) {
          selectedOptions[selectedOptionsKey].push(selectedText);
        } else {
          selectedOptions[selectedOptionsKey] = selectedText;
        }

        // Appelle une fonction pour insérer l'option sélectionnée dans une zone spécifique (après la recherche)
        insertSelectedItemAfterSearch(
          selectedText,
          dropdownSelector,
          selectedOptionsKey
        );

        // Récupère la valeur du champ de recherche dans le menu déroulant, si disponible
        const input = dropdown.querySelector(".dropdown-search");
        const searchValue = input ? input.value.trim().toLowerCase() : "";

        // Effectue une recherche avec la valeur actuelle du champ de recherche
        const results = performSearch(searchValue, selectedOptions, input);

        // Met à jour les options du modèle avec la clé et le texte sélectionné
        templateOptions(selectedOptionsKey, selectedText);

        // Re-sélectionne tous les menus déroulants correspondant au sélecteur
        const dropdowns = document.querySelectorAll(dropdownSelector);

        // Déplace l'option sélectionnée sous le champ de recherche (si nécessaire)
        moveOptionBelowSearch(option, dropdowns);

        // Affiche les résultats mis à jour après la recherche
        displayResults(results);
      }
    });
  });
}

// ---- Gestion des dropdowns spécifiques ----
handleDropdown("#ingredients.dropdown", "ingredients");

handleDropdown("#appliance.dropdown", "appliance");

handleDropdown("#ustensils.dropdown", "ustensils");
