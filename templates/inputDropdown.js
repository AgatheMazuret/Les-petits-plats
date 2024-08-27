import { recipes } from "../public/recipes.js";
import {
  getAllAppliances,
  getAllUstensils,
  getAllIngredients,
} from "../main.js";

const inputElement = document.querySelector(".dropdown-search");

inputElement.addEventListener("input", onInputChange);

getAllAppliances(recipes);
getAllUstensils(recipes);
getAllIngredients(recipes);

let applianceNames = [];
let ustensilNames = [];
let ingredientNames = [];

function onInputChange() {
  removeAutocomplete();

  const value = inputElement.value.toLowerCase();

  const filteredAppliances = applianceNames.filter((appliance) =>
    appliance.toLowerCase().startsWith(value)
  );

  createAutocomplete(filteredAppliances);
}

function createAutocomplete(list) {
  const listElement = document.querySelector(".options-container");

  // Vider la liste avant d'ajouter de nouveaux éléments
  listElement.innerHTML = "";

  // Créer une liste d'éléments pour chaque appareil filtré
  list.forEach((appliance) => {
    const listItem = document.createElement("li");
    const applianceButton = document.createElement("button");
    applianceButton.textContent = appliance;
    listItem.appendChild(applianceButton);
    listElement.appendChild(listItem);
  });
}

function removeAutocomplete() {
  const listElement = document.querySelector(".options-container");
  listElement.innerHTML = "";
}
