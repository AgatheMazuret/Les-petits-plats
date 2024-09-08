import { recipes } from "../public/recipes.js";
// *******************************************************Algorithme array********************************************************

//******Recherche d'un ingrédient, d'une recette, d'un ustensile ou d'un appareil dans les recettes avec la search bar

// Crée un tableau vide pour stocker les résultats
let results = [];

<<<<<<< HEAD
// Fonction qui effectue la recherche
export function performSearch(searchValue) {
  // Réinitialise les résultats
=======
// Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie
export function performSearch(searchValue, selectedOptions) {
  // Réinitialise les résultats à chaque nouvelle recherche
>>>>>>> 1535b7a54ea5183d4a1b45b9be64c5437197e880
  results = [];

  // Filtrer les recettes en fonction des ingrédients, ustensiles et appareils
  const filteredRecipes = recipes.filter((recipe) => {
    // Recherche sur les ingrédients
    const ingredientMatch = recipe.ingredients.some((ingredientObj) => {
      // Vérifie si l'ingrédient est un objet et s'il contient une propriété "ingredient"
      if (typeof ingredientObj === "object" && ingredientObj.ingredient) {
        // Si l'ingrédient est un objet, convertit l'ingrédient en minuscule et vérifie s'il correspond à la valeur de recherche
        return ingredientObj.ingredient.toLowerCase().includes(searchValue);
      } else if (typeof ingredientObj === "string") {
        // Si l'ingrédient est une chaîne de caractères (et non un objet), vérifie la correspondance directe avec la valeur de recherche
        return ingredientObj.toLowerCase().includes(searchValue);
      }
      // Si ce n'est ni un objet ni une chaîne, retourne "false" pour ignorer cet élément
      return false;
    });

    // Recherche sur les ustensiles
    const ustensilMatch = recipe.ustensils.some((ustensil) =>
      ustensil.toLowerCase().includes(searchValue)
    );

    // Recherche sur l'appareil
    const applianceMatch = recipe.appliance.toLowerCase().includes(searchValue);

    // Retourne true si au moins une des conditions est remplie
    return ingredientMatch || ustensilMatch || applianceMatch;
  });

  // Assigner les recettes filtrées aux résultats
  results = filteredRecipes;

<<<<<<< HEAD
  // Retourner les résultats pour un usage futur
=======
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
>>>>>>> 1535b7a54ea5183d4a1b45b9be64c5437197e880
  return results;
}
