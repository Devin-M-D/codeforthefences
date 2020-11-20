cDI.pages.cookbook = {
  siteHeaderText: "Cookbook",
  init: async () => {
    var recipes = await getAllRecipes()
    var favorites = await buildRecipeCardList(recipes)
    $("#counterTop").append(favorites)
    $("#counterTop").append("<span></span>")
  }
}
