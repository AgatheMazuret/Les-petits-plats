import { recipes } from "../public/recipes.js";

// *******************************************************Algorithme boucle for******************************************************

// Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie
export function performSearch(searchValue, selectedOptions) {
  // Mettre la valeur de recherche en minuscule pour les comparaisons
  const searchValueLower = searchValue.toLowerCase();
  const filteredRecipes = [];

  // Filtrer les recettes en fonction de la valeur de recherche (nom ou description)
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (
      recipe.name.toLowerCase().includes(searchValueLower) ||
      recipe.description.toLowerCase().includes(searchValueLower)
    ) {
      filteredRecipes.push(recipe);
    }
  }

  const selectedRecipes = [];

  // Filtrer les recettes en fonction des options sélectionnées (ingrédients, ustensiles, appareil)
  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];

    // Vérifier si tous les ingrédients sélectionnés sont présents dans la recette
    let ingredientsMatch = true;

    if (selectedOptions.ingredients.length > 0) {
      for (let j = 0; j < selectedOptions.ingredients.length; j++) {
        const ingredient = selectedOptions.ingredients[j].toLowerCase();
        let ingredientFound = false;

        for (let k = 0; k < recipe.ingredients.length; k++) {
          const recipeIngredient = recipe.ingredients[k].toLowerCase();

          if (recipeIngredient.includes(ingredient)) {
            ingredientFound = true;
            break; // Si l'ingrédient est trouvé, sortir de la boucle `k`
          }
        }

        if (!ingredientFound) {
          ingredientsMatch = false;
          break; // Si un ingrédient n'est pas trouvé, sortir de la boucle `j`
        }
      }
    }

    // Vérifier si tous les ustensiles sélectionnés sont présents dans la recette
    let ustensilsMatch = true;
    if (selectedOptions.ustensils.length > 0) {
      for (let j = 0; j < selectedOptions.ustensils.length; j++) {
        const ustensil = selectedOptions.ustensils[j].toLowerCase();
        let ustensilFound = false;

        for (let k = 0; k < recipe.ustensils.length; k++) {
          const recipeUstensil = recipe.ustensils[k].toLowerCase();
          if (recipeUstensil.includes(ustensil)) {
            ustensilFound = true;
            break; // Si l'ustensile est trouvé, arrêter la recherche pour cet ustensile
          }
        }

        if (!ustensilFound) {
          ustensilsMatch = false;
          break; // Si un ustensile n'est pas trouvé, arrêter la boucle
        }
      }
    }

    // Vérifier si l'appareil sélectionné correspond à celui de la recette
    let applianceMatch = true;
    if (selectedOptions.appliance) {
      applianceMatch = recipe.appliance
        .toLowerCase()
        .includes(selectedOptions.appliance.toLowerCase());
    }

    // Si tous les critères sont respectés, ajouter la recette à la liste des résultats
    if (ingredientsMatch && ustensilsMatch && applianceMatch) {
      selectedRecipes.push(recipe);
    }
  }

  return selectedRecipes; // Retourner les recettes sélectionnées
}
