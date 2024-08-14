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
  dropdownButton.setAttribute("aria-haspopup", "true");
  dropdownButton.setAttribute("aria-expanded", "false");
  dropdownButton.textContent = buttonText;

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  options.forEach((option) => {
    const dropdownOption = document.createElement("a");
    dropdownOption.textContent = option;
    dropdownOption.href = "#"; // Optionnel : pour rendre les liens cliquables
    dropdownContent.appendChild(dropdownOption);
  });

  // Ajouter les éléments au DOM
  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropdownContent);
  dropdownContainer.appendChild(dropdown);

  // Ajouter l'événement de clic pour afficher/masquer le dropdown
  dropdownButton.addEventListener("click", () => {
    const isExpanded =
      dropdownButton.getAttribute("aria-expanded") === "true" || false;
    dropdownButton.setAttribute("aria-expanded", !isExpanded);
    dropdownContent.classList.toggle("show");
  });

  // Ajouter l'événement de clic pour fermer le dropdown si l'utilisateur clique en dehors
  window.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdownContent.classList.remove("show");
      dropdownButton.setAttribute("aria-expanded", "false");
    }
  });
}
