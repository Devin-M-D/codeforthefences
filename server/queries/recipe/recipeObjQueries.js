var recipeQueries = require('./recipeQueries')
var toolQueries = require('./tool/toolQueries')
var ingredientQueries = require('./ingredient/ingredientQueries')
var stepQueries = require('./step/stepQueries')
var stepObjQueries = require('./step/stepObjQueries')

var recipeQueriesIndex = {}
recipeQueriesIndex.descendentTree =
`
${toolQueries.getForRecipeSet("tmp_recipe")}
${ingredientQueries.getForRecipeSet("tmp_recipe")}
${stepQueries.getForRecipeSet("tmp_recipe")}
${stepObjQueries.getMapsForStepSet("tmp_step")}
`

recipeQueriesIndex.getAll = `
${recipeQueries.getAll()}
${recipeQueriesIndex.descendentTree}
`

recipeQueriesIndex.getByName = () => {
  return `
${recipeQueries.getByName()}
${recipeQueriesIndex.descendentTree}
`
}

recipeQueriesIndex.getById = () => {
  return `
${recipeQueries.getById()}
${recipeQueriesIndex.descendentTree}
`
}

recipeQueriesIndex.addIngredient = (qb, recipeId, ingredientId, ingredientIndex, quantity) => {
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

recipeQueriesIndex.addStep = (qb, recipeId, stepId, stepIndex) => {
  qb.insertQuery(`
INSERT INTO recipe_step (recipeId, stepId, stepIndex)
  VALUES (?, ${stepId ? "?" : "@stepId"}, ?);
SET @stepId = NULL;
`)
  qb.insertParam(recipeId)
  qb.insertNonNullParams(stepId)
  qb.insertParam(stepIndex)
}

recipeQueriesIndex.setIngredient = `UPDATE recipe_ingredient SET ingredientId = @ingId, ingredientIndex = ?, quantity = ? WHERE id = ?;
SET @ingId = NULL;
`
recipeQueriesIndex.setStep = `UPDATE recipe_step SET stepId = @stepId, stepIndex = ? WHERE id = ?;
SET @stepId = NULL;
`

recipeQueriesIndex.detachIngredient = `DELETE FROM recipe_ingredient WHERE id = ?;`
recipeQueriesIndex.detachStep = `DELETE FROM recipe_step WHERE id = ?;`

module.exports = recipeQueriesIndex
