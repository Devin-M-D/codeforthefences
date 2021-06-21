var db = require('./foundation/dbLogic')
var ss = require('./utils/sqlSnippets')
var recipeModels = require('./models/recipe')

var run = async () => {
  var query =
`
${ss.addSet("tmp_recipe").body(`
  SELECT
    ${ss.projections(recipeModels.recipe)}
  FROM recipe
  WHERE recipe.name LIKE '%treat%'
`)}

${ss.addSet("tmp_tool").body(`
  SELECT
    ${ss.projections(recipeModels.tools.recipe_tool)},
    ${ss.projections(recipeModels.tools.toolType)},
    ${ss.projections(recipeModels.tools.UoM)}
  FROM tool
  ${ss.join("tool", "toolType")}
  ${ss.lJoin("tool", "UoM")}
  ${ss.join("tool", "recipe_tool", "id", "toolId")}
  ${ss.join("recipe_tool", "tmp_recipe", "recipeId", "recipe_id")}
`)}
`
  console.log(query)
}
run()

// SELECT recipeTool.recipeId, toolType.name as name, toolType.description as 'desc', toolIndex as idx
// FROM recipeTool
// INNER JOIN tool ON tool.id = recipeTool.toolId
// LEFT JOIN UoM ON UoM.id = tool.UoMId
// INNER JOIN toolType ON toolType.id = tool.toolTypeId
// WHERE recipeTool.recipeId IN (SELECT id FROM recipeIds);
//
// SELECT recipeIngredient.recipeId, recipeIngredient.id,
//   ingredientId as ingredientId, ingredientIndex as idx, quantity,
//   UoM.id as UoMId, UoM.name as UoMName, UoM.abbreviation as UoMAbbreviation,
//   foodVariant.id as foodVariantId, foodVariant.name as foodVariant,
//   foodType.id as foodTypeId, foodType.name as name, foodType.plural,
//   prepStyle.id as prepStyleId, prepStyle.name as prepStyle
// FROM recipeIngredient
    // INNER JOIN ingredient ON ingredient.id = recipeIngredient.ingredientId
    // INNER JOIN measureOfFood ON measureOfFood.id = ingredient.measureOfFoodId
    // INNER JOIN UoM ON UoM.id = measureOfFood.UoMId
    // INNER JOIN preppedFood ON preppedFood.id = measureOfFood.preppedFoodId
    // LEFT JOIN prepStyle ON prepStyle.id = preppedFood.prepStyleId
    // INNER JOIN food ON food.id = preppedFood.foodId
    // INNER JOIN foodType ON foodType.id = food.foodTypeId
    // LEFT JOIN foodVariant ON foodVariant.id = food.foodVariantId
// WHERE recipeIngredient.recipeId IN (SELECT id FROM recipeIds);
//
// SELECT recipeStep.recipeId, step.id, step.text,
//   recipeStepTool.barsIndex as toolBarsIndex, recipeStepTool.recipeToolIndex,
//   recipeStepIngredient.barsIndex as ingredientBarsIndex, recipeStepIngredient.recipeIngredientIndex
// FROM recipeStep
// INNER JOIN step ON step.id = recipeStep.stepId
// INNER JOIN recipeStepTool ON recipeStep.id = recipeStepTool.recipeStepId
// INNER JOIN recipeStepIngredient ON recipeStep.id = recipeStepIngredient.recipeStepId
// WHERE recipeStep.recipeId IN (SELECT id FROM recipeIds);
