cDI.services.recipe = {
  getAllRecipes: async () => {
    var callRes = await cDI.remote.remoteCall("/crud/recipe/r/", { expectMany: true })
    return callRes.payload
  },
  parsePieces: (recipe) => {
    var ingredients = recipe.recipeIngredient.sort((a, b) => a.ingredientNum < b.ingredientNum).map(x => x.ingredient)
    var tools = recipe.recipeTool.sort((a, b) => a.toolNum < b.toolNum).map(x => x.tool)
    var steps = recipe.recipeStep.sort((a, b) => a.stepNum < b.stepNum).map(x => x.step)
    return { ingredients: ingredients, tools: tools, steps: steps }
  },
  searchUoM: async () => {
    var res = await cDI.remote.remoteCall("/crud/UoM/r/")
    console.log(res)
  },
  save: async (editedRecipe) => {
    var retVal
    var editedIngs = editedRecipe.ingredients.filter(x => !!x.edited)
    var editedSteps = editedRecipe.steps.filter(x => !!x.edited)

    if ([...editedIngs, ...editedSteps].length > 0){ retVal = await cDI.remote.remoteCall("/crud/recipe/u/", { editedRecipe: editedRecipe }) }
    else { retVal = "No changes to save" }
    return retVal
  }
}
