var ingredientModel = require("../models/mysql/ingredientModel")
var db = require('../foundation/dbLogic')

module.exports = {
  getAllFoodTypes: async (name) => {
    return await db.runQuery(ingredientModel.getAllFoodTypes)
  },
  findFoodTypesByName: async (name) => {
    return await db.runQuery(ingredientModel.findFoodTypesByName, [ `%${name}%` ])
  },
  createFoodType: async (name) => {
    return await db.runQuery(ingredientModel.createFoodType, [ name ])
  },

  getUoMsByName: async (name) => {
    return await db.runQuery(ingredientModel.getUoMsByName, [ `%${name}%` ])
  },

  findMeasureOfFood: async(recipeId, quantity, UoMName, variantName, foodTypeName, prepStyleName) => {
    var query = ingredientModel.findMeasureOfFood(variantName, prepStyleName)
    var paramSet = [ recipeId, quantity, UoMName, foodTypeName, variantName, prepStyleName ]

    console.log(query)
    console.log(paramSet)
    // return await db.runQuery(query, paramSet)
  }
}
