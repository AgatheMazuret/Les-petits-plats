// ********************************* Importation des ressources ********************************************
import "./styles/style.css"; // Styles
import { cardTemplate } from "./templates/card.js"; // Modèle de carte
import { recipes } from "./public/recipes.js"; // Liste des recettes
import { performSearch } from "./algorithmes/algorithme1.js"; // Fonction de recherche
import { setupSearch } from "./templates/searchbar.js"; // Barre de recherche
import { setupDropdownSearch } from "./templates/input-search.js"; // Recherche dans les dropdowns
import { initializeDropdowns } from "./templates/initialize-dropdowns.js"; // Initialisation des dropdowns
import { moveOptionBelowSearch } from "./templates/template-options.js"; // Position des options dans le dropdown
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
function renderSelectedOptions() {
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
      displayResults(recipes);
    }

    if (Array.isArray(options)) {
      options.forEach((option) => {
        templateOptions(type, option, onClose); // Affiche chaque option
      });
    } else if (options) {
      templateOptions(type, options, onClose); // Affiche l'option unique
    }
  }

  setupSearch(".search", recipes, displayResults); // Barre de recherche
}
renderSelectedOptions("ingredients");
renderSelectedOptions("appliance");
renderSelectedOptions("ustensils");
// ********************************* Affichage et gestion des interactions du dropdown ********************************************
//  function renderSelectedOptions(type) {
//   const selectedOptionsContainer = document.querySelectorAll(
//     `div.dropdown.${type} .selected-options-display`
//   );

//   selectedOptionsContainer.forEach((container) => {
//     container.innerHTML = ""; // Réinitialise le conteneur
//     const options = selectedOptions[type];
//     const optionsArray = Array.isArray(options) ? options : [options];

//     optionsArray.forEach((option) => {
//       moveOptionToSelected(container, option, type);
//     });
//   });
// }
// renderSelectedOptions("ingredients");
// renderSelectedOptions("appliance");
// renderSelectedOptions("ustensils");

// ********************************* Mise à jour des résultats et affichage des options sélectionnées ********************************************
// function updateResultsAndDisplay() {
//   const results = performSearch(searchValue, selectedOptions); // Recherche
//   displayResults(results);
//   renderSelectedOptionsTags(); // Met à jour les tags
// }

// function moveOptionToSelected(container, selectedText, type) {
//   const selectedOptionElement = document.createElement("p");
//   selectedOptionElement.textContent = selectedText;
//   selectedOptionElement.classList.add("selected-option-dropdown");

//   const closeIcon = document.createElement("i");
//   closeIcon.classList.add("fa-solid", "fa-x"); // Icône de suppression
//   selectedOptionElement.appendChild(closeIcon);
//   container.appendChild(selectedOptionElement);

//   // Suppression de l'option sélectionnée
//   closeIcon.addEventListener("click", () => {
//     removeSelectedOption(type, selectedText);
//     selectedOptionElement.remove(); // Supprime du DOM
//     updateResultsAndDisplay(); // Mise à jour des résultats
//   });
// }

function templateOptions(type, selectedOption) {
  // Sélectionne le conteneur où afficher les options sélectionnées
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );

  // Vérifie si le conteneur existe
  if (!selectedOptionDisplay) {
    console.error("Le conteneur spécifié est introuvable.");
    return;
  }

  // Crée un élément paragraphe pour afficher l'option sélectionnée
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedOption; // Ajoute le texte de l'option
  selectedOptionElement.classList.add("selected-option-option"); // Ajoute une classe pour le style
  selectedOptionElement.setAttribute("data-type", type); // Ajoute un attribut pour identifier le type d'option
  selectedOptionDisplay.appendChild(selectedOptionElement); // Ajoute l'élément au conteneur

  // Crée une icône de fermeture pour retirer l'option
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Ajoute des classes pour l'icône
  selectedOptionElement.appendChild(closeIcon); // Ajoute l'icône à l'élément

  // Ajoute un événement de clic pour retirer l'option lorsqu'on clique sur l'icône de fermeture
  closeIcon.addEventListener("click", () => {
    selectedOptionElement.remove(); // Retire l'élément de l'affichage
    displayResults(recipes); // Affiche les résultats mis à jour
  });
}

// ********************************* Configuration de la barre de recherche et des dropdowns ********************************************
setupDropdownSearch(
  ".dropdown-content.dropdown-search",
  ".selected-options-container"
); // Recherche dans les dropdowns

// Fonction pour insérer un élément sélectionné après le champ de recherche dans le dropdown
function insertSelectedItemAfterSearch(
  selectedText,
  dropdownSearchSelector = ".dropdown-search", // Sélecteur par défaut pour le champ de recherche
  option,
  originalIndex
) {
  // Crée un élément div avec le texte sélectionné
  const selectedItem = document.createElement("div");
  selectedItem.textContent = selectedText;
  selectedItem.classList.add("option-search"); // Ajoute une classe pour le style

  // Crée l'icône de fermeture
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Ajoute des classes pour l'icône

  // Ajoute l'icône de fermeture à l'élément
  selectedItem.appendChild(closeIcon);
  // Ajouter un événement de clic pour supprimer l'élément
  closeIcon.addEventListener("click", () => {
    selectedItem.remove(); // Supprime l'élément de la liste des éléments sélectionnés
    displayResults(recipes); // Affiche les résultats mis à jour
  });

  // Insère l'élément sélectionné après le champ de recherche
  const inputDropdownSearch = document.querySelector(".dropdown-search");
  // Vérifie si l'élément existe, puis insère l'élément sélectionné juste après
  if (inputDropdownSearch) {
    inputDropdownSearch.insertAdjacentElement("afterend", selectedItem);
  } else {
    console.error(
      `L'élément ${dropdownSearchSelector} n'existe pas dans le DOM.`
    );
  }
}

//   // Réaffiche et replace l'option dans le dropdown à sa position d'origine
//   const dropdown = document.querySelector(".dropdown");
//   const dropdownOptions = document.querySelectorAll(".dropdown-option");
//   const input = document.querySelector(".search input");
//   //  Réinsère l'option à son index d'origine
//   if (dropdownOptions[originalIndex]) {
//     dropdownOptions[originalIndex].insertAdjacentElement(
//       "beforebegin",
//       option
//     );
//   } else {
//     dropdown.appendChild(option); // Si aucune option n'est trouvée, ajoute à la fin
//   }

//   option.style.display = "block"; // Remet l'option visible dans le dropdown

//   // Retirer l'option du tableau des options sélectionnées
//   const index = selectedOptions.ingredients.indexOf(selectedText);
//   if (index > -1) {
//     selectedOptions.ingredients.splice(index, 1); // Retire l'option du tableau
//   }

//   // Refaire la recherche et afficher les résultats
//   const searchValue = input.value.trim().toLowerCase();
//   const results = performSearch(searchValue, selectedOptions);
//   displayResults(results);
// });

//   // Vérifie si l'élément existe, puis insère l'élément sélectionné juste après
//   if (inputDropdownSearch) {
//     inputDropdownSearch.insertAdjacentElement("afterend", selectedItem);
//   } else {
//     console.error(
//       `L'élément ${dropdownSearchSelector} n'existe pas dans le DOM.`
//     );
//   }
// }

// function handleDropdownOptions(dropdownOptions, type) {
//   dropdownOptions.forEach((option, index) => {
//     option.addEventListener("click", () => {
//       const selectedText = option.textContent.trim(); // Récupère le texte de l'option sélectionnée

//       if (type === "ingredients") {
//         if (!selectedOptions.ingredients.includes(selectedText)) {
//           selectedOptions.ingredients.push(selectedText);

//           const dropdown = option.closest(".dropdown");
//           insertSelectedItemAfterSearch(selectedText, option, index, dropdown);

//           const searchValue = input.value.trim().toLowerCase();
//           const results = performSearch(searchValue, selectedOptions);
//           displayResults(results);

//           templateOptions("ingredients", selectedText);
//           moveOptionBelowSearch(option, dropdown);
//         }
//       } else if (type === "appliance") {
//         if (!selectedOptions.appliance.includes(selectedText)) {
//           selectedOptions.appliance.push(selectedText);

//           const dropdown = option.closest(".dropdown");
//           insertSelectedItemAfterSearch(selectedText, option, index, dropdown);

//           const searchValue = input.value.trim().toLowerCase();
//           const results = performSearch(searchValue, selectedOptions);
//           displayResults(results);

//           templateOptions("appliance", selectedText);
//           moveOptionBelowSearch(option, dropdown);
//         }
//       } else if (type === "ustensils") {
//         if (!selectedOptions.ustensils.includes(selectedText)) {
//           selectedOptions.ustensils.push(selectedText);

//           const dropdown = option.closest(".dropdown");
//           insertSelectedItemAfterSearch(selectedText, option, index, dropdown);

//           const searchValue = input.value.trim().toLowerCase();
//           const results = performSearch(searchValue, selectedOptions);
//           displayResults(results);

//           templateOptions("ustensils", selectedText);
//           moveOptionBelowSearch(option, dropdown);
//         }
//       }
//     });
//   });
// }

/**
 *
 * TODO: comparer avec la fonction du dessus et ne garder que le necessaire
 */

// Fonction générique pour ajouter un événement de clic à chaque option du menu déroulant
function handleDropdown(
  dropdownSelector,
  selectedOptionsKey,
  insertSelectedItemAfterSearch,
  performSearch,
  displayResults,
  templateOptions,
  moveOptionBelowSearch
) {
  const dropdownOptions = document.querySelectorAll(
    `${dropdownSelector} .dropdown-option`
  );

  dropdownOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      const selectedText = option.textContent.trim(); // Récupère le texte de l'option sélectionnée

      // Vérifie si l'option n'est pas déjà sélectionnée
      if (
        !selectedOptions[selectedOptionsKey] ||
        !selectedOptions[selectedOptionsKey].includes(selectedText)
      ) {
        // Ajoute l'option au tableau des options sélectionnées
        if (Array.isArray(selectedOptions[selectedOptionsKey])) {
          selectedOptions[selectedOptionsKey].push(selectedText);
        } else {
          selectedOptions[selectedOptionsKey] = selectedText; // Définit l'option comme sélectionnée
        }

        // Stocke l'index d'origine de l'option
        const originalIndex = Array.from(dropdownOptions).indexOf(option);

        // Insère l'élément sélectionné après le champ de recherche

        insertSelectedItemAfterSearch(
          selectedText,
          dropdownSelector,
          originalIndex
        );

        // Réexécute la recherche et met à jour les résultats
        const input = document.querySelector(".dropdown-search");
        const searchValue = input.value.trim().toLowerCase();
        const results = performSearch(searchValue, selectedOptions, input);
        displayResults(results);

        // Affiche l'option sélectionnée dans la zone dédiée
        templateOptions(selectedOptionsKey, selectedText);

        // Remonte l'option sélectionnée juste en dessous du champ de recherche et la masque (si applicable)
        const dropdown = document.querySelector(dropdownSelector);
        moveOptionBelowSearch(option, dropdown);
      }
    });
  });
}

handleDropdown(
  "#ingredients.dropdown",
  "ingredients",
  insertSelectedItemAfterSearch,
  performSearch,
  displayResults,
  templateOptions,
  moveOptionBelowSearch
);

handleDropdown(
  "#appliance.dropdown",
  "appliance",
  insertSelectedItemAfterSearch,
  performSearch,
  displayResults,
  templateOptions,
  moveOptionBelowSearch
);

handleDropdown(
  "#ustensils.dropdown",
  "ustensils",
  insertSelectedItemAfterSearch,
  performSearch,
  displayResults,
  templateOptions,
  moveOptionBelowSearch
);
