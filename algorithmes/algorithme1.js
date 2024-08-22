import { recipes } from "../public/recipes.js";
import { cardTemplate } from "../templates/card.js";

// *******************************************************Algorithme array********************************************************

//******Recherche d'un ingrédient, d'une recette, d'un ustensile ou d'un appareil dans les recettes avec la search bar

// Crée un tableau vide pour stocker les recettes qui correspondent à la recherche
let results = [];

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
}

// Fonction qui effectue la recherche
export function performSearch(searchValue) {
  // Vide le tableau des résultats pour chaque nouvelle recherche
  results = [];

  // Parcourt chaque recette dans le tableau de recettes
  recipes.forEach((recipe) => {
    console.log("Recette:", recipe); // Affiche chaque recette dans la console

    // Parcourt chaque ingrédient de la recette
    recipe.ingredients.forEach((ingredientObj) => {
      // Vérifie si l'ingrédient est un objet avec une propriété 'ingredient'
      if (typeof ingredientObj === "object" && ingredientObj.ingredient) {
        // Vérifie si le nom de l'ingrédient contient la valeur de recherche
        if (ingredientObj.ingredient.toLowerCase().includes(searchValue)) {
          // Si oui, ajoute la recette aux résultats
          results.push(recipe);
        }
      } else {
        // Si l'ingrédient est une chaîne de caractères simple
        if (ingredientObj.toLowerCase().includes(searchValue)) {
          // Vérifie si l'ingrédient contient la valeur de recherche et ajoute la recette aux résultats
          results.push(recipe);
        }
      }
    });

    // Parcourt chaque ustensile de la recette
    recipe.ustensils.forEach((ustensil) => {
      // Vérifie si le nom de l'ustensile contient la valeur de recherche
      if (ustensil.toLowerCase().includes(searchValue)) {
        // Si oui, ajoute la recette aux résultats
        results.push(recipe);
      }
    });

    // Vérifie si l'appareil utilisé dans la recette contient la valeur de recherche
    if (recipe.appliance.toLowerCase().includes(searchValue)) {
      // Si oui, ajoute la recette aux résultats
      results.push(recipe);
    }
  });

  // Enlève les doublons des résultats pour que chaque recette apparaisse une seule fois
  results = results.filter(
    (recipe, index) => results.indexOf(recipe) === index
  );

  // Affiche les résultats finaux dans le DOM
  displayResults(results);
}
