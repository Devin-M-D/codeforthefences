var db = require('../foundation/dbLogic')
var queryBuilder = require('../utils/queryBuilder')
var recipeQueries = require("../queries/recipe")
var ingredientService = require('../services/ingredientService')

var recipeService = {}
recipeService.parseObj = (data) => {
  var recipes = data[0]
  recipes.forEach(x => {
    x.tools = data[1].filter(y => y.recipeId = x.id)
    x.ingredients = data[2].filter(y => y.recipeId = x.id)
    x.steps = data[3].filter(y => y.recipeId = x.id)
    x.stepMaps = data[4].filter(y => y.recipeId = x.id)
  })
  return recipes
}

recipeService.getByName = async (name) => {
  var data = await db.runQuery(recipeQueries.getByName(), [`%${name}%`])
  return recipeService.parseObj(data)
}
recipeService.getById = async (id) => {
  var data = await db.runQuery(recipeQueries.getById(), [`%${id}%`])
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
      await ingredientService.upsertIngredient(qb, ingredient.UoMId, ingredient.foodVariantId, ingredient.substanceId, ingredient.prepStyle)

      if (ingredient.edited.indexOf("new") != -1) { console.log("new ingredient") }

      qb.insertQuery(recipeQueries.setIngredient)
      qb.insertParam(ingredient.recipe_ingredientId)

    }
  }
  if (qb.query != "") {
    console.log(qb.printRunnable())

    // console.log(qb.params())
    // console.log(qb.query())
    var res = await qb.run()
  }
}

module.exports = recipeService
