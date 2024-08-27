import { recipes } from "./public/recipes.js";
import { getAllAppliances } from "../main.js";
import { getAllUstensils } from "../main.js";
import { getAllIngredients } from "../main.js";

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

  const filteredAppliances = [];

  applianceNames.forEach((appliance) => {
    if (applianceNames.substr(0, value.length).toLowerCase() === value) {
      filteredAppliances.push(appliance);
    }
  });
  createAutocomplete(filteredAppliances);
}

function createAutocomplete(list) {
  const listElement = document.querySelector(".options-container");

  listElement.forEach((appliance) => {
    const listItem = document.createElement("li");
    const applianceButton = document.createElement("button");
    applianceButton.textContent = appliance;
    listItem.appendChild(applianceButton);

    listElement.appendChild(listItem);
  });

  document.querySelector(".options-container").appendChild(listElement);
}

function removeAutocomplete() {
  const listElement = document.querySelector(".options-container");
  listElement.innerHTML = "";
}
