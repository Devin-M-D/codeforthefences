var DI = require('../../foundation/DICore')
var db = require('../../foundation/dbLogic')

var recipeModel = {
  getAllQuery: `
    CREATE TEMPORARY TABLE recipeIds (id int);

    INSERT INTO recipeIds
    SELECT id FROM recipe ORDER BY name LIMIT 10;

    SELECT * FROM recipe WHERE id IN (SELECT id FROM recipeIds);

    SELECT recipeTool.recipeId, toolType.name as name, toolType.description as 'desc', toolIndex as idx
    FROM recipeTool
    INNER JOIN tool ON tool.id = recipeTool.toolId
    LEFT JOIN UoM ON UoM.id = tool.UoMId
    INNER JOIN toolType ON toolType.id = tool.toolTypeId
    WHERE recipeTool.recipeId IN (SELECT id FROM recipeIds);

    SELECT recipeIngredient.recipeId, recipeIngredient.id,
      quantity,
      UoM.name as UoMName, UoM.abbreviation as UoMAbbreviation,
      foodType.name, foodType.plural, ingredientIndex as idx
    FROM recipeIngredient
    INNER JOIN ingredient ON ingredient.id = recipeIngredient.ingredientId
    INNER JOIN measureOfFood ON measureOfFood.id = ingredient.measureOfFoodId
    INNER JOIN UoM ON UoM.id = measureOfFood.UoMId
    INNER JOIN food ON food.id = measureOfFood.foodId
    INNER JOIN foodType ON foodType.id = food.foodTypeId
    WHERE recipeIngredient.recipeId IN (SELECT id FROM recipeIds);

    SELECT recipeStep.recipeId, step.id, step.text,
      recipeStepTool.barsIndex as toolBarsIndex, recipeStepTool.recipeToolIndex,
      recipeStepIngredient.barsIndex as ingredientBarsIndex, recipeStepIngredient.recipeIngredientIndex
    FROM recipeStep
    INNER JOIN step ON step.id = recipeStep.stepId
    INNER JOIN recipeStepTool ON recipeStep.id = recipeStepTool.recipeStepId
    INNER JOIN recipeStepIngredient ON recipeStep.id = recipeStepIngredient.recipeStepId
    WHERE recipeStep.recipeId IN (SELECT id FROM recipeIds);
  `
}
recipeModel.getAll = async () => {
  var data = await db.runQuery(recipeModel.getAllQuery)
  // console.log(data)
  var recipes = data[0]
  var tools = data[1]
  var ingredients = data[2]
  var steps = data[3]
  var extruded = await recipeModel.extrudeRecipe(recipes, tools, ingredients, steps)
  return extruded
}
recipeModel.extrudeRecipe = async (recipes, tools, ingredients, steps) => {
  recipes = recipes.map(x => {
    x.tools = tools.filter(y => { return y.recipeId == x.id })
    x.ingredients = ingredients.filter(y => { return y.recipeId == x.id })
    x.steps = steps.filter(y => { return y.recipeId == x.id })
    return x
  })
  return recipes
}

module.exports = recipeModel
