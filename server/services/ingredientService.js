var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var ingredientQueries = require("../queries/recipe/ingredient/ingredientQueries")
var UoMQueries = require("../queries/recipe/shared/UoMQueries")
var foodVariantQueries = require("../queries/recipe/ingredient/foodVariantQueries")
var substanceQueries = require("../queries/recipe/ingredient/substanceQueries")
var prepStyleQueries = require("../queries/recipe/ingredient/prepStyleQueries")

module.exports = {
  //UoM
  createUoM: async (name) => {
    return await db.runQuery(UoMQueries.create, [ name, name ], 1)
  },
  getAllUoMs: async (name) => {
    return await db.runQuery(UoMQueries.getAll)
  },
  findUoMsByName: async (name) => {
    var qb = queryBuilder.new()
    qb.insertQuery(UoMQueries.getByName)
    qb.insertParams(`%${name}%`, `%${name}%`, `%${name}%`)
    return qb.run()
  },
  //foodVariant
  createFoodVariant: async (name) => {
    return await db.runQuery(foodVariantQueries.create, [ name, name ], 1)
  },
  getAllFoodVariants: async (name) => {
    return await db.runQuery(foodVariantQueries.getAll)
  },
  findFoodVariantsByName: async (name) => {
    var qb = queryBuilder.new()
    qb.insertQuery(foodVariantQueries.getByName)
    qb.insertParams(`%${name}%`, `%${name}%`)
    return qb.run()
  },
  //substance
  createSubstance: async (name) => {
    return await db.runQuery(substanceQueries.createSubstance, [ name, name ], 1)
  },
  getAllSubstances: async (name) => {
    return await db.runQuery(substanceQueries.getAll)
  },
  findSubstancesByName: async (name) => {
    var qb = queryBuilder.new()
    qb.insertQuery(substanceQueries.getByName)
    qb.insertParams(`%${name}%`, `%${name}%`)
    return qb.run()
  },
  //prepStyle
  createPrepStyle: async (name) => {
    return await db.runQuery(prepStyleQueries.create, [ name, name ], 1)
  },
  getAllPrepStyles: async (name) => {
    return await db.runQuery(prepStyleQueries.getAll)
  },
  findPrepStylesByName: async (name) => {
    var qb = queryBuilder.new()
    qb.insertQuery(prepStyleQueries.getByName)
    qb.insertParams(`%${name}%`)
    return qb.run()
  },

  upsertIngredient: async (qb, UoMId, foodVariantId, substanceId, prepStyleId) => {
    return ingredientQueries.upsertIngredient(qb, UoMId, foodVariantId, substanceId, prepStyleId)
  }
}
