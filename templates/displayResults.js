import { cardTemplate } from "../templates/card.js";

// ********************************* Affichage des recettes dans le DOM *******************************************
// ********************************* Mise à jour du compteur de recettes *******************************************
export function updateRecipeCount(count) {
  const recipeCount = document.querySelector(".nbr-recettes");
  recipeCount.textContent = `${count} recettes`; // Affiche le nombre de recettes
}

export function displayResults(results) {
  const recipesSection = document.querySelector(".cards");
  recipesSection.innerHTML = ""; // Réinitialise les recettes

  results.forEach((recipe) => {
    cardTemplate(recipe);
  });
  updateRecipeCount(results.length);
}
