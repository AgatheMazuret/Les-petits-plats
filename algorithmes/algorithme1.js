import { recipes } from "../public/recipes.js";
// *******************************************************Algorithme array********************************************************

//******Recherche d'un ingrédient, d'une recette, d'un ustensile ou d'un appareil dans les recettes avec la search bar

// Crée un tableau vide pour stocker les recettes qui correspondent à la recherche
let results = [];

// Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie
export function performSearch(searchValue, selectedOptions) {
  // Réinitialise les résultats à chaque nouvelle recherche
  results = [];

  // Parcourt toutes les recettes disponibles
  recipes.forEach((recipe) => {
    // Parcourt tous les ingrédients de la recette actuelle
    recipe.ingredients.forEach((ingredientObj) => {
      // Vérifie si l'ingrédient est un objet et s'il contient une propriété "ingredient"
      if (typeof ingredientObj === "object" && ingredientObj.ingredient) {
        // Si l'ingrédient correspond à la valeur de recherche (en ignorant la casse), ajoute la recette aux résultats
        if (ingredientObj.ingredient.toLowerCase().includes(searchValue)) {
          results.push(recipe);
        }
      } else {
        // Si l'ingrédient est une chaîne de caractères et qu'il correspond à la valeur de recherche, ajoute la recette aux résultats
        if (ingredientObj.toLowerCase().includes(searchValue)) {
          results.push(recipe);
        }
      }
    });

    // Parcourt tous les ustensiles de la recette actuelle
    recipe.ustensils.forEach((ustensil) => {
      // Si l'ustensile correspond à la valeur de recherche, ajoute la recette aux résultats
      if (ustensil.toLowerCase().includes(searchValue)) {
        results.push(recipe);
      }
    });

    // Vérifie si l'appareil de la recette correspond à la valeur de recherche
    if (recipe.appliance.toLowerCase().includes(searchValue)) {
      // Si oui, ajoute la recette aux résultats
      results.push(recipe);
    }
  });

  // Supprime les doublons dans les résultats en ne gardant qu'une seule occurrence de chaque recette
  results = results.filter(
    (recipe, index) => results.indexOf(recipe) === index
  );

  // Fonction qui met à jour les résultats en fonction des options sélectionnées (ingrédients, ustensiles, appareils)
  function updateResultsBasedOnSelection() {
    // Récupère toutes les options sélectionnées dans l'interface utilisateur et les convertit en minuscules
    const selectedOptions = Array.from(
      document.querySelectorAll(".selected-option-option")
    ).map((option) => option.textContent.toLowerCase());

    // Re-effectue la recherche avec les options sélectionnées et affiche les résultats
    const results = performSearch(selectedOptions.join(" "));
    displayResults(results);
  }

  // Gère l'ajout de l'appareil sélectionné

  // Retourne les résultats de la recherche pour un éventuel usage futur
  return results;
}
