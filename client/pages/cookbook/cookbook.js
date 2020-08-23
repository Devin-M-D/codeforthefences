cDI.components.cookbook = {
  init: async () => {
    var recipes = await getAllRecipes()
    var favorites = await buildRecipeCardList(recipes)
    $("#counterTop").append(favorites)
  }
}
