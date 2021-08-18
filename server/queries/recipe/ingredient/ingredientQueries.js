var queryBuilder = require('query-builder')(require('../../../foundation/dbLogic'))
var ingredientObjModels = require('../../../models/recipe/ingredient/ingredientObjModel')

var ingredientQueries = {}
ingredientQueries.selectIngObj =
` SELECT
  ${queryBuilder.projections(ingredientObjModels.ingredient)},
  ${queryBuilder.projections(ingredientObjModels.recipe_ingredient)},
  ${queryBuilder.projections(ingredientObjModels.UoM)},
  ${queryBuilder.projections(ingredientObjModels.foodVariant)},
  ${queryBuilder.projections(ingredientObjModels.substance)},
  ${queryBuilder.projections(ingredientObjModels.prepStyle)}
  FROM ingredient
  ${queryBuilder.lJoin("ingredient", "UoM")}
  ${queryBuilder.lJoin("ingredient", "foodVariant")}
  ${queryBuilder.join("ingredient", "substance")}
  ${queryBuilder.lJoin("ingredient", "prepStyle")}`

ingredientQueries.getForRecipeSet = (recipeSetName, setName) => {
  return `${queryBuilder.addSet(setName || "tmp_ingredient").body(`
  ${ingredientQueries.selectIngObj}
  ${queryBuilder.join("ingredient", "recipe_ingredient", "id", "ingredientId")}
  ${queryBuilder.join("recipe_ingredient", recipeSetName, "recipeId", "id")}
`)}
`
}

ingredientQueries.upsertIngredient = (qb, UoMId, foodVariantId, substanceId, prepStyleId) => {
  var query = `
SELECT @ingId:=id FROM ingredient
  WHERE ${qb.nullableWhere("ingredient", "UoMId", UoMId)}
    AND ${qb.nullableWhere("ingredient", "foodVariantId", foodVariantId)}
    AND substanceId = ?
    AND ${qb.nullableWhere("ingredient", "prepStyleId", prepStyleId)};
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId)
  SELECT ${qb.nullableValue(UoMId)}, ${qb.nullableValue(foodVariantId)}, ?, ${qb.nullableValue(prepStyleId)} WHERE @ingId IS NULL;
SET @ingId = (SELECT IFNULL(@ingId, LAST_INSERT_ID()));
`
  qb.insertQuery(query)
  qb.insertNonNullParams(UoMId, foodVariantId, substanceId, prepStyleId, UoMId, foodVariantId, substanceId, prepStyleId)
}

module.exports = ingredientQueries
