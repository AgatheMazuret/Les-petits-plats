import { recipes } from "../public/recipes.js";

/* ******************************************************* Algorithme boucle for ****************************************************** */

/* Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie */
export function performSearch(searchValue, selectedOptions) {
  // Mettre la valeur de recherche en minuscule pour garantir que la comparaison soit insensible à la casse
  const searchValueLower = searchValue.toLowerCase();
  // Créer un tableau vide pour stocker les recettes filtrées qui correspondent à la recherche
  const filteredRecipes = [];

  // Parcours toutes les recettes (boucle for)
  for (let i = 0; i < recipes.length; i++) {
    // 4. Récupère une recette spécifique dans le tableau `recipes`
    const recipe = recipes[i];

    // Vérifier si le nom ou la description de la recette contient la valeur de recherche
    if (
      recipe.name.toLowerCase().includes(searchValueLower) || // Comparaison du nom de la recette
      recipe.description.toLowerCase().includes(searchValueLower) // Comparaison de la description
    ) {
      // Si la recette correspond, on l'ajoute au tableau `filteredRecipes`
      filteredRecipes.push(recipe);
    }
  }

  // Créer un tableau vide pour stocker les recettes qui correspondent aux options sélectionnées
  const selectedRecipes = [];

  // Parcours toutes les recettes filtrées par la recherche de nom/description
  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];

    // Initialisation d'une variable pour vérifier si les ingrédients sélectionnés correspondent
    let ingredientsMatch = true;

    // Si des ingrédients ont été sélectionnés, on vérifie si chaque ingrédient est présent dans la recette
    if (selectedOptions.ingredients.length > 0) {
      // Parcours tous les ingrédients sélectionnés
      for (let k = 0; k < selectedOptions.ingredients.length; k++) {
        const ingredient = selectedOptions.ingredients[k].toLowerCase();
        let ingredientFound = false;

        // Parcours les ingrédients de la recette pour voir si l'un d'eux correspond
        for (let k = 0; k < recipe.ingredients.length; k++) {
          const recipeIngredient =
            recipe.ingredients[k].ingredient.toLowerCase();

          // Si l'ingrédient est trouvé dans la recette, on arrête la recherche pour cet ingrédient
          if (recipeIngredient.includes(ingredient)) {
            ingredientFound = true;
            break;
          }
        }

        // Si un ingrédient sélectionné n'est pas trouvé dans la recette, la recette ne correspond pas
        if (!ingredientFound) {
          ingredientsMatch = false;
          break; // Si un ingrédient est manquant, on arrête la recherche pour cette recette
        }
      }
    }

    // Vérification des ustensiles sélectionnés
    let ustensilsMatch = true;
    if (selectedOptions.ustensils.length > 0) {
      for (let j = 0; j < selectedOptions.ustensils.length; j++) {
        const ustensil = selectedOptions.ustensils[j].toLowerCase();
        let ustensilFound = false;

        // Recherche de l'ustensile dans la recette
        for (let k = 0; k < recipe.ustensils.length; k++) {
          const recipeUstensil = recipe.ustensils[k].toLowerCase();
          if (recipeUstensil.includes(ustensil)) {
            ustensilFound = true;
            break; // Si l'ustensile est trouvé, on arrête la recherche pour cet ustensile
          }
        }

        // Si un ustensile sélectionné n'est pas trouvé dans la recette, la recette ne correspond pas
        if (!ustensilFound) {
          ustensilsMatch = false;
          break; // Si un ustensile est manquant, on arrête la recherche pour cette recette
        }
      }
    }

    // Vérification si l'appareil sélectionné correspond à celui de la recette
    let applianceMatch = true;
    if (selectedOptions.appliance) {
      applianceMatch = recipe.appliance
        .toLowerCase()
        .includes(selectedOptions.appliance.toLowerCase());
    }

    // Si tous les critères (ingrédients, ustensiles, appareil) sont respectés, on ajoute la recette à la liste des recettes sélectionnées
    if (ingredientsMatch && ustensilsMatch && applianceMatch) {
      selectedRecipes.push(recipe);
    }
  }

  // Retourner le tableau des recettes qui respectent tous les critères
  return selectedRecipes;
}
