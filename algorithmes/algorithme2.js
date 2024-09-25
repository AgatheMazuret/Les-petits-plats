import { recipes } from "../public/recipes.js";

// *******************************************************Algorithme boucle for******************************************************

// Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie
export function performSearch(searchValue, selectedOptions) {
  // Filtrer les recettes en fonction de la valeur de recherche (search bar)
  const searchValueLower = searchValue.toLowerCase();
  const filteredRecipes = [];

  // Filtrer les recettes par la valeur de recherche
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (recipe.name.toLowerCase().includes(searchValueLower)) {
      filteredRecipes.push(recipe);
    }
  }

  // Filtrer les recettes en fonction des options sélectionnées (toutes les options doivent être respectées)
  const selectedRecipes = [];

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];

    // Filtrer selon les ingrédients sélectionnés
    const ingredientsMatch =
      selectedOptions.ingredients.length === 0 ||
      selectedOptions.ingredients.every((ingredient) =>
        recipe.ingredients.some((recipeIngredient) =>
          recipeIngredient.ingredient
            .toLowerCase()
            .includes(ingredient.toLowerCase())
        )
      );

    // Filtrer selon les ustensiles sélectionnés
    const ustensilsMatch =
      selectedOptions.ustensils.length === 0 ||
      // changer every et some
      selectedOptions.ustensils.every((ustensil) =>
        recipe.ustensils.some((recipeUstensil) =>
          recipeUstensil.toLowerCase().includes(ustensil.toLowerCase())
        )
      );

    // Filtrer selon l'appareil sélectionné
    const applianceMatch =
      !selectedOptions.appliance ||
      recipe.appliance
        .toLowerCase()
        .includes(selectedOptions.appliance.toLowerCase());

    // Toutes les conditions doivent être remplies pour que la recette soit sélectionnée
    if (ingredientsMatch && ustensilsMatch && applianceMatch) {
      selectedRecipes.push(recipe);
    }
  }

  return selectedRecipes; // Retourner toutes les recettes sélectionnées
}
