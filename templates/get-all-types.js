import { recipes } from "../public/recipes.js";
import { createDropdown } from "./dropdown.js";
import { renderDropdownOptions } from "../main.js";
import { displayResults } from "../main.js";

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
