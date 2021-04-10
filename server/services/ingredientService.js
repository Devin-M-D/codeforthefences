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
    var paramSet = [ recipeId, quantity, UoMName, foodTypeName, variantName, prepStyleName ]
    return await db.runQuery(ingredientModel.findMeasureOfFood(variantName, prepStyleName), paramSet)
  }
}
