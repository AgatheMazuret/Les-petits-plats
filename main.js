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

//************************** Recherche par dropdown**************************

// Fonction pour retirer une option sélectionnée d'un type donné
function removeSelectedOption(type, selectedOption) {
  // Vérifie si le type d'option existe déjà dans selectedOptions
  if (selectedOptions[type] && Array.isArray(selectedOptions[type])) {
    // Trouve l'index de l'option dans la liste (si elle existe)
    const index = selectedOptions[type].indexOf(selectedOption);
    // Si l'option est trouvée (index > -1), on la retire de la liste
    if (index > -1) {
      selectedOptions[type].splice(index, 1); // Retire l'option à l'index trouvé
    }
  } else if (selectedOptions[type]) {
    // Si le type existe mais n'est pas un tableau (ex. appliance), on le remet à null
    selectedOptions[type] = null;
  } else {
    // Si le type n'existe pas, affiche un message d'erreur
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

  // Gérer la suppression de l'option
  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedOption);
    selectedOptionElement.remove();

    const searchValue = input.value.trim().toLowerCase();
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
  });
}
// Sélectionner tous les éléments de dropdown
const dropdownOptionsIngredients = document.querySelectorAll(
  "#ingredients.dropdown .dropdown-option"
);

// Ajouter un événement de clic à chaque option du menu déroulant
dropdownOptionsIngredients.forEach((option) => {
  // Lorsque l'utilisateur clique sur une option
  option.addEventListener("click", (event) => {
    // Obtenir la valeur du texte de l'option cliquée en minuscules
    const searchValue = input.value.trim().toLowerCase();
    // Obtenir le texte de l'option sélectionnée
    selectedOptions.ingredients.push(option.textContent);
    option.style.backgroundColor = "#ffd15b";

    // Effectuer une recherche avec la valeur obtenue et les options sélectionnées
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats de la recherche
    displayResults(results);

    // Appliquer un modèle à l'option sélectionnée
    templateOptions("ingredients", option.textContent);
  });
});

// Sélectionner tous les éléments de dropdown
const dropdownOptionsAppliance = document.querySelectorAll(
  "#appliance.dropdown .dropdown-option"
);

// Ajouter un événement de clic à chaque option du menu déroulant
dropdownOptionsAppliance.forEach((option) => {
  // Lorsque l'utilisateur clique sur une option
  option.addEventListener("click", (event) => {
    // Obtenir la valeur du texte de l'option cliquée en minuscules
    const searchValue = input.value.trim().toLowerCase();
    // Obtenir le texte de l'option sélectionnée
    selectedOptions.appliance = option.textContent;

    // Effectuer une recherche avec la valeur obtenue et les options sélectionnées
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats de la recherche
    displayResults(results);

    // Appliquer un modèle à l'option sélectionnée
    templateOptions("appliance", option.textContent);
  });
});

// Sélectionner tous les éléments de dropdown
const dropdownOptionsUstensils = document.querySelectorAll(
  "#ustensils.dropdown .dropdown-option"
);

// Ajouter un événement de clic à chaque option du menu déroulant
dropdownOptionsUstensils.forEach((option) => {
  // Lorsque l'utilisateur clique sur une option
  option.addEventListener("click", (event) => {
    // Obtenir la valeur du texte de l'option cliquée en minuscules
    const searchValue = input.value.trim().toLowerCase();
    // Obtenir le texte de l'option sélectionnée
    selectedOptions.ustensils.push(option.textContent);

    // Effectuer une recherche avec la valeur obtenue et les options sélectionnées
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats de la recherche
    displayResults(results);

    // Appliquer un modèle à l'option sélectionnée
    templateOptions("ustensils", option.textContent);
  });
});
