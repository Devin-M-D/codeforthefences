var recipe = {
  getAllRecipes: {
    query: `
    SELECT @class, @rid, * FROM (
      TRAVERSE
      out("recipeTool")
      , out("recipeTool").inV("tool")
      , out("recipeTool").out("toolSize")

      , out("recipeIngredient")
      , out("recipeIngredient").inV("ingredient")
      , out("recipeIngredient").inV("ingredient").out("ingredientUoM")
      , out("recipeIngredient").inV("ingredient").out("ingredientUoM").inV("UoM")
      , out("recipeIngredient").inV("ingredient").out("ingredientFood")
      , out("recipeIngredient").inV("ingredient").out("ingredientFood").inV("foodType")
      , out("recipeIngredient").inV("ingredient").out("ingredientPrepStyle")
      , out("recipeIngredient").inV("ingredient").out("ingredientPrepStyle").inV("prepStyle")

      , out("recipeStep")
      , out("recipeStep").inV("step")
      , out("recipeStep").inV("step").out("stepTool")
      , out("recipeStep").inV("step").out("stepIngredient")
      FROM (
        SELECT FROM recipe WHERE @rid = $parent.$current.@rid
      )
    ) ORDER BY @class
    `,
    params: {},
  },
  getSingleIngChain: {
    query: `TRAVERSE out FROM (SELECT * FROM ingredient WHERE @rid = :ingRid)`,
    params: [ "ingRid" ]
  },
  updateIngFoodType: {
    query: "UPDATE ingredientFood SET in = :foodTypeRid WHERE @rid = :ingFoodRid",
    params: [ "foodTypeRid", "ingFoodRid" ]
  },
  parsePieces: (recipe) => {
    var ingredients = recipe.recipeIngredient.sort((a, b) => a.ingredientNum < b.ingredientNum).map(x => x.ingredient)
    var tools = recipe.recipeTool.sort((a, b) => a.toolNum < b.toolNum).map(x => x.tool)
    var steps = recipe.recipeStep.sort((a, b) => a.stepNum < b.stepNum).map(x => x.step)
    return { ingredients: ingredients, tools: tools, steps: steps }
  },
  saveEditedRecipe: async (editedRecipe, DIdata) => {
    var parsed = recipe.parsePieces(editedRecipe)
    // console.log(editedRecipe["@rid"])
    // console.log(parsed.ingredients[0])
    var foo = [parsed.ingredients[0]]
    await foo.forEach(async x => {
      var query = await recipe.saveIngredient(x)
      console.log(query)
      // var result = await DIdata.rootQuery(query.query, query.params)
      // console.log(result)
    })
    return "hooray!"
  },
  saveIngredient: async (ing) => {
    var foodTypeRid = ing.ingredientFood[0].foodType["@rid"]
    var ingFoodRid = ing.ingredientFood[0]["@rid"]
    var params = {}
    params[recipe.updateIngFoodType.params[0]] = foodTypeRid
    params[recipe.updateIngFoodType.params[1]] = ingFoodRid
    return { query: recipe.updateIngFoodType.query, params}
  }
}

module.exports = recipe
