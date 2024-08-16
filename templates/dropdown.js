// ************************************************Créer 3 dropdowns**********************************************

// **************** fonction pour créer un dropdown***********************

export function createDropdown(containerId, buttonText, options) {
  // Obtenir le container où on va mettre le dropdown
  const dropdownContainer = document.getElementById(containerId);

  if (!dropdownContainer) {
    console.error(`Le conteneur avec l'ID '${containerId}' n'existe pas.`);
    return;
  }

  // Créer la structure HTML du dropdown
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");

  const dropdownButton = document.createElement("button");
  dropdownButton.classList.add("dropdown-button");
  dropdownButton.textContent = buttonText;

  const chevronIcon = document.createElement("i");
  chevronIcon.classList.add("fa-solid", "fa-chevron-down");
  dropdownButton.appendChild(chevronIcon);

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  // Créer un input pour la recherche et l'ajouter en premier
  const inputSearch = document.createElement("input");
  inputSearch.setAttribute("type", "text");
  inputSearch.classList.add("dropdown-search");
  dropdownContent.appendChild(inputSearch);

  // Créer un bouton de recherche
  const searchButton = document.createElement("button");
  searchButton.classList.add("search-button");
  inputSearch.appendChild(searchButton);

  // Créer une loupe en font-awesome
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("fa-solid", "fa-search");
  inputSearch.appendChild(searchIcon);

  // Ajouter les options au dropdown
  options.forEach((option) => {
    const dropdownOption = document.createElement("a");
    dropdownOption.textContent = option;
    dropdownOption.href = "#";
    dropdownContent.appendChild(dropdownOption);
  });

  // Ajouter les éléments au DOM
  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropdownContent);
  dropdownContainer.appendChild(dropdown);

  // Ajouter l'événement de clic pour afficher/masquer le dropdown en flex
  dropdownButton.addEventListener("click", () => {
    dropdownContent.style.display =
      dropdownContent.style.display === "flex" ? "none" : "flex";
  });
}
