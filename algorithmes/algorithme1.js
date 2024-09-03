import { recipes } from "../public/recipes.js";
import { displayResults } from "../main.js";
// *******************************************************Algorithme array********************************************************

//******Recherche d'un ingrédient, d'une recette, d'un ustensile ou d'un appareil dans les recettes avec la search bar

// Crée un tableau vide pour stocker les recettes qui correspondent à la recherche
let results = [];

// Crée un tableau vide pour stocker les options sélectionnées (ingrédients, ustensiles)
let selectedOptions = [];

// Initialise une variable pour l'appareil sélectionné (par exemple : "four", "mixeur")
let selectedAppliance = null;

// Sélectionne l'élément dans le DOM où les options sélectionnées seront affichées
const selectedOptionDisplay = document.querySelector(
  ".selected-option-display"
);

// Fonction qui effectue la recherche de recettes en fonction de la valeur de recherche fournie
export function performSearch(searchValue) {
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
  if (
    recipes.some((recipe) => recipe.appliance.toLowerCase() === searchValue)
  ) {
    // Vérifie si un appareil est déjà sélectionné
    if (selectedAppliance) {
      // Supprime l'ancien appareil sélectionné de la liste des options sélectionnées
      selectedOptions = selectedOptions.filter(
        (option) => option !== selectedAppliance
      );
      // Supprime l'élément correspondant à l'ancien appareil dans l'interface
      const oldApplianceElement = document.querySelector(
        `.selected-option-option[data-type="appliance"]`
      );
      if (oldApplianceElement) {
        oldApplianceElement.remove();
      }
    }

    // Met à jour la variable selectedAppliance avec le nouvel appareil sélectionné
    selectedAppliance = searchValue;

    // Crée un nouvel élément HTML pour l'appareil sélectionné
    const selectedOptionOption = document.createElement("p");
    selectedOptionOption.textContent = searchValue;
    selectedOptionOption.classList.add("selected-option-option");
    selectedOptionOption.setAttribute("data-type", "appliance"); // Marque l'élément comme étant un appareil
    selectedOptionDisplay.appendChild(selectedOptionOption);

    // Ajoute un icône pour pouvoir retirer cette option
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-x");
    selectedOptionOption.appendChild(closeIcon);

    // Ajoute un écouteur d'événement pour gérer la suppression de l'appareil sélectionné
    closeIcon.addEventListener("click", () => {
      // Réinitialise la variable selectedAppliance à null
      selectedAppliance = null;
      // Supprime l'élément HTML de l'appareil sélectionné
      selectedOptionOption.remove();
      // Met à jour les résultats en fonction des options restantes
      updateResultsBasedOnSelection();
    });
  } else {
    // Gère l'ajout des ingrédients et des ustensiles (si ce n'est pas un appareil)
    if (!selectedOptions.includes(searchValue)) {
      // Ajoute l'ingrédient ou l'ustensile sélectionné à la liste des options
      selectedOptions.push(searchValue);

      // Crée un nouvel élément HTML pour cet ingrédient ou ustensile
      const selectedOptionOption = document.createElement("p");
      selectedOptionOption.textContent = searchValue;
      selectedOptionOption.classList.add("selected-option-option");
      selectedOptionDisplay.appendChild(selectedOptionOption);

      // Ajoute un icône pour pouvoir retirer cette option
      const closeIcon = document.createElement("i");
      closeIcon.classList.add("fa-solid", "fa-x");
      selectedOptionOption.appendChild(closeIcon);

      // Ajoute un écouteur d'événement pour gérer la suppression de cet ingrédient ou ustensile
      closeIcon.addEventListener("click", () => {
        // Supprime l'ingrédient ou l'ustensile sélectionné de la liste des options
        selectedOptions = selectedOptions.filter(
          (option) => option !== searchValue
        );
        // Supprime l'élément HTML correspondant
        selectedOptionOption.remove();
        // Met à jour les résultats en fonction des options restantes
        updateResultsBasedOnSelection();
      });
    }
  }

  // Affiche les résultats de la recherche dans l'interface utilisateur
  displayResults(results);

  // Retourne les résultats de la recherche pour un éventuel usage futur
  return results;
}
