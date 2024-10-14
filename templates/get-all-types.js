// Importation des ressources
import { recipes } from "../public/recipes.js"; // Liste des recettes
import { createDropdown } from "./dropdown.js"; // Création des dropdowns
import { displayResults } from "../main.js"; // Affichage des recettes
import { handleDropdown } from "../main.js"; // Gestion des dropdowns

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

// Créer les dropdowns et gérer les interactions
function initializeDropdowns() {
  createDropdown("appliance", "Appareil", allAppliances);
  handleDropdown("appliance");

  createDropdown("ustensils", "Ustensiles", allUstensils);
  handleDropdown("ustensils");

  createDropdown("ingredients", "Ingrédients", allIngredients);
  handleDropdown("ingredients");
}

// Créer les cards de recettes
displayResults(recipes);

// Initialiser les dropdowns
initializeDropdowns();

// Ajouter l'événement de clic pour afficher/masquer le dropdown
const dropdowns = document.querySelectorAll(".dropdown-button");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    const optionsContainer = dropdown.nextElementSibling; // Assure-toi que l'élément suivant est le conteneur
    optionsContainer.classList.toggle("show");
  });
});
