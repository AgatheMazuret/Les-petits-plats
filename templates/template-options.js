// **************************************** Gestion de la position des options dans le dropdown******************************************

export function moveOptionBelowSearch(option, dropdown) {
  // Sélectionne l'élément "dropdown-search" dans le dropdown fourni
  const dropdownSearch = document.querySelector(".dropdown-search");

  // Vérifie s'il y a un élément "dropdown-search" et une option
  if (dropdownSearch && option) {
    // Insère l'option juste après le champ de recherche
    dropdownSearch.insertAdjacentElement("afterend", option);

    // Retire l'option de son emplacement précédent (facultatif, si nécessaire)
    option.remove();
  }
}
