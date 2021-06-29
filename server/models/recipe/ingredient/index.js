var ingredient = require("./ingredientModel")
var recipe_ingredient = require("./recipe_ingredientModel")
var quantity = require("./quantityModel")
var UoM = require("../shared/UoMModel")
var foodVariant = require("./foodVariantModel")
var substance = require("./substanceModel")
var prepStyle = require("./prepStyleModel")

module.exports = {
  ingredient: ingredient,
  recipe_ingredient: recipe_ingredient,
  quantity: quantity,
  UoM: UoM,
  foodVariant: foodVariant,
  substance: substance,
  prepStyle: prepStyle
}
