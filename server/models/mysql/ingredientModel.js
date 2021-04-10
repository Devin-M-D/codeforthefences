var DI = require('../../foundation/DICore')
var db = require('../../foundation/dbLogic')

var ingredientModel = {
  getAllFoodTypes: "SELECT * FROM foodType ORDER BY name LIMIT 100",
  findFoodTypesByName: `SELECT * FROM foodType WHERE name LIKE ? ORDER BY name LIMIT 100`,
  createFoodType: "INSERT INTO foodType (name) VALUES (?)",

  getUoMsByName: `SELECT * FROM UoM WHERE name LIKE ? ORDER BY name LIMIT 100`,

  ingredientJoins: `
    recipeIngredient
    INNER JOIN ingredient ON ingredient.id = recipeIngredient.ingredientId
    INNER JOIN measureOfFood ON measureOfFood.id = ingredient.measureOfFoodId
    INNER JOIN UoM ON UoM.id = measureOfFood.UoMId
    INNER JOIN preppedFood ON preppedFood.id = measureOfFood.preppedFoodId
    LEFT JOIN prepStyle ON prepStyle.id = preppedFood.prepStyleId
    INNER JOIN food ON food.id = preppedFood.foodId
    INNER JOIN foodType ON foodType.id = food.foodTypeId
    LEFT JOIN foodVariant ON foodVariant.id = food.foodVariantId
  `,
}
ingredientModel.findMeasureOfFood = (variantName, prepStyle) => {
  return `
    SELECT * FROM ${ingredientModel.ingredientJoins}
    WHERE recipeId = ? AND quantity = ? AND UoM.name = ? AND foodType.name = ? AND foodVariant.name ${((variantName == null) ? "IS NULL" : "= ?")} AND prepStyle.name ${((prepStyle == null) ? "IS NULL" : "= ?")}
  `
}
module.exports = ingredientModel
