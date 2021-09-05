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
//#region empty objects
  newRecipe: () => {
    return {
      id: null,
      ingredients: [],
      name: null,
      servings: null,
      stepMaps: [],
      steps: [],
      tools: []
    }
  },
  newIngredient: (recipeId, ingredientIndex) => {
    return {
        UoMAbbr: null,
        UoMId: null,
        UoMName: null,
        abbr: null,
        edited: ["new"],
        foodVariantAbbr: null,
        foodVariantDesc: null,
        foodVariantId: null,
        foodVariantName: null,
        ingredientId: null,
        ingredientQuantity: null,
        plural: null,
        pluralAbbr: null,
        prepStyleDesc: null,
        prepStyleId: null,
        prepStyleName: null,
        recipeId: recipeId,
        ingredientIndex: ingredientIndex,
        recipe_ingredientId: null,
        substanceId: null,
        substanceName: null
      }
  },
  newStep: (recipeId, stepIndex) => {
    return {
      id: null,
      edited: ["new"],
      recipeId: recipeId,
      recipe_stepId: null,
      stepIndex: stepIndex,
      text: ""
    }
  },
  newStepMap: (mapType, recipeStepId, barsIndex, recipeIndex) => {
    return {
      barsIndex: barsIndex,
      edited: ["new"],
      mapType: mapType,
      recipeIndex: recipeIndex,
      recipe_stepId: recipeStepId,
      stepMapId: null,
      stepMapTypeId: mapType == "tool" ? 1 : 2
    }
  },
//#endregion
  getIngredientPlaintext: (ingredient) => {
    //UoM
    var UoMName = ""
    UoMName = ingredient.UoMAbbr ? UoMName = ingredient.UoMAbbr : ingredient.UoMName
    //foodVariant
    var ingFoodVariant = ingredient.foodVariantName ? ingredient.foodVariantName : ""
    if (ingredient.foodVariantAbbr) { ingFoodVariant = ingredient.foodVariantAbbr }
    //substance
    var ingName = ingredient.substanceName
    if (ingredient.ingredientQuantity != 1 && cDI.utils.isDef(ingredient.plural)) {
      ingName = ingredient.plural
    }
    //prepStyle
    var ingPrepStyle = ingredient.prepStyleName ? ingredient.prepStyleName : ""
    return {
      idx: ingredient.ingredientIndex,
      quantity: (new Fraction(ingredient.ingredientQuantity)).toFraction(),
      UoM: UoMName,
      foodVariant: ingFoodVariant,
      substance: ingName,
      prepStyle: ingPrepStyle
    }
  },
  saveStepMap: async (stepMap) => {
    var retVal = await cDI.remote.remoteCall("/crud/stepMap/u/", { stepMap: stepMap })
    return retVal
  },
  save: async (editedRecipe) => {
    var retVal

    var newIngs = editedRecipe.ingredients.filter(x => x.edited)
    for (var x = 0; x < newIngs.length; x++){
      var ing = newIngs[x]
      if (!ing.ingredientQuantity) { retVal = "Ingredient cannot have quantity 0" }
      if (ing.substanceId == null) { retVal = "Ingredient must have a substance" }
      if (retVal) { return retVal }
    }

    var editedIngs = editedRecipe.ingredients.filter(x => !!x.edited)
    var editedSteps = editedRecipe.steps.filter(x => !!x.edited)

    if ([...editedIngs, ...editedSteps].length > 0){ retVal = await cDI.remote.remoteCall("/crud/recipe/u/", { editedRecipe: editedRecipe }) }
    else { retVal = "No changes to save" }
    return retVal
  }
}
