import "./styles/style.css";
import { createDropdown } from "./templates/dropdown.js";
import { cardTemplate } from "./templates/card.js";
import { recipes } from "./public/recipes.js";
import { performSearch } from "./algorithmes/algorithme1.js";

// Initialiser un tableau pour stocker les options sélectionnées
const selectedOptions = {
  ingredients: [],
  ustensils: [],
  appliance: null,
};

// ********************************* Nombre de recettes *******************************************

// Fonction pour mettre à jour l'affichage du nombre de recettes
function updateRecipeCount(count) {
  const recipeCount = document.querySelector(".nbr-recettes");
  recipeCount.textContent = `${count} recettes`;
}
// ********************************* Affichage des recettes dans le DOM  *******************************************
// fonction pour intégrer le résultat de la recherche dans le DOM
export function displayResults(results) {
  // Sélectionne la section des recettes
  const recipesSection = document.querySelector(".cards");

  // Supprime toutes les recettes actuelles
  recipesSection.innerHTML = "";

  // Parcourt chaque recette dans les résultats
  results.forEach((recipe) => {
    // Crée une card pour chaque recette
    cardTemplate(recipe);
  });
  // Met à jour le nombre de recettes affichées
  updateRecipeCount(results.length);
}

// *********************************Listes sans doublons*******************************************
// Fonction pour récupérer tous les appareils sans doublons
export function getAllAppliances(recipes) {
  const appliancesSet = new Set();
  recipes.forEach((recipe) => {
    appliancesSet.add(recipe.appliance);
  });
  return Array.from(appliancesSet);
}

// Fonction pour récupérer tous les ustensiles sans doublons
export function getAllUstensils(recipes) {
  const ustensilsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil);
    });
  });
  return Array.from(ustensilsSet);
}

// Fonction pour récupérer tous les ingrédients sans doublons
export function getAllIngredients(recipes) {
  const ingredientsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredientObj) => {
      if (typeof ingredientObj === "object" && ingredientObj.ingredient) {
        ingredientsSet.add(ingredientObj.ingredient);
      } else {
        ingredientsSet.add(ingredientObj);
      }
    });
  });
  return Array.from(ingredientsSet);
}

// Appel des fonctions pour obtenir les listes
const allAppliances = getAllAppliances(recipes);
const allUstensils = getAllUstensils(recipes);
const allIngredients = getAllIngredients(recipes);

// ***************************************Dropdowns**************************************************
// stocker les options seléctionnées

// Mettre à jour l'affichage des recettes

// Créer les dropdowns
createDropdown("appliance", "Appareil", allAppliances);
createDropdown("ustensils", "Ustensiles", allUstensils);
createDropdown("ingredients", "Ingrédients", allIngredients);

// Créer les cards
displayResults(recipes);

// Ajouter l'événement de clic pour afficher/masquer le dropdown
const dropdowns = document.querySelectorAll(".dropdown-button");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    dropdown.nextElementSibling.classList.toggle("show");
  });
});

// ****************************************Barre de recherche****************************************************

//On récupère la valeur de l'input
// Sélectionne l'élément du champ de recherche dans le HTML
const input = document.querySelector(".search-input");

// Sélectionne le bouton de recherche dans le HTML
const btnSearch = document.querySelector(".search-btn");

// Ajoute un écouteur d'événements au bouton de recherche
// Lorsque le bouton est cliqué, la fonction performSearch est appelée
btnSearch.addEventListener("click", () => {
  // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
  const searchValue = input.value.trim().toLowerCase();

  const results = performSearch(searchValue, selectedOptions);
  displayResults(results);
});

// Ajoute un écouteur d'événements au champ de recherche
// Lorsque une touche est enfoncée dans le champ de recherche
input.addEventListener("keydown", (event) => {
  // Vérifie si la touche enfoncée est la touche "Entrée"
  if (event.key === "Enter") {
    // Récupère la valeur du champ de recherche, enlève les espaces au début et à la fin, et met tout en minuscules
    const searchValue = input.value.trim().toLowerCase();

    // Si c'est le cas, appelle la fonction performSearch pour lancer la recherche
    const results = performSearch(searchValue, selectedOptions);
    displayResults(results);
  }
});

// ******************************************Filtres*************************************************************

//************************** Recherche par dropdown**************************
// Sélectionner tous les éléments ayant la classe "dropdown-option"
const dropdownOptions = document.querySelectorAll(".dropdown-option");

<<<<<<< HEAD
// Fonction pour ajouter une option sélectionnée dans "selectedOptions"
function updateSelectedOptions(type, selectedOption) {
  // Vérifier si le type existe déjà dans "selectedOptions"
  if (selectedOptions[type]) {
    // Si l'option n'est pas déjà dans le tableau, l'ajouter
    if (!selectedOptions[type].includes(selectedOption)) {
      selectedOptions[type].push(selectedOption);
=======
// Ajouter un événement à chaque option du dropdown
dropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    const searchValue = event.target.textContent.toLowerCase();
    const selectedOption = option.textContent;

    // TODO : récupérer le type de l'option pour mettre à jour la bonne clé dans selectedOptions

    // Vérifier si l'option est déjà sélectionnée
    if (!selectedOptions.ustensils.includes(selectedOption)) {
      // Ajouter l'option sélectionnée au tableau
      selectedOptions.ustensils.push(selectedOption);
>>>>>>> 1535b7a54ea5183d4a1b45b9be64c5437197e880
    }
  } else {
    // Si le type n'existe pas, afficher une erreur
    console.error("Type d'option inconnu : ", type);
  }
}

<<<<<<< HEAD
// Fonction pour retirer une option sélectionnée dans "selectedOptions"
function removeSelectedOption(type, selectedOption) {
  // Vérifier si le type existe dans "selectedOptions"
  if (selectedOptions[type]) {
    // Trouver l'index de l'option dans le tableau
    const index = selectedOptions[type].indexOf(selectedOption);
    // Si l'option existe, la retirer du tableau
    if (index > -1) {
      selectedOptions[type].splice(index, 1);
    }
  } else {
    // Si le type n'existe pas, afficher une erreur
    console.error("Type d'option inconnu : ", type);
  }
}

// Fonction pour afficher une option sélectionnée dans l'interface utilisateur
function templateOptions(
  selectedOption,
  containerSelector = ".selected-option-display"
) {
  // Sélectionner l'élément du DOM où afficher les options sélectionnées
  const selectedOptionDisplay = document.querySelector(containerSelector);

  // Vérifier si l'élément d'affichage existe
  if (!selectedOptionDisplay) {
    console.error("Le conteneur spécifié est introuvable.");
    return;
  }

  // Créer un élément HTML pour afficher l'option sélectionnée
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedOption;
  selectedOptionElement.classList.add("selected-option-option");
  selectedOptionElement.setAttribute("data-type", "appliance");
  selectedOptionDisplay.appendChild(selectedOptionElement);

  // Créer une icône de suppression pour chaque option
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  selectedOptionElement.appendChild(closeIcon);

  // Ajouter un événement pour supprimer l'option lorsqu'on clique sur l'icône
  closeIcon.addEventListener("click", () => {
    // Retirer l'option sélectionnée de "selectedOptions"
    removeSelectedOption("appliance", selectedOption);
    // Retirer l'élément HTML de l'affichage
    selectedOptionElement.remove();
    // Mettre à jour la recherche avec les nouvelles options sélectionnées
    const searchValue = ""; // Vous pouvez récupérer la valeur de recherche ici
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats mis à jour
=======
    // Appeler la fonction performSearch pour lancer la recherche avec les options sélectionnées
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats de la recherche
>>>>>>> 1535b7a54ea5183d4a1b45b9be64c5437197e880
    displayResults(results);

    //  TODO : Créer une fonction template pour afficher les options sélectionnées

    // Sélectionne l'élément dans le DOM où les options sélectionnées seront affichées
    const selectedOptionDisplay = document.querySelector(
      ".selected-option-display"
    );

    // Crée un nouvel élément HTML pour l'appareil sélectionné
    const selectedOptionOption = document.createElement("p");
    selectedOptionOption.textContent = selectedOption;
    selectedOptionOption.classList.add("selected-option-option");
    selectedOptionOption.setAttribute("data-type", "appliance"); // Marque l'élément comme étant un appareil
    selectedOptionDisplay.appendChild(selectedOptionOption);

    // Ajoute un icône pour pouvoir retirer cette option
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-x");
    selectedOptionOption.appendChild(closeIcon);

    // Ajoute un écouteur d'événement pour gérer la suppression de l'appareil sélectionné
    closeIcon.addEventListener("click", () => {
      // TODO : Mettre à jour selectedOptions en fonction de l'élément supprimé
      selectedOptions.ustensils = selectedOptions.ustensils.filter(
        (option) => option !== selectedOption
      );
      // Supprime l'élément HTML de l'appareil sélectionné
      selectedOptionOption.remove();
      // Met à jour les résultats en fonction des options restantes
      const results = performSearch(searchValue, selectedOptions);
      // Afficher les résultats de la recherche
      displayResults(results);
    });
  });
}

// Ajouter un événement "click" à chaque option du dropdown
dropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    // Récupérer la valeur cliquée et la convertir en minuscules
    const searchValue = event.target.textContent.toLowerCase();
    // Obtenir le texte de l'option sélectionnée
    const selectedOption = option.textContent;

    // Ajouter l'option sélectionnée à "selectedOptions"
    updateSelectedOptions("appliance", selectedOption);

    // Lancer la recherche avec les options sélectionnées
    const results = performSearch(searchValue, selectedOptions);
    // Afficher les résultats de la recherche
    displayResults(results);

    // Afficher l'option sélectionnée dans l'interface utilisateur
    templateOptions(selectedOption);
  });
});
