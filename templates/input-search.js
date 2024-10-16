export function setupDropdownSearch() {
  // Sélectionner toutes les entrées de recherche dans les dropdowns
  const dropdownSearches = document.querySelectorAll(
    ".dropdown-content.dropdown-search"
  );

  // Ajouter un événement de saisie à chaque élément de recherche
  dropdownSearches.forEach((dropdownSearch) => {
    dropdownSearch.addEventListener("input", (event) => {
      const searchValue = event.target.value.trim().toLowerCase();

      // Sélectionner toutes les options associées à ce dropdown
      const dropdownOptions = dropdownSearch.parentElement.querySelectorAll(
        ".selected-options-container"
      );

      // Filtrer et afficher/masquer les options selon la recherche
      dropdownOptions.forEach((option) => {
        const optionText = option.textContent.toLowerCase();
        if (optionText.includes(searchValue)) {
          option.style.display = "block"; // Afficher l'option si elle correspond
        } else {
          option.style.display = "none"; // Masquer l'option sinon
        }
      });
    });
  });
}
