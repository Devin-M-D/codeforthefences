module.exports = (DI) => {
  var recipeService = {
    getAllQuery: `
    SET @recipeIds = (SELECT id FROM recipe ORDER BY name);
    SELECT * FROM recipe ORDER BY name LIMIT 10;

    SELECT toolType.name as tool, toolType.description as 'desc', toolIndex as idx
    FROM recipeTool
    INNER JOIN tool ON tool.id = recipeTool.toolId
    LEFT JOIN UoM ON UoM.id = tool.UoMId
    INNER JOIN toolType ON toolType.id = tool.toolTypeId
    WHERE recipeTool.recipeId IN (@recipeIds);

    SELECT foodType.name, foodType.plural, ingredientIndex as idx, quantity, UoM.name, UoM.abbreviation
    FROM recipeIngredient
    INNER JOIN ingredient ON ingredient.id = recipeIngredient.ingredientId
    INNER JOIN measureOfFood ON measureOfFood.id = ingredient.measureOfFoodId
    INNER JOIN UoM ON UoM.id = measureOfFood.UoMId
    INNER JOIN food ON food.id = measureOfFood.foodId
    INNER JOIN foodType ON foodType.id = food.foodTypeId
    WHERE recipeIngredient.recipeId IN (@recipeIds);
    `,
    getAll: async () => {
      var data = await DI.data.runQuery(recipeService.getAllQuery)
      var recipe = data[1]
      var tools = data[2]
      var ingredients = data[3]
      var extruded = await recipeService.extrudeRecipe(recipe, tools, ingredients)
      console.log(extruded)
      return extruded
    },
    extrudeRecipe: async (recipe, tools, ingredients) => {
      return {
        recipe: recipe,
        tools: tools,
        ingredients: ingredients
      }
    }
  }
  return recipeService
  //SELECT * FROM recipe WHERE name LIKE '%?%'
  // for ()
  // return
}
