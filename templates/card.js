// ****************************************Création d'une card pour chaque recette********************************

// **************** fonction pour créer une card**********************

function cardTemplate(data) {
  const {
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = data;

  // Fonction pour créer une card
  function createCard(recipe) {
    // Obtenir le container où on va mettre la card
    const cardsContainer = document.querySelector(".cards");

    // Créer la structure html de la card

    const card = document.createElement("article");
    card.classList.add("card");

    const img = document.createElement("img");
    img.setAttribute("src", image);
    img.setAttribute("alt", name);
    cardImage.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.appendChild(cardBody);

    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = name;
    cardBody.appendChild(cardTitle);

    const descriptionRecipe = document.createElement("p");
    description.classList.add("card-description");
    description.textContent = description;
    cardBody.appendChild(description);

    const cardIngredients = document.createElement("p");
    cardIngredients.classList.add("card-ingredients");
    cardIngredients.textContent = ingredients;
    cardBody.appendChild(cardIngredients);

    // Ajouter la card au DOM
    cardsContainer.appendChild(card);
  }
}
