import { recipes } from "../public/recipes.js";
import {
  getAllAppliances,
  getAllUstensils,
  getAllIngredients,
} from "../main.js";

// Avec les lettres tapées dans l'input, on va filtrer les appareils, ustensiles et ingrédients
// pour afficher les résultats filtrés dans le dropdown.
// Sélectionne l'élément d'entrée dans le document avec la classe "dropdown-search"
const inputSearch = document.getElementsByClassName(".dropdown-search");
