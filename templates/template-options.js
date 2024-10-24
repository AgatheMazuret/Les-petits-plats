import { performSearch } from "../algorithmes/algorithme1.js";

const input = document.querySelector(".search input");

// ****************************** Gestion de l'affichage des options sélectionnées********************************
export function templateOptions(type, selectedOption, onClose) {
  // Sélectionne le conteneur où afficher les options sélectionnées
  const selectedOptionDisplay = document.querySelector(
    ".selected-option-display"
  );

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
    selectedOptionElement.remove(); // Retire l'élément de l'affichage

    onClose();
  });
}

// **************************************** Gestion de la position des options dans le dropdown******************************************
export function moveOptionBelowSearch(option, dropdown) {
  const dropdownSearch = document.querySelector(
    ".dropdown-content.dropdown-search"
  );

  // Vérifie s'il y a un élément "dropdown-search" et une option sélectionnée
  if (dropdownSearch && option) {
    dropdownSearch.insertAdjacentElement("afterend", option); // Insère l'option sélectionnée après le champ de recherche
    option.style.display = "none"; // Masque l'option après la sélection
  }
}

//****************************************Insertion des éléments sélectionnés dans l'interface utilisateur***************************************
export function insertSelectedItemAfterSearch(
  selectedText,
  option,
  originalIndex,
  dropdown
) {
  // Crée un élément div avec le texte sélectionné
  const selectedItem = document.createElement("div");
  selectedItem.textContent = selectedText;
  selectedItem.classList.add("option-search"); // Ajoute une classe pour le style

  // Crée l'icône de fermeture
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x"); // Ajoute des classes pour l'icône
  selectedItem.appendChild(closeIcon); // Ajoute l'icône de fermeture à l'élément

  // Ajouter un événement de clic pour supprimer l'élément et réafficher l'option dans le dropdown
  closeIcon.addEventListener("click", () => {
    selectedItem.remove(); // Supprime l'élément de la liste des éléments sélectionnés

    // Réaffiche et replace l'option dans le dropdown à sa position d'origine
    const dropdownOptions = document.querySelector(".dropdown-option");

    // Réinsère l'option à son index d'origine
    if (dropdownOptions[originalIndex]) {
      dropdownOptions[originalIndex].insertAdjacentElement(
        "beforebegin",
        option
      );
    } else {
      dropdown.appendChild(option); // Si aucune option n'est trouvée, ajoute à la fin
    }

    option.style.display = "block"; // Remet l'option visible dans le dropdown

    // Retirer l'option du tableau des options sélectionnées
    const index = selectedOptions.ingredients.indexOf(selectedText);
    if (index > -1) {
      selectedOptions.ingredients.splice(index, 1); // Retire l'option du tableau
    }

    // Refaire la recherche et afficher les résultats
    const searchValue = input.value.trim().toLowerCase();
    const results = performSearch(searchValue, selectedOptions); // fonction à définir
    displayResults(results); // fonction à définir
  });

  // Insère l'élément sélectionné après le champ de recherche
  const dropdownSearch = document.querySelector(
    ".dropdown-content.dropdown-search"
  );
  if (dropdownSearch) {
    dropdownSearch.insertAdjacentElement("afterend", selectedItem);
  } else {
    console.error("L'élément .dropdown-search n'existe pas dans le DOM.");
  }
}

// **************************************** Gestion des événements de clic sur les options du dropdown**************************************************
export function handleDropdownOptions(dropdownOptions, selectedOptions) {
  dropdownOptions.forEach((option, index) => {
    option.addEventListener("click", () => {
      const selectedText = option.textContent.trim(); // Récupère le texte de l'option sélectionnée

      // Vérifie si l'option n'est pas déjà sélectionnée
      if (!selectedOptions.ingredients.includes(selectedText)) {
        selectedOptions.ingredients.push(selectedText); // Ajoute l'option au tableau des options sélectionnées

        // Récupère le dropdown parent
        const dropdown = option.closest(".dropdown");

        // Insère l'élément sélectionné après le champ de recherche
        insertSelectedItemAfterSearch(selectedText, option, index, dropdown);

        // Réexécute la recherche et met à jour les résultats
        const searchValue = input.value.trim().toLowerCase();
        const results = performSearch(searchValue, selectedOptions); // fonction à définir
        displayResults(results); // fonction à définir

        // Affiche l'option sélectionnée dans la zone dédiée
        templateOptions("ingredients", selectedText);

        // Remonte l'option sélectionnée juste en dessous du champ de recherche et la masque
        moveOptionBelowSearch(option, dropdown);
      }
    });
  });
}
