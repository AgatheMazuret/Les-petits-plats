// ************************************************Créer 3 dopdown**********************************************

// **************** fonction pour créer un dropdown***********************

function createDropdown(containerId, buttonText, options) {
  // Obtenir le container où on va mettre le dropdown

  const dropdownContainer = document.querySelector(".dropdown");

  //   Créer la structure html du dropdown

  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");

  const dropdownButton = document.createElement("button");
  dropdownButton.classList.add("dropdown-button");
  dropdownButton.textContent = buttonText;

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  options.forEach((option) => {
    const dropdownOption = document.createElement("a");
    a.textContent = option;
    dropdownContent.appendChild(dropdownOption);
  });

  // Ajouter les éléments au DOM
  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropdownContent);
  dropdownContainer.appendChild(dropdown);

  // Ajouter l'événement de clic pour afficher/masquer le dropdown
  dropdownButton.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // Ajouter l'événement de clic pour fermer le dropdown si l'utilisateur clique en dehors
  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropdown-btn")) {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    }
  });
}
