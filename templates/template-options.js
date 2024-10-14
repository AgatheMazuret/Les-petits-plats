import { removeSelectedOption } from "../main.js";
import { performSearch } from "../algorithmes/algorithme1.js";
import { displayResults } from "../main.js";
export function templateOptions(
  type,
  selectedOption,
  containerSelector = ".selected-option-display" // Sélecteur par défaut pour le conteneur d'affichage
) {
  let searchValue = "";
  // Sélectionne le conteneur où afficher les options sélectionnées
  const selectedOptionDisplay = document.querySelector(containerSelector);

  // Vérifie si le conteneur existe
  if (!selectedOptionDisplay) {
    console.error("Le conteneur spécifié est introuvable.");
    return;
  }

  // Crée un élément paragraphe pour afficher l'option sélectionnée
  const selectedOptionElement = document.createElement("p");
  selectedOptionElement.textContent = selectedOption; // Ajoute le texte de l'option
  selectedOptionElement.classList.add("selected-option-option"); // Ajoute une classe pour le style
  selectedOptionElement.setAttribute("data-type", type); // Ajoute un attribut pour identifier le type d'option
  selectedOptionDisplay.appendChild(selectedOptionElement); // Ajoute l'élément au conteneur

  // Crée une icône de fermeture pour retirer l'option
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Ajoute des classes pour l'icône
  selectedOptionElement.appendChild(closeIcon); // Ajoute l'icône à l'élément

  // Ajoute un événement de clic pour retirer l'option lorsqu'on clique sur l'icône de fermeture
  closeIcon.addEventListener("click", () => {
    removeSelectedOption(type, selectedOption); // Retire l'option du tableau des options sélectionnées
    selectedOptionElement.remove(); // Retire l'élément de l'affichage

    // Réexécute la recherche et met à jour les résultats
    const results = performSearch(searchValue, selectedOption);
    displayResults(results);
  });
}
