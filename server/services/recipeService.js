var db = require('../foundation/dbLogic')
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
  editedRecipe.ingredients.forEach(async x => {
    if (x.edited) {
      if (x.edited.indexOf("new") != -1) { console.log("new ingredient") }
      if (x.edited.indexOf("substance") != -1) {
        console.log(x)
        console.log(await ingredientService.updateSubstance())
        console.log("edited", x.edited)
        console.log(origRecipe.ingredients.map(x => `${x.substanceId}-${x.substanceName}`))
        console.log(editedRecipe.ingredients.map(x => `${x.substanceId}-${x.substanceName}`))
        var res = await db.runQuery(await ingredientService.updateSubstance(), [
          x.quantityId, x.UoMId, x.foodVariantId, x.substanceId, x.prepStyleId,
          x.quantityId, x.UoMId, x.foodVariantId, x.substanceId, x.prepStyleId,
          x.recipe_ingredientId
        ])
        console.log(res)
      }
    }
  });
  // for (var x = 0; x < editedRecipe.ingredients.length; x++){
  //   var curr = editedRecipe.ingredients[x]
  //   //var data = await ingredientService.findMeasureOfFood(curr.recipeId, curr.quantity, curr.UoMName, curr.foodVariant, curr.name, curr.prepStyle)
  // }
}

module.exports = recipeService
