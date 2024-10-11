export function setupSearch(
  formSelector, // Le sélecteur pour le formulaire
  inputSelector, // Le sélecteur pour le champ de recherche
  performSearch, // Fonction pour exécuter la recherche
  selectedOptions // Options pour la recherche
) {
  // Sélectionner les éléments du formulaire et du champ de recherche
  document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(formSelector); // Utilise le sélecteur passé en paramètre
    const searchInput = document.querySelector(inputSelector); // Utilise aussi le sélecteur passé en paramètre

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

      // Valider la longueur de la valeur
      let searchValue = "";
      if (value.length > 3) {
        searchValue = value;
      }

      // Appeler la fonction de recherche et afficher les résultats
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results); // Assure-toi que cette fonction est définie ailleurs
    });

    // Ajouter un écouteur d'événement pour les changements de saisie dans le champ de recherche
    searchInput.addEventListener("input", (event) => {
      const value = event.target.value.trim().toLowerCase();

      let searchValue = "";
      if (value.length > 3) {
        searchValue = value;
      }

      // Appeler la fonction de recherche et afficher les résultats en temps réel
      const results = performSearch(searchValue, selectedOptions);
      displayResults(results); // Assure-toi que cette fonction est définie
    });
  });
}
