import { recipes } from "../public/recipes.js";

// *******************************************************Algorithme array.filter******************************************************

export function performSearch(searchValue, selectedOptions) {
  // Filtrer les recettes en fonction de la valeur de recherche (barre de recherche)
  const searchValueLower = searchValue.toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchValueLower)
  );

  // Filtrer les recettes en fonction des options sélectionnées (toutes les options doivent être respectées)
  const selectedRecipes = filteredRecipes.filter((recipe) => {
    // Vérifier que la recette a bien des ingrédients avant de filtrer
    const ingredientsList = recipe.ingredients || [];

    // S'assurer que selectedOptions est correctement initialisé
    const selectedIngredients = selectedOptions.ingredients || [];
    const selectedUstensils = selectedOptions.ustensils || [];
    const selectedAppliance = selectedOptions.appliance || "";

    // Filtrer selon les ingrédients sélectionnés : Tous les ingrédients sélectionnés doivent être présents dans la recette
    const ingredientsMatch =
      selectedIngredients.length === 0 ||
      selectedIngredients.every((ingredient) =>
        ingredientsList.some((recipeIngredient) =>
          recipeIngredient.ingredient
            .toLowerCase()
            .includes(ingredient.toLowerCase())
        )
      );

    // Filtrer selon les ustensiles sélectionnés
    const ustensilsMatch =
      selectedUstensils.length === 0 ||
      selectedUstensils.every((ustensil) =>
        (recipe.ustensils || []).some((recipeUstensil) =>
          recipeUstensil.toLowerCase().includes(ustensil.toLowerCase())
        )
      );

    // Filtrer selon l'appareil sélectionné
    const applianceMatch =
      !selectedAppliance ||
      (recipe.appliance || "")
        .toLowerCase()
        .includes(selectedAppliance.toLowerCase());

    // Retourner true si toutes les conditions sont respectées
    return ingredientsMatch && ustensilsMatch && applianceMatch;
  });

  return selectedRecipes;
}
