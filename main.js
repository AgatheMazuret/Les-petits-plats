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
let searchValue = "";

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
function renderDropdownOptions(container, options) {
  container.innerHTML = "";
  options.forEach((option) => {
    const optionElement = document.createElement("p");
    optionElement.classList.add("dropdown-option");
    optionElement.textContent = option;
    container.appendChild(optionElement);
  });
}

// Créer les dropdowns
createDropdown("appliance", "Appareil", allAppliances);
renderDropdownOptions(
  document.querySelector("#appliance.dropdown .options-container"),
  allAppliances
);
createDropdown("ustensils", "Ustensiles", allUstensils);
renderDropdownOptions(
  document.querySelector("#ustensils.dropdown .options-container"),
  allUstensils
);

createDropdown("ingredients", "Ingrédients", allIngredients);
renderDropdownOptions(
  document.querySelector("#ingredients.dropdown .options-container"),
  allIngredients
);

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
const searchForm = document.querySelector("form.search");
const searchInput = document.querySelector("form.search input");

// Ajoute un écouteur d'événements au champ de recherche
// Lorsque une touche est enfoncée dans le champ de recherche
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
  const value = formData.get("search").trim().toLowerCase();

  if (value.length <= 3) {
    searchValue = "";
  } else {
    searchValue = value;
  }
  // Si c'est le cas, appelle la fonction performSearch pour lancer la recherche
  const results = performSearch(searchValue, selectedOptions);
  displayResults(results);
});

// Ajoute un écouteur d'événements au champ de recherche
// Lorsque une touche est enfoncée dans le champ de recherche
searchInput.addEventListener("input", (event) => {
  // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
  const value = event.target.value.trim().toLowerCase();

  if (value.length <= 3) {
    searchValue = "";
  } else {
    searchValue = value;
  }
  // Si c'est le cas, appelle la fonction performSearch pour lancer la recherche
  const results = performSearch(searchValue, selectedOptions);
  displayResults(results);
});

// ******************************************Filtres*************************************************************

// ************************************ Recherche par dropdown ***************************************

// ********************* Création et suppression des options *********************

// Fonction pour retirer une option sélectionnée du tableau des options sélectionnées
function removeSelectedOption(type, selectedOption) {
  // Vérifie si le type d'option existe et est un tableau
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    // Trouve l'index de l'option sélectionnée dans le tableau
    const index = selectedOptions[type].indexOf(selectedOption);
    // Si l'option est trouvée, la supprime du tableau
    if (index > -1) {
      selectedOptions[type].splice(index, 1);
    }
    // Si le type est une valeur unique (pas un tableau)
  } else if (selectedOptions[type]) {
    selectedOptions[type] = null; // Réinitialise l'option sélectionnée
  } else {
    console.error("Type d'option inconnu : ", type); // Affiche une erreur si le type est inconnu
  }
}

// Fonction pour afficher les options sélectionnées dans un conteneur spécifique
function templateOptions(
  type,
  selectedOption,
  containerSelector = ".selected-option-display" // Sélecteur par défaut pour le conteneur d'affichage
) {
  // Sélectionne le conteneur où afficher les options sélectionnées
  const selectedOptionDisplay = document.querySelector(containerSelector);

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
    removeSelectedOption(type, selectedOption); // Retire l'option du tableau des options sélectionnées
    selectedOptionElement.remove(); // Retire l'élément de l'affichage

    // Réexécute la recherche et met à jour les résultats
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
  });
}

function renderSelectedOptionsTags() {
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );
  selectedOptionDisplay.innerHTML = "";

  for (const type in selectedOptions) {
    const options = selectedOptions[type];
    if (Array.isArray(options)) {
      options.forEach((option) => {
        templateOptions(type, option);
      });
    } else if (options) {
      templateOptions(type, options);
    }
  }
}

// Fonction pour déplacer l'option sélectionnée dans le conteneur
function moveOptionToSelected(container, selectedText, type) {
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedText; // Ajoute le texte sélectionné
  selectedOptionElement.classList.add("selected-option-dropdown");

  // Crée une icône de fermeture pour retirer l'option
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Ajoute des classes pour l'icône
  selectedOptionElement.appendChild(closeIcon); // Ajoute l'icône à l'élément

  // Ajoute l'élément au conteneur
  container.appendChild(selectedOptionElement);

  // Ajoute un événement de clic pour retirer l'option lorsqu'on clique sur l'icône de fermeture
  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedText); // Retire l'option du tableau des options sélectionnées
    selectedOptionElement.remove(); // Retire l'élément de l'affichage

    // Réexécute la recherche et met à jour les résultats
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
    renderSelectedOptionsTags();
  });
}

// Fonction pour gérer le rendu des options sélectionnées
function renderSelectedDropdownOptions(container, type) {
  container.innerHTML = ""; // Supprime le contenu existant
  const options = Array.isArray(selectedOptions[type])
    ? selectedOptions[type]
    : [selectedOptions[type]]; // Vérifie si le type est un tableau

  options.forEach((option) => {
    moveOptionToSelected(container, option, type);
  });
}

// Sélectionner tous les éléments de dropdown pour les ingrédients
const dropdownOptionsIngredients = document.querySelectorAll(
  "#ingredients.dropdown .dropdown-option"
);

// Ajouter un événement de clic à chaque option du menu déroulant pour les ingrédients
dropdownOptionsIngredients.forEach((option, index) => {
  option.addEventListener("click", (event) => {
    const selectedText = option.textContent.trim(); // Récupère le texte de l'option sélectionnée

    // Vérifie si l'option n'est pas déjà sélectionnée
    if (!selectedOptions.ingredients.includes(selectedText)) {
      selectedOptions.ingredients.push(selectedText); // Ajoute l'option au tableau des options sélectionnées

      // Réexécute la recherche et met à jour les résultats
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results);

      // Affiche l'option sélectionnée dans la zone dédiée
      // templateOptions("ingredients", selectedText);
      renderSelectedOptionsTags();

      const selectedOptionsContainer = document.querySelector(
        "#ingredients.dropdown .selected-options-container"
      );
      renderSelectedDropdownOptions(
        selectedOptionsContainer,

        "ingredients"
      );
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
    const selectedText = option.textContent.trim(); // Récupère le texte de l'option sélectionnée

    // Vérifie si l'option n'est pas déjà sélectionnée
    if (
      !selectedOptions.appliance ||
      selectedOptions.appliance !== selectedText
    ) {
      selectedOptions.appliance = selectedText; // Définit l'option comme sélectionnée

      // Réexécute la recherche et met à jour les résultats
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results);

      // Affiche l'option sélectionnée dans la zone dédiée
      // templateOptions("appliance", selectedText);
      renderSelectedOptionsTags();

      const selectedOptionsContainer = document.querySelector(
        "#appliance.dropdown .selected-options-container"
      );
      renderSelectedDropdownOptions(selectedOptionsContainer, "appliance");

      // Filtre les options pour afficher uniquement l'option sélectionnée
      dropdownOptionsAppliance.forEach((option) => {
        if (option.textContent.trim() === selectedText) {
          option.style.display = "block"; // Affiche l'option sélectionnée
        } else {
          option.style.display = "none"; // Masque les autres options
        }
      });
    }
  });
});

// Sélectionner tous les éléments de dropdown pour les ustensiles
const dropdownOptionsUstensils = document.querySelectorAll(
  "#ustensils.dropdown .dropdown-option"
);

// Ajouter un événement de clic à chaque option du menu déroulant pour les ustensiles
dropdownOptionsUstensils.forEach((option) => {
  option.addEventListener("click", (event) => {
    const searchValue = input.value.trim().toLowerCase();
    selectedOptions.ustensils.push(option.textContent); // Ajoute l'ustensile au tableau des options sélectionnées

    // Réexécute la recherche et met à jour les résultats
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);

    // Affiche l'ustensile sélectionné dans la zone dédiée
    // templateOptions("ustensils", option.textContent);
    renderSelectedOptionsTags();

    const selectedOptionsContainer = document.querySelector(
      "#ustensils.dropdown .selected-options-container"
    );
    renderSelectedDropdownOptions(selectedOptionsContainer, "ustensils");
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
