var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var recipeObjQueries = require("../queries/recipe/recipeObjQueries")
var recipeQueries = require("../queries/recipe/recipeQueries")
var ingredientService = require('../services/ingredientService')
var stepService = require('../services/stepService')

var recipeService = {}
recipeService.parseObj = (data) => {
  var recipes = data[1]
  recipes.forEach(x => {
    x.tools = data[3].filter(y => y.recipeId == x.id)
    x.ingredients = data[5].filter(y => y.recipeId == x.id)
    x.steps = data[7].filter(y => y.recipeId == x.id)

    var recipeStepIds = x.steps.map(z => { return z.recipe_stepId })
    x.stepMaps = data[9].filter(y => recipeStepIds.indexOf(y.recipe_stepId) != -1)
  })
  return recipes
}
recipeService.getAll = async () => {
  var qb = queryBuilder.new()
  qb.insertQuery(recipeObjQueries.getAll)
  var data = await qb.run()
  return recipeService.parseObj(data)
}
recipeService.getByName = async (name) => {
  var data = await db.runQuery(recipeObjQueries.getByName(), [`%${name}%`])
  return recipeService.parseObj(data)
}
recipeService.getById = async (id) => {
  var data = await db.runQuery(recipeObjQueries.getById(), [id])
  return recipeService.parseObj(data)[0]
}
recipeService.saveEditedRecipe = async (editedRecipe) => {
  var origRecipe = await recipeService.getById(editedRecipe.id)
  var query = ""
  var params = []
  var qb = queryBuilder.new()

  for (var x = 0; x < editedRecipe.ingredients.length; x++){
    var ingredient = editedRecipe.ingredients[x]
    if (ingredient.edited) {
      if (ingredient.edited.includes("new")) {
        await ingredientService.upsertIngredient(qb, ingredient.UoMId, ingredient.foodVariantId, ingredient.substanceId, ingredient.prepStyle)
        recipeObjQueries.addIngredient(qb, ingredient.recipeId, ingredient.ingredientId, ingredient.ingredientIndex, ingredient.ingredientQuantity)
      }
      else if (ingredient.edited.includes("removed")){
        qb.insertQuery(recipeObjQueries.detachIngredient)
        qb.insertParam(ingredient.recipe_ingredientId)
      }
      else {
        await ingredientService.upsertIngredient(qb, ingredient.UoMId, ingredient.foodVariantId, ingredient.substanceId, ingredient.prepStyleId)
        qb.insertQuery(recipeObjQueries.setIngredient)
        qb.insertParams(ingredient.ingredientIndex, ingredient.ingredientQuantity, ingredient.recipe_ingredientId)
      }
    }
  }

  for (var x = 0; x < editedRecipe.steps.length; x++){
    var step = editedRecipe.steps[x]
    if (step.edited) {
      if (step.edited.includes("new")) {
        await stepService.upsert(qb, step.text)
        recipeObjQueries.addStep(qb, step.recipeId, step.id, step.stepIndex)
      }
      else if (step.edited.includes("removed")){
        qb.insertQuery(recipeObjQueries.detachStep)
        qb.insertParam(step.recipe_stepId)
        stepService.deleteStepMap(qb, step.recipe_stepId, step.recipeIndex)
      }
      else {
        await stepService.upsert(qb, step.text)
        qb.insertQuery(recipeObjQueries.setStep)
        qb.insertParams(step.stepIndex, step.recipe_stepId)
      }
    }
  }
  if (qb.query != "") {
    // console.log(qb.query())
    // console.log(qb.params())
    var res = await qb.run()
  }
  return await recipeService.getById(editedRecipe.id)
}

module.exports = recipeService
