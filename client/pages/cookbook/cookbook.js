cDI.pages.cookbook = {
  siteHeaderText: "Cookbook",
  init: async () => {
    await cDI.remote.asyncGetScript(`js/services/recipeService.js`)
    var recipes = await cDI.services.recipe.getAllRecipes()
    var favorites = await cDI.components.recipeCard.buildRecipeCardList(recipes)
    $("#counterTop").append(favorites)
    $("#counterTop").append("<span></span>")
  }
}
