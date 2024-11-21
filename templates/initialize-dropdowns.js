/* Importation des ressources nécessaires */
import { recipes } from "../public/recipes.js"; // Liste des recettes
import { createDropdown } from "./dropdown.js"; // Création des dropdowns
import { setupDropdownSearch } from "./input-search.js";

/* Fonction pour récupérer tous les appareils sans doublons */
export function getAllAppliances(recipes) {
  const appliancesSet = new Set();
  recipes.forEach((recipe) => {
    appliancesSet.add(recipe.appliance);
  });
  return Array.from(appliancesSet);
}

/* Fonction pour récupérer tous les ustensiles sans doublons */
export function getAllUstensils(recipes) {
  const ustensilsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil);
    });
  });
  return Array.from(ustensilsSet);
}

/* Fonction pour récupérer tous les ingrédients sans doublons */
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

/* Créer les dropdowns et gérer les interactions */
export function initializeDropdowns() {
  /* Appel des fonctions pour obtenir les listes d'appareils, ustensiles et ingrédients */
  const allAppliances = getAllAppliances(recipes);
  const allUstensils = getAllUstensils(recipes);
  const allIngredients = getAllIngredients(recipes);

  createDropdown("appliance", "Appareil", allAppliances);

  createDropdown("ustensils", "Ustensiles", allUstensils);

  createDropdown("ingredients", "Ingrédients", allIngredients);

  setupDropdownSearch(
    ".dropdown-content.dropdown-search",
    ".selected-options-container"
  ); // Recherche dans les dropdowns
}
