import "./styles/style.css";
import { createDropdown } from "./templates/dropdown.js";
import { cardTemplate } from "./templates/card.js";
import { recipes } from "./public/recipes.js";
import { performSearch } from "./algorithmes/algorithme1.js";

// Initialiser un tableau pour stocker les options sélectionnées
const selectedOptions = {
  ingredients: [],
  ustensils: [],
  appliance: null,
};

// ********************************* Nombre de recettes *******************************************

// Fonction pour mettre à jour l'affichage du nombre de recettes
function updateRecipeCount(count) {
  const recipeCount = document.querySelector(".nbr-recettes");
  recipeCount.textContent = `${count} recettes`;
}
// ********************************* Affichage des recettes dans le DOM  *******************************************
// fonction pour intégrer le résultat de la recherche dans le DOM
export function displayResults(results) {
  console.log(selectedOptions);
  // Sélectionne la section des recettes
  const recipesSection = document.querySelector(".cards");

  // Supprime toutes les recettes actuelles
  recipesSection.innerHTML = "";

  // Parcourt chaque recette dans les résultats
  results.forEach((recipe) => {
    // Crée une card pour chaque recette
    cardTemplate(recipe);
  });
  // Met à jour le nombre de recettes affichées
  updateRecipeCount(results.length);
}

// *********************************Listes sans doublons*******************************************
// Fonction pour récupérer tous les appareils sans doublons
export function getAllAppliances(recipes) {
  const appliancesSet = new Set();
  recipes.forEach((recipe) => {
    appliancesSet.add(recipe.appliance);
  });
  return Array.from(appliancesSet);
}

// Fonction pour récupérer tous les ustensiles sans doublons
export function getAllUstensils(recipes) {
  const ustensilsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil);
    });
  });
  return Array.from(ustensilsSet);
}

// Fonction pour récupérer tous les ingrédients sans doublons
export function getAllIngredients(recipes) {
  const ingredientsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredientObj) => {
      if (typeof ingredientObj === "object" && ingredientObj.ingredient) {
        ingredientsSet.add(ingredientObj.ingredient);
      } else {
        ingredientsSet.add(ingredientObj);
      }
    });
  });
  return Array.from(ingredientsSet);
}

// Appel des fonctions pour obtenir les listes
const allAppliances = getAllAppliances(recipes);
const allUstensils = getAllUstensils(recipes);
const allIngredients = getAllIngredients(recipes);

// ***************************************Dropdowns**************************************************
// stocker les options seléctionnées

// Mettre à jour l'affichage des recettes

// Créer les dropdowns
createDropdown("appliance", "Appareil", allAppliances);
createDropdown("ustensils", "Ustensiles", allUstensils);
createDropdown("ingredients", "Ingrédients", allIngredients);

// Créer les cards
displayResults(recipes);

// Ajouter l'événement de clic pour afficher/masquer le dropdown
const dropdowns = document.querySelectorAll(".dropdown-button");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    dropdown.nextElementSibling.classList.toggle("show");
  });
});

// ****************************************Barre de recherche****************************************************

//On récupère la valeur de l'input
// Sélectionne l'élément du champ de recherche dans le HTML
const input = document.querySelector(".search-input");

// Sélectionne le bouton de recherche dans le HTML
const btnSearch = document.querySelector(".search-btn");

// Ajoute un écouteur d'événements au bouton de recherche
// Lorsque le bouton est cliqué, la fonction performSearch est appelée
btnSearch.addEventListener("click", () => {
  // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
  const searchValue = input.value.trim().toLowerCase();

  const results = performSearch(searchValue, selectedOptions);
  displayResults(results);
});

// Ajoute un écouteur d'événements au champ de recherche
// Lorsque une touche est enfoncée dans le champ de recherche
input.addEventListener("keydown", (event) => {
  // Vérifie si la touche enfoncée est la touche "Entrée"
  if (event.key === "Enter") {
    // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
    const searchValue = input.value.trim().toLowerCase();

    // Si c'est le cas, appelle la fonction performSearch pour lancer la recherche
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
  }
});

// ******************************************Filtres*************************************************************

// ************************** Recherche par dropdown **************************

// Fonction pour retirer une option sélectionnée d'un type donné
function removeSelectedOption(type, selectedOption) {
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    const index = selectedOptions[type].indexOf(selectedOption);
    if (index > -1) {
      selectedOptions[type].splice(index, 1);
    }
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null;
  } else {
    console.error("Type d'option inconnu : ", type);
  }
}

// Fonction pour afficher les options sélectionnées
function templateOptions(
  type,
  selectedOption,
  containerSelector = ".selected-option-display"
) {
  const selectedOptionDisplay = document.querySelector(containerSelector);

  if (!selectedOptionDisplay) {
    console.error("Le conteneur spécifié est introuvable.");
    return;
  }

  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedOption;
  selectedOptionElement.classList.add("selected-option-option");
  selectedOptionElement.setAttribute("data-type", type);
  selectedOptionDisplay.appendChild(selectedOptionElement);

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  selectedOptionElement.appendChild(closeIcon);

  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedOption);
    selectedOptionElement.remove();

    const searchValue = input.value.trim().toLowerCase();
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
  });
}

// Fonction pour déplacer l'option sélectionnée juste en dessous de "dropdown-search"
function moveOptionBelowSearch(option, dropdown) {
  const dropdownSearch = dropdown.querySelector(".dropdown-search"); // Use querySelector instead of querySelectorAll
  if (dropdownSearch) {
    option.remove(); // Retirer l'option de sa position actuelle
    dropdownSearch.insertAdjacentElement("afterend", option); // Insérer l'option après l'élément "dropdown-search"
    option.style.display = "none"; // Masquer l'option une fois déplacée
  } else {
    console.error(
      'L\'élément ".dropdown-search" est introuvable dans le dropdown.'
    );
  }
}

// Sélectionner tous les éléments de dropdown pour les ingrédients
const dropdownOptionsIngredients = document.querySelectorAll(
  "#ingredients.dropdown .dropdown-option"
);

// Fonction pour insérer un élément sélectionné après le champ de recherche
function insertSelectedItemAfterSearch(
  selectedText,
  dropdownSearchSelector = ".dropdown-search",
  option,
  originalIndex
) {
  // Créer un élément div avec le texte sélectionné
  const selectedItem = document.createElement("div");
  selectedItem.textContent = selectedText;
  selectedItem.classList.add("option-search");

  // Créer l'icône de fermeture
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");

  // Ajouter l'icône de fermeture à l'élément
  selectedItem.appendChild(closeIcon);

  // Ajouter un événement de clic pour supprimer l'élément et réafficher l'option dans le dropdown
  closeIcon.addEventListener("click", () => {
    selectedItem.remove(); // Supprimer l'élément de la liste des éléments sélectionnés

    // Réafficher et replacer l'option dans le dropdown à sa position d'origine
    const dropdown = document.querySelector("#ingredients.dropdown");
    const dropdownOptions = dropdown.querySelectorAll(".dropdown-option");

    // Réinsérer l'option à son index d'origine
    if (dropdownOptions[originalIndex]) {
      dropdownOptions[originalIndex].insertAdjacentElement(
        "beforebegin",
        option
      );
    } else {
      dropdown.appendChild(option); // Si aucune option n'est trouvée, ajouter à la fin
    }

    option.style.display = "block"; // Remettre l'option visible dans le dropdown

    // Retirer l'option des `selectedOptions`
    const index = selectedOptions.ingredients.indexOf(selectedText);
    if (index > -1) {
      selectedOptions.ingredients.splice(index, 1); // Retirer l'option du tableau des options sélectionnées
    }

    // Refaire la recherche et afficher les résultats
    const searchValue = input.value.trim().toLowerCase();
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
  });

  // Rechercher l'élément dropdown-search correspondant
  const inputDropdownSearch = document.querySelector(dropdownSearchSelector);

  // Vérifier si l'élément existe, puis insérer l'élément sélectionné juste après
  if (inputDropdownSearch) {
    inputDropdownSearch.insertAdjacentElement("afterend", selectedItem);
  } else {
    console.error(
      `L'élément ${dropdownSearchSelector} n'existe pas dans le DOM.`
    );
  }
}

// Ajouter un événement de clic à chaque option du menu déroulant pour les ingrédients
dropdownOptionsIngredients.forEach((option, index) => {
  option.addEventListener("click", (event) => {
    const selectedText = option.textContent.trim();

    // Vérifier si l'option n'est pas déjà sélectionnée
    if (!selectedOptions.ingredients.includes(selectedText)) {
      selectedOptions.ingredients.push(selectedText);

      // Stocker l'index d'origine de l'option
      const originalIndex = Array.from(dropdownOptionsIngredients).indexOf(
        option
      );

      insertSelectedItemAfterSearch(
        selectedText,
        ".dropdown-search",
        option,
        originalIndex
      );

      const searchValue = input.value.trim().toLowerCase();
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results);

      templateOptions("ingredients", selectedText);

      // Remonter l'option sélectionnée juste en dessous du champ de recherche et la masquer
      const dropdown = document.querySelector("#ingredients.dropdown");
      moveOptionBelowSearch(option, dropdown);
    }
  });
});

// Sélectionner tous les éléments de dropdown pour les appareils
const dropdownOptionsAppliance = document.querySelectorAll(
  "#appliance.dropdown .dropdown-option"
);
// Ajouter un événement de clic à chaque option du menu déroulant pour les appareils
dropdownOptionsAppliance.forEach((option, index) => {
  option.addEventListener("click", (event) => {
    const selectedText = option.textContent.trim();

    // Vérifier si l'option n'est pas déjà sélectionnée
    if (
      !selectedOptions.appliance ||
      selectedOptions.appliance !== selectedText
    ) {
      selectedOptions.appliance = selectedText;

      // Stocker l'index d'origine de l'option
      const originalIndex = Array.from(dropdownOptionsAppliance).indexOf(
        option
      );

      insertSelectedItemAfterSearch(
        selectedText,
        "#appliance.dropdown",
        option,
        originalIndex
      );

      const searchValue = input.value.trim().toLowerCase();
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results);

      templateOptions("appliance", selectedText);

      // Filtrer les options pour afficher uniquement l'option sélectionnée
      filterDropdownOptions(selectedText);
    }
  });
});

function filterDropdownOptions(selectedText) {
  dropdownOptionsAppliance.forEach((option) => {
    if (option.textContent.trim() === selectedText) {
      option.style.display = "block"; // Afficher l'option sélectionnée
    } else {
      option.style.display = "none"; // Masquer les autres options
    }
  });
}

// Sélectionner tous les éléments de dropdown pour les ustensiles
const dropdownOptionsUstensils = document.querySelectorAll(
  "#ustensils.dropdown .dropdown-option"
);

// Ajouter un événement de clic à chaque option du menu déroulant pour les ustensiles
dropdownOptionsUstensils.forEach((option) => {
  option.addEventListener("click", (event) => {
    const searchValue = input.value.trim().toLowerCase();
    selectedOptions.ustensils.push(option.textContent);

    // Stocker l'index d'origine de l'option
    const originalIndex = Array.from(dropdownOptionsUstensils).indexOf(option);

    insertSelectedItemAfterSearch(
      option.textContent,
      "#ustensils.dropdown",
      option,
      originalIndex
    );

    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);

    templateOptions("ustensils", option.textContent);

    // Remonter l'option sélectionnée en haut du dropdown
    const dropdown = document.querySelector("#ustensils.dropdown");
    moveOptionBelowSearch(option, dropdown);
  });
});

// ************************** Recherche par input **************************

// Sélectionner toutes les entrées de recherche dans les dropdowns
const dropdownSearches = document.querySelectorAll(".dropdown-search");

// Ajouter un événement de saisie à chaque élément de recherche
dropdownSearches.forEach((dropdownSearch) => {
  dropdownSearch.addEventListener("input", (event) => {
    const searchValue = event.target.value.trim().toLowerCase();

    const dropdownOptions =
      dropdownSearch.parentElement.querySelectorAll(".dropdown-option");

    dropdownOptions.forEach((option) => {
      const optionText = option.textContent.toLowerCase();
      if (optionText.includes(searchValue)) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    });
  });
});
