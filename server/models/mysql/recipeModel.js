var DI = require('../../foundation/DICore')
var db = require('../../foundation/dbLogic')
var ingredientModel = require("./ingredientModel")

var recipeModel = {
  getFullRecipeSelector: (recipeSetQuery) => {
    return `
      CREATE TEMPORARY TABLE recipeIds (id int);

      INSERT INTO recipeIds
      ${recipeSetQuery};

      SELECT * FROM recipe WHERE id IN (SELECT id FROM recipeIds);
    `
  },
  getFullRecipeBase: `
    SELECT recipeTool.recipeId, toolType.name as name, toolType.description as 'desc', toolIndex as idx
    FROM recipeTool
    INNER JOIN tool ON tool.id = recipeTool.toolId
    LEFT JOIN UoM ON UoM.id = tool.UoMId
    INNER JOIN toolType ON toolType.id = tool.toolTypeId
    WHERE recipeTool.recipeId IN (SELECT id FROM recipeIds);

    SELECT recipeIngredient.recipeId, recipeIngredient.id,
      ingredientId as ingredientId, ingredientIndex as idx, quantity,
      UoM.id as UoMId, UoM.name as UoMName, UoM.abbreviation as UoMAbbreviation,
      foodVariant.id as foodVariantId, foodVariant.name as foodVariant,
      foodType.id as foodTypeId, foodType.name as name, foodType.plural,
      prepStyle.id as prepStyleId, prepStyle.name as prepStyle
    FROM ${ingredientModel.ingredientJoins}
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
recipeModel.getFullByNameQuery = `
    ${recipeModel.getFullRecipeSelector(`SELECT id FROM recipe ORDER BY name LIMIT 10`)}
    ${recipeModel.getFullRecipeBase}
  `
recipeModel.getFullByIdQuery = `
    ${recipeModel.getFullRecipeSelector(`SELECT id FROM recipe where id = ?`)}
    ${recipeModel.getFullRecipeBase}
  `
recipeModel.parseFull = (data) => {
  var recipes = data[0]
  var tools = data[1]
  var ingredients = data[2]
  var steps = data[3]
  var extruded = recipeModel.extrudeRecipe(recipes, tools, ingredients, steps)
  return extruded
}
recipeModel.getFullById = async (id) => {
  var data = await db.runQuery(recipeModel.getFullByIdQuery, [ id ])
  return recipeModel.parseFull(data)[0]
}
recipeModel.getAll = async () => {
  var data = await db.runQuery(recipeModel.getFullByNameQuery)
  return recipeModel.parseFull(data)
}
recipeModel.extrudeRecipe = (recipes, tools, ingredients, steps) => {
  recipes = recipes.map(x => {
    x.tools = tools.filter(y => { return y.recipeId == x.id })
    x.ingredients = ingredients.filter(y => { return y.recipeId == x.id })
    x.steps = steps.filter(y => { return y.recipeId == x.id })
    return x
  })
  return recipes
}

module.exports = recipeModel
