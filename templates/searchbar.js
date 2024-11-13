/**
 *
 * @param {(value:string)=> void} onSearch
 */
export function setupSearch(onSearch) {
  // Sélectionner les éléments du formulaire et du champ de recherche
  document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("form.search"); // Utilise le sélecteur passé en paramètre
    const searchInput = document.querySelector(".search input"); // Utilise aussi le sélecteur passé en paramètre

    // Vérifier que les éléments existent
    if (!searchForm || !searchInput) {
      console.error("Formulaire ou champ de recherche introuvable");
      return;
    }

    // Ajouter un écouteur d'événement pour la soumission du formulaire
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      // Récupérer les données du formulaire
      const formData = new FormData(searchForm);
      // Récupérer la valeur du champ de recherche
      const value = formData.get("search").trim().toLowerCase();

      onSearch(value);
    });

    // Ajouter un écouteur d'événement pour les changements de saisie dans le champ de recherche
    searchInput.addEventListener("input", (event) => {
      event.preventDefault();
      const value = event.target.value.trim().toLowerCase();

      onSearch(value);
    });
  });
}
