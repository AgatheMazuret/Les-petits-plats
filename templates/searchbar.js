import { recipes } from "../public/recipes";
import { displayResults } from "./displayResults";
/**
 *
 * @param {(value:string)=> void} onSearch
 */
export function setupSearch() {
  const searchInput = document.querySelector(".search-input");

  searchInput.addEventListener("input", (event) => {
    event.preventDefault();
    const value = event.target.value.trim().toLowerCase();
    console.log(value);
  });

  const searchButton = document.querySelector(".search-btn");

  searchButton.addEventListener("click", () => {
    event.preventDefault();
    const value = searchInput.value.trim().toLowerCase();

    const filteredRecipes = recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(value) ||
        recipe.description.toLowerCase().includes(value)
      );
    });
    displayResults(filteredRecipes);
  });
}
