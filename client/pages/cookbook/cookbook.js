cDI.pages.cookbook = {
  html: `<span id="cookbookMain" class="pad10 algnSC">
    <span id="addNewRecipe" class="autoH">
      <span class="btnIcon" data-btnsize="80">
        <span class="shpPlus"></span>
      </span>
    </span>
    <span id="counterTop" style="box-shadow: 0;" class="algnSX shyScroll noShadow"></span>
  </span>`,
  siteHeaderText: "Cookbook",
  init: async () => {
    await ftbLoadComponent("components/projectWidgets", "recipeCard")
    await cDI.remote.asyncGetScript(`/js/services/recipeService.js`)
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
