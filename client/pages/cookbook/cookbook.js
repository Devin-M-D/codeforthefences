cDI.pages.cookbook = {
  siteHeaderText: "Cookbook",
  init: async () => {
    var recipes = await cDI.services.recipe.getAllRecipes()
    var favorites = await cDI.widgets.recipeCard.buildRecipeCardList(recipes)
    $("#counterTop").append(favorites)
    $("#counterTop").append("<span></span>")
  }
}
