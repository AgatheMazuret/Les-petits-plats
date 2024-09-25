import { recipes } from "../public/recipes.js";
// *******************************************************Algorithme array********************************************************

// Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie
export function performSearch(searchValue, selectedOptions) {
  // Filtrer les recettes en fonction de la valeur de recherche (search bar)
  const searchValueLower = searchValue.toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchValueLower)
  );

  // Filtrer les recettes en fonction des options sélectionnées (toutes les options doivent être respectées)
  const selectedRecipes = filteredRecipes.filter((recipe) => {
    // Filtrer selon les ingrédients sélectionnés : Tous les ingrédients sélectionnés doivent être présents dans la recette
    const ingredientsMatch =
      // Si aucun ingrédient n'est sélectionné, ne pas appliquer de filtre sur les ingrédients
      selectedOptions.ingredients.length === 0 ||
      // Vérifier que chaque ingrédient sélectionné est présent dans la liste des ingrédients de la recette (comparaison insensible à la casse)
      selectedOptions.ingredients.every((ingredient) =>
        recipe.ingredients.some((recipeIngredient) =>
          recipeIngredient.ingredient
            .toLowerCase()
            .includes(ingredient.toLowerCase())
        )
      );

    // Filtrer selon les ustensiles sélectionnés : Tous les ustensiles sélectionnés doivent être présents dans la recette
    const ustensilsMatch =
      // Si aucun ustensile n'est sélectionné, ne pas appliquer de filtre sur les ustensiles
      selectedOptions.ustensils.length === 0 ||
      // Vérifier que chaque ustensile sélectionné est présent dans la liste des ustensiles de la recette (comparaison insensible à la casse)
      selectedOptions.ustensils.every((ustensil) =>
        recipe.ustensils.some((recipeUstensil) =>
          recipeUstensil.toLowerCase().includes(ustensil.toLowerCase())
        )
      );

    // Filtrer selon l'appareil sélectionné : Doit correspondre exactement
    const applianceMatch =
      // Si aucun appareil n'est sélectionné, ne pas appliquer de filtre sur l'appareil
      !selectedOptions.appliance ||
      // Si un appareil est sélectionné, vérifier que l'appareil de la recette correspond à l'appareil sélectionné (comparaison insensible à la casse)
      recipe.appliance
        .toLowerCase()
        .includes(selectedOptions.appliance.toLowerCase());

    // Toutes les conditions doivent être remplies pour que la recette soit sélectionnée
    return ingredientsMatch && ustensilsMatch && applianceMatch;
  });

  // Vérifier si aucune recette n'a été trouvée
  if (selectedRecipes.length === 0) {
    console.error("Aucune recette trouvée pour votre recherche."); // Afficher dans la console
    alert("Aucune recette trouvée pour votre recherche."); // Afficher un message d'alerte à l'utilisateur
  }

  return selectedRecipes;
}
