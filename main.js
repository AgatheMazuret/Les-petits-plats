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
// // Sélectionner tous les éléments de dropdown
const dropdownOptions = document.querySelectorAll(".dropdown-option");

// Ajouter un événement à chaque option du dropdown
dropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    const searchValue = event.target.textContent.toLowerCase();
    const selectedOption = option.textContent;

    // TODO : récupérer le type de l'option pour mettre à jour la bonne clé dans selectedOptions

    // Vérifier si l'option est déjà sélectionnée
    if (!selectedOptions.ustensils.includes(selectedOption)) {
      // Ajouter l'option sélectionnée au tableau
      selectedOptions.ustensils.push(selectedOption);
    }

    // Appeler la fonction performSearch pour lancer la recherche avec les options sélectionnées
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats de la recherche
    displayResults(results);

    //  TODO : Créer une fonction template pour afficher les options sélectionnées

    // Sélectionne l'élément dans le DOM où les options sélectionnées seront affichées
    const selectedOptionDisplay = document.querySelector(
      ".selected-option-display"
    );

    // Crée un nouvel élément HTML pour l'appareil sélectionné
    const selectedOptionOption = document.createElement("p");
    selectedOptionOption.textContent = selectedOption;
    selectedOptionOption.classList.add("selected-option-option");
    selectedOptionOption.setAttribute("data-type", "appliance"); // Marque l'élément comme étant un appareil
    selectedOptionDisplay.appendChild(selectedOptionOption);

    // Ajoute un icône pour pouvoir retirer cette option
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-x");
    selectedOptionOption.appendChild(closeIcon);

    // Ajoute un écouteur d'événement pour gérer la suppression de l'appareil sélectionné
    closeIcon.addEventListener("click", () => {
      // TODO : Mettre à jour selectedOptions en fonction de l'élément supprimé
      selectedOptions.ustensils = selectedOptions.ustensils.filter(
        (option) => option !== selectedOption
      );
      // Supprime l'élément HTML de l'appareil sélectionné
      selectedOptionOption.remove();
      // Met à jour les résultats en fonction des options restantes
      const results = performSearch(searchValue, selectedOptions);
      // Afficher les résultats de la recherche
      displayResults(results);
    });
  });
});
