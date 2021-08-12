cDI.pages.cookbook = {
  siteHeaderText: "Cookbook",
  init: async () => {
    await cDI.remote.loadSimpleComponent("components/projectWidgets", "recipeCard")
    await cDI.remote.asyncGetScript(`js/services/recipeService.js`)
    var recipes = await cDI.services.recipe.getAllRecipes()
    await cDI.components.recipeCard.appendList($("#counterTop"), recipes)
    cDI.addAwaitableInput("click", $("#addNewRecipe > .btnIcon"), e => {
      cDI.pages.cookbook.createNewRecipe()
    })
  },
  createNewRecipe: async () => {
    var newRecipe = cDI.services.recipe.newRecipe()
    await cDI.components.recipeCard.appendRecipeCard($("#counterTop"), newRecipe)
  }
}
