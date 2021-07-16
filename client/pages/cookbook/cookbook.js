cDI.pages.cookbook = {
  siteHeaderText: "Cookbook",
  init: async () => {
    await cDI.remote.loadComponent($("#cargoHold"), "components/projectWidgets", "recipeCard")
    await cDI.remote.asyncGetScript(`js/services/recipeService.js`)
    var recipes = await cDI.services.recipe.getAllRecipes()
    var cards = await cDI.components.recipeCard.buildRecipeCardList(recipes)
    $("#counterTop").empty()
    $("#counterTop").html(cards)
  }
}
