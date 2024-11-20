/* ------------------------------------ Importation des ressources ------------------------------------ */
/* ---- Importation des styles ---- */
import "./styles/style.css"; /* Styles */

/* ---- Importation des modules ---- */
import { cardTemplate } from "./templates/card.js"; /* Modèle de carte */
import { recipes } from "./public/recipes.js"; /* Liste des recettes */
import { performSearch } from "./algorithmes/algorithme2.js"; /* Fonction de recherche */

/* ---- Importation des templates et utilitaires ---- */
import { setupSearch } from "./templates/searchbar.js"; /* Barre de recherche */
import { setupDropdownSearch } from "./templates/input-search.js"; /* Recherche dans les dropdowns */
import { initializeDropdowns } from "./templates/initialize-dropdowns.js"; /* Initialisation des dropdowns */
import { moveOptionBelowSearch } from "./templates/template-options.js"; /* Position des options dans le dropdown */
import {
  displayResults,
  updateRecipeCount,
} from "./templates/displayResults.js"; /* Affichage des résultats */

/* ********************************* Initialisation des variables ******************************************** */
/* ---- Structure des options sélectionnées ---- */
const selectedOptions = {
  ingredients: [] /* Liste des ingrédients sélectionnés */,
  ustensils: [] /* Liste des ustensiles sélectionnés */,
  appliance: null /* Appareil sélectionné (unique) */,
};

/* ---- Valeurs de recherche ---- */
let searchValue = ""; /* Valeur de recherche actuelle */

/* ********************************* Initialisation de l'application ******************************************** */
/* ---- Mise à jour du compteur de recettes ---- */
updateRecipeCount(); /* Met à jour le nombre de recettes affichées */

/* ---- Initialisation de l'affichage ---- */
initializeDropdowns(); /* Initialise les dropdowns */
displayResults(recipes); /* Affiche toutes les recettes initialement */

/* ********************************* Gestion des options sélectionnées ******************************************** */

/* ----- Synchronisation des suppressions d'options sélectionnées ----- */
function synchroRemove(type, selectedOption) {
  /* ------ Suppression de l'option sous le dropdown lorsqu'une option est supprimée ------ */
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  const selectedOptionElement = selectedOptionDisplay.querySelector(
    `[data-type="${type}"]`
  );

  if (selectedOptionElement) {
    selectedOptionElement.remove(); /* Retire l'élément visuellement */
  }

  /* ------ Suppression de l'option dans le dropdown correspondant ------ */
  const optionSearch = document.querySelector(".option-search");
  if (optionSearch) {
    optionSearch.remove(); /* Retire l'option du dropdown */
  }
}

/* ---- Suppression d'une option sélectionnée ---- */
export function removeSelectedOption(type, selectedOption) {
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    const index = selectedOptions[type].indexOf(selectedOption);
    if (index > -1) {
      selectedOptions[type].splice(
        index,
        1
      ); /* Supprime l'option de la liste */
    }
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null; /* Réinitialise l'option unique */
  }
  synchroRemove(type, selectedOption); /* Met à jour l'affichage */
}

/* ---- Rendu des options sélectionnées ---- */
function renderSelectedOptions() {
  /* ---- Sélection du conteneur d'affichage des options ---- */
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  selectedOptionDisplay.innerHTML = ""; /* Vide le conteneur */

  /* ---- Affichage des options sélectionnées par type (ingrédients, ustensiles, appareil) ---- */
  for (const type in selectedOptions) {
    const options = selectedOptions[type];

    function onClose(selectedOption) {
      removeSelectedOption(
        type,
        selectedOption
      ); /* Retire l'option sélectionnée */
      const searchValue = input.value
        .trim()
        .toLowerCase(); /* Met à jour la recherche */
      displayResults(recipes); /* Rafraîchit l'affichage des résultats */
    }

    if (Array.isArray(options)) {
      options.forEach((option) => {
        templateOptions(
          type,
          option,
          onClose
        ); /* Affiche chaque option pour les listes */
      });
    } else if (options) {
      templateOptions(
        type,
        options,
        onClose
      ); /* Affiche l'option unique (pour appareil) */
    }
  }

  /* ---- Activation de la barre de recherche ---- */
  setupSearch(".search", recipes, displayResults);
}

/* Rendu initial des options sélectionnées */
renderSelectedOptions("ingredients");
renderSelectedOptions("appliance");
renderSelectedOptions("ustensils");

/* ---- Template pour afficher une option sélectionnée ---- */
function templateOptions(type, selectedOption) {
  /* ---- Vérification et création des éléments ---- */
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

  /* ---- Création de l'icône de fermeture pour supprimer l'option ---- */
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  selectedOptionElement.appendChild(closeIcon);

  /* Gestion de la suppression de l'option sélectionnée */
  closeIcon.addEventListener("click", () => {
    selectedOptionElement.remove(); /* Retire l'élément visuellement */
    removeSelectedOption(
      type,
      selectedOption
    ); /* Retire l'option de la liste */
    displayResults(recipes); /* Met à jour l'affichage des résultats */
  });
}

/* ********************************* Gestion des dropdowns ******************************************** */
/* ---- Recherche dans les dropdowns ---- */
setupDropdownSearch(
  ".dropdown-content.dropdown-search",
  ".selected-options-container"
);

/* ---- Ajout d'une option sélectionnée dans un dropdown ---- */
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

  // Empêche les doublons dans le dropdown
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
    removeSelectedOption(type, selectedText); /* Retire l'option de la liste */
    selectedItem.remove(); /* Retire l'élément visuellement */
  });

  inputDropdownSearch.insertAdjacentElement("afterend", selectedItem);

  // Effectue la recherche avec la valeur actuelle
  const searchValue = inputDropdownSearch.value.trim().toLowerCase();
  const results = performSearch(
    searchValue,
    selectedOptions
  ); /* Met à jour les résultats filtrés */
  displayResults(results); /* Affiche les nouveaux résultats */
}

/* ---- Gestion des événements sur les options de dropdown ---- */
function handleDropdown(dropdownSelector, selectedOptionsKey) {
  const dropdown = document.querySelector(dropdownSelector);

  if (!dropdown) {
    console.error(`Dropdown "${dropdownSelector}" not found.`);
    return;
  }

  const dropdownOptions = dropdown.querySelectorAll(".dropdown-option");

  dropdownOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      const selectedText = option.textContent.trim();

      /* Vérifie si l'option est déjà sélectionnée */
      if (
        (Array.isArray(selectedOptions[selectedOptionsKey]) &&
          !selectedOptions[selectedOptionsKey].includes(selectedText)) ||
        selectedOptions[selectedOptionsKey] !== selectedText
      ) {
        if (Array.isArray(selectedOptions[selectedOptionsKey])) {
          selectedOptions[selectedOptionsKey].push(
            selectedText
          ); /* Ajoute à la liste */
        } else {
          selectedOptions[selectedOptionsKey] =
            selectedText; /* Assigne l'option unique */
        }

        insertSelectedItemAfterSearch(
          selectedText,
          dropdownSelector,
          selectedOptionsKey
        ); /* Ajoute l'option au dropdown */
        const input = dropdown.querySelector(".dropdown-search");
        const searchValue = input ? input.value.trim().toLowerCase() : "";

        const results = performSearch(
          searchValue,
          selectedOptions
        ); /* Met à jour les résultats filtrés */
        templateOptions(
          selectedOptionsKey,
          selectedText
        ); /* Ajoute le modèle d'option */
        moveOptionBelowSearch(
          option,
          document.querySelectorAll(dropdownSelector)
        ); /* Déplace l'option sous la barre de recherche */
        displayResults(results); /* Affiche les résultats mis à jour */
      }
    });
  });
}

/* ---- Gestion des dropdowns spécifiques ---- */
handleDropdown("#ingredients.dropdown", "ingredients");
handleDropdown("#appliance.dropdown", "appliance");
handleDropdown("#ustensils.dropdown", "ustensils");
