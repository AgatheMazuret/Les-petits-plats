import "./styles/style.css";
import { createDropdown } from "./templates/dropdown.js";
import { cardTemplate } from "./templates/card.js";
import { recipes } from "./public/recipes.js";

// Créer les dropdowns
createDropdown("appliance", "Appareil", [
  "Poêle",
  "Casserole",
  "Four",
  "Mixer",
  "Friteuse",
]);
createDropdown("ustensils", "Ustensiles", [
  "Fouet",
  "Couteau",
  "Cuillère",
  "Spatule",
  "Fourchette",
]);
createDropdown("ingredients", "Ingrédients", [
  "Oeuf",
  "Farine",
  "Lait",
  "Sucre",
  "Sel",
]);

// Créer les cards
recipes.forEach((recipe) => {
  const imageRecipe = `./images/${recipe.id}.jpg`;
  cardTemplate(recipe, imageRecipe);
});

// Ajouter l'événement de clic pour afficher/masquer le dropdown
const dropdowns = document.querySelectorAll(".dropdown-button");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    dropdown.nextElementSibling.classList.toggle("show");
  });
});

// Ajouter l'événement de clic pour fermer le dropdown si l'utilisateur clique en dehors
window.addEventListener("click", (event) => {
  if (!event.target.matches(".dropdown-button")) {
    dropdowns.forEach((dropdown) => {
      if (dropdown.nextElementSibling.classList.contains("show")) {
        dropdown.nextElementSibling.classList.remove("show");
      }
    });
  }
});
