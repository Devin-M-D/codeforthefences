var recipeQueries = require('./recipeQueries')
var toolQueries = require('./tool/toolQueries')
var ingredientQueries = require('./ingredient/ingredientQueries')
var stepQueries = require('./step/stepQueries')
var stepObjQueries = require('./step/stepObjQueries')

var recipeObjQueries = {}
recipeObjQueries.descendentTree =
`
${toolQueries.getForRecipeSet("tmp_recipe")}
${ingredientQueries.getForRecipeSet("tmp_recipe")}
${stepQueries.getForRecipeSet("tmp_recipe")}
${stepObjQueries.getMapsForStepSet("tmp_step")}
`

recipeObjQueries.getAll = `
${recipeQueries.getAll()}
${recipeObjQueries.descendentTree}
`

recipeObjQueries.getByName = () => {
  return `
${recipeQueries.getByName()}
${recipeObjQueries.descendentTree}
`
}

recipeObjQueries.getById = () => {
  return `
${recipeQueries.getById()}
${recipeObjQueries.descendentTree}
`
}

recipeObjQueries.addIngredient = (qb, recipeId, ingredientId, ingredientIndex, quantity) => {
  qb.insertQuery(`
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity)
  VALUES (?, ${ingredientId ? "?" : "@ingId"}, ?, ?);
SET @ingId = NULL;
`)
  qb.insertParam(recipeId)
  qb.insertNonNullParams(ingredientId)
  qb.insertParam(ingredientIndex)
  qb.insertParam(quantity)
}

recipeObjQueries.addStep = (qb, recipeId, stepId, stepIndex) => {
  qb.insertQuery(`
INSERT INTO recipe_step (recipeId, stepId, stepIndex)
  VALUES (?, ${stepId ? "?" : "@stepId"}, ?);
SET @stepId = NULL;
`)
  qb.insertParam(recipeId)
  qb.insertNonNullParams(stepId)
  qb.insertParam(stepIndex)
}

recipeObjQueries.setIngredient = `UPDATE recipe_ingredient SET ingredientId = @ingId, ingredientIndex = ?, quantity = ? WHERE id = ?;
SET @ingId = NULL;
`
recipeObjQueries.setStep = `UPDATE recipe_step SET stepId = @stepId, stepIndex = ? WHERE id = ?;
SET @stepId = NULL;
`

recipeObjQueries.detachIngredient = `DELETE FROM recipe_ingredient WHERE id = ?;`
recipeObjQueries.detachStep = `DELETE FROM recipe_step WHERE id = ?;`

module.exports = recipeObjQueries
