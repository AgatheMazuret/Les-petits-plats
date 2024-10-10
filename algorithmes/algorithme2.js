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
      (() => {
        // Itérer sur selectedOptions.ingredients
        for (let i = 0; i < selectedOptions.ingredients.length; i++) {
          let ingredient = selectedOptions.ingredients[i];
          let matchFound = false;

          // Itérer sur recipe.ingrédients
          for (let j = 0; j < recipe.ingredients.length; j++) {
            let recipeIngredient = recipe.ingredients[j];

            //Vérifier si il y a une correspondance
            if (
              recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
            ) {
              matchFound = true;
              break; // Arrêter la boucle intérieure si une correspondance est trouvée
            }
          }
          // Si aucune correspondance n'est trouvée pour un ustensile, retourner false
          if (!matchFound) {
            return false;
          }
        }

        // Si tous les ustensiles sélectionnés correspondent, retourner true
        return true;
      })();

    // Filtrer selon les ustensiles sélectionnés
    const ustensilsMatch =
      selectedOptions.ustensils.length === 0 ||
      (() => {
        // Itérer sur selectedOptions.ustensils
        for (let i = 0; i < selectedOptions.ustensils.length; i++) {
          let ustensil = selectedOptions.ustensils[i];
          let matchFound = false;

          // Itérer sur recipe.ustensils
          for (let j = 0; j < recipe.ustensils.length; j++) {
            let recipeUstensil = recipe.ustensils[j];

            // Vérifier s'il y a une correspondance
            if (recipeUstensil.toLowerCase().includes(ustensil.toLowerCase())) {
              matchFound = true;
              break; // Arrêter la boucle intérieure si une correspondance est trouvée
            }
          }

          // Si aucune correspondance n'est trouvée pour un ustensile, retourner false
          if (!matchFound) {
            return false;
          }
        }

        // Si tous les ustensiles sélectionnés correspondent, retourner true
        return true;
      })();

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

  // Si aucune recette n'a été trouvée, afficher un message d'erreur
  if (selectedRecipes.length === 0) {
    displayErrorMessage("Aucune recette ne correspond à vos critères.");
  }

  return selectedRecipes; // Retourner toutes les recettes sélectionnées
}
