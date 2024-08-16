export function cardTemplate(recipe) {
  const {
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = recipe;

  const imageRecipe = `/images/recettes/${recipe.image}`;
  const nameRecipe = recipe.name;
  const descriptionRecipe = recipe.description;

  // Obtenir le container où on va mettre la card
  const cardsContainer = document.querySelector(".cards");

  if (!cardsContainer) {
    console.error("Le conteneur avec la classe 'cards' n'existe pas.");
    return;
  }

  // Créer la structure HTML de la card
  const card = document.createElement("article");
  card.classList.add("card");

  const img = document.createElement("img");
  img.setAttribute("src", imageRecipe);
  img.setAttribute("alt", nameRecipe);
  card.appendChild(img);

  const timeElement = document.createElement("p");
  timeElement.classList.add("time");
  timeElement.classList.add("time-element");
  timeElement.textContent = `${time} min`;
  card.appendChild(timeElement);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  card.appendChild(cardBody);

  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = nameRecipe;
  cardBody.appendChild(cardTitle);

  const nameElementRecette = document.createElement("p");
  nameElementRecette.classList.add("name-element-recette");
  nameElementRecette.textContent = "Recette";
  cardBody.appendChild(nameElementRecette);

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("card-description");
  descriptionElement.textContent = descriptionRecipe;
  cardBody.appendChild(descriptionElement);

  const nameElementIngredients = document.createElement("p");
  nameElementIngredients.classList.add("name-element-ingredients");
  nameElementIngredients.textContent = "Ingrédients";
  cardBody.appendChild(nameElementIngredients);

  // Créer une section pour les ingrédients
  const ingredientSection = document.createElement("div");
  ingredientSection.classList.add("ingredient-section");

  ingredients.forEach((ingredientObj) => {
    const ingredientName = ingredientObj.ingredient;
    const quantity = ingredientObj.quantity ? ingredientObj.quantity : "";
    const unit = ingredientObj.unit ? ingredientObj.unit : "";

    // Créer un élément pour le nom de l'ingrédient
    const ingredientNameElement = document.createElement("span");
    ingredientNameElement.classList.add("ingredient-name");
    ingredientNameElement.textContent = ingredientName;

    // Créer un élément pour la quantité et l'unité
    const quantityUnitElement = document.createElement("span");
    quantityUnitElement.classList.add("quantity-unit");

    // Formatage avec espace entre quantité et unité
    quantityUnitElement.textContent = `${quantity}${unit ? ` ${unit}` : ""}`;

    // Ajouter les éléments à la section d'ingrédients
    ingredientSection.appendChild(ingredientNameElement);
    ingredientSection.appendChild(quantityUnitElement);
  });

  // Ajouter la section d'ingrédients au cardBody
  cardBody.appendChild(ingredientSection);

  // Ajouter la card au DOM
  cardsContainer.appendChild(card);
}
