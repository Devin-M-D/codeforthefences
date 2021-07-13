var ingredientQueries = require("../queries/recipe/ingredient/ingredientQueries")
var UoMQueries = require("../queries/recipe/shared/UoMQueries")
var substanceQueries = require("../queries/recipe/ingredient/substanceQueries")
var db = require('../foundation/dbLogic')

module.exports = {
  getAllUoMs: async (name) => {
    return await db.runQuery(UoMQueries.getAll)
  },
  findUoMsByName: async (name) => {
    return await db.runQuery(UoMQueries.getByName, [ `%${name}%` ])
  },
  getAllSubstances: async (name) => {
    return await db.runQuery(substanceQueries.getAll)
  },
  findSubstancesByName: async (name) => {
    return await db.runQuery(substanceQueries.getByName, [ `%${name}%` ])
  },
  upsertIngredient: async (qb, UoMId, foodVariantId, substanceId, prepStyleId) => {
    return ingredientQueries.upsertIngredient(qb, UoMId, foodVariantId, substanceId, prepStyleId)
    // run
    //   ? await db.runQuery(ingredientQueries.updateSubstance, [ substanceId, recipe_ingredientId ])
    //   : ingredientQueries.updateSubstance
  },
  // createFoodType: async (name) => {
  //   return await db.runQuery(ingredientQueries.createFoodType, [ name ])
  // },
  //
  // getUoMsByName: async (name) => {
  //   return await db.runQuery(ingredientQueries.getUoMsByName, [ `%${name}%` ])
  // },
  //
  // findMeasureOfFood: async(recipeId, quantity, UoMName, variantName, foodTypeName, prepStyleName) => {
  //   var query = ingredientQueries.findMeasureOfFood(variantName, prepStyleName)
  //   var paramSet = [ recipeId, quantity, UoMName, foodTypeName, variantName, prepStyleName ]
  //
  //   console.log(query)
  //   console.log(paramSet)
  //   // return await db.runQuery(query, paramSet)
  // }
}
