import "./styles/style.css";
import "./templates/inputDropdown.js";
import { createDropdown } from "./templates/dropdown.js";
import { cardTemplate } from "./templates/card.js";
import { recipes } from "./public/recipes.js";
import { performSearch } from "./algorithmes/algorithme1.js";

// ********************************* Nombre de recettes *******************************************
// Fonction pour mettre à jour l'affichage du nombre de recettes
function updateRecipeCount(count) {
  const recipeCount = document.querySelector(".nbr-recettes");
  recipeCount.textContent = `${count} recettes`;
}
// ********************************* Affichage des recettes dans le DOM  *******************************************
// fonction pour intégrer le résultat de la recherche dans le DOM
function displayResults(results) {
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
  const selectedOption = option.textContent;

  // Vérifier si l'option est déjà sélectionnée
  if (!selectedOptions.includes(selectedOption)) {
    // Ajouter l'option sélectionnée au tableau
    selectedOptions.push(selectedOption);
  }

  const results = performSearch(searchValue);
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
    const results = performSearch(searchValue);
    displayResults(results);
  }
});

// ******************************************Filtres*************************************************************

//************************** Recherche par dropdown**************************
// // Sélectionner tous les éléments de dropdown
const dropdownOptions = document.querySelectorAll(".dropdown-option");
// Sélectionner l'élément où afficher les options sélectionnées
const selectedOptionDisplay = document.querySelector(
  ".selected-option-display"
);

// Fonction pour mettre à jour les résultats en fonction des options sélectionnées
function updateResultsBasedOnSelection() {
  // Récupérer les valeurs sélectionnées des dropdowns
  const selectedOptions = Array.from(
    document.querySelectorAll(".selected-option-option")
  ).map((option) => option.textContent.toLowerCase());

  // Appeler performSearch avec les options sélectionnées
  const results = performSearch(selectedOptions.join(" "));
  displayResults(results);
}

// Initialiser un tableau pour stocker les options sélectionnées
let selectedOptions = [];

// Ajouter un événement à chaque option du dropdown
dropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    const searchValue = event.target.textContent.toLowerCase();
    const selectedOption = option.textContent;

    // Vérifier si l'option est déjà sélectionnée
    if (!selectedOptions.includes(selectedOption)) {
      // Ajouter l'option sélectionnée au tableau
      selectedOptions.push(selectedOption);
    }

    // // Créer un p pour afficher les options sélectionnées
    // const selectedOptionOption = document.createElement("p");
    // selectedOptionOption.textContent = selectedOption;
    // selectedOptionOption.classList.add("selected-option-option");
    // selectedOptionDisplay.appendChild(selectedOptionOption);

    // // créer un bouton X pour supprimer l'option sélectionnée
    // const closeIcon = document.createElement("i");
    // closeIcon.classList.add("fa-solid", "fa-x");
    // selectedOptionOption.appendChild(closeIcon);
    // closeIcon.addEventListener("click", () => {
    //   // Supprimer l'option sélectionnée du tableau
    //   selectedOptions = selectedOptions.filter(
    //     (option) => option !== selectedOption
    //   );
    //   // Supprimer l'élément p de l'option sélectionnée
    //   selectedOptionOption.remove();
    //   updateResultsBasedOnSelection();
    // });
    // Appeler la fonction performSearch pour lancer la recherche avec les options sélectionnées
    const results = performSearch(searchValue);
    // Afficher les résultats de la recherche
    displayResults(results);
  });
});
