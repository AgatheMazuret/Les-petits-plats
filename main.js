import "./styles/style.css";
import { createDropdown } from "./templates/dropdown.js";
import { cardTemplate } from "./templates/card.js";
import { recipes } from "./public/recipes.js";
import { performSearch } from "./algorithmes/algorithme1.js";

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

// ***************************************Dropdowns***********************************************************

// Créer les dropdowns
createDropdown("appliance", "Appareil", allAppliances);
createDropdown("ustensils", "Ustensiles", allUstensils);
createDropdown("ingredients", "Ingrédients", allIngredients);

// Créer les cards
recipes.forEach((recipe) => {
  cardTemplate(recipe);
});

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

  performSearch(searchValue);
});

// Ajoute un écouteur d'événements au champ de recherche
// Lorsque une touche est enfoncée dans le champ de recherche
input.addEventListener("keydown", (event) => {
  // Vérifie si la touche enfoncée est la touche "Entrée"
  if (event.key === "Enter") {
    // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
    const searchValue = input.value.trim().toLowerCase();

    // Si c'est le cas, appelle la fonction performSearch pour lancer la recherche
    performSearch(searchValue);
  }
});

// ******************************************Filtres*************************************************************

//************************** Recherche par dropdown**************************
// Sélectionner tous les éléments de dropdown
const dropdownOptions = document.querySelectorAll(".dropdown-option");

dropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    const searchValue = event.target.textContent.toLowerCase();
    performSearch(searchValue);
  });
});

// *****************Barre de recherche dans dropdown ingrédients******************

// Sélectionner le bouton de recherche du dropdown
const searchBtnDrpdown = document.querySelectorAll(".search-button");

// Ajouter un écouteur d'événements à chaque bouton de recherche du dropdown
searchBtnDrpdown.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    // Appeler la fonction performSearch pour lancer la recherche
    performSearch(searchValue);
  });
});
//  Comment chercher juste dans la liste des boutons d'ingrédients ?
