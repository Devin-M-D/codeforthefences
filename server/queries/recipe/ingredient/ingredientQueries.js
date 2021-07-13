var ss = require('../../../utils/sqlSnippets')
var ingredientModels = require('../../../models/recipe/ingredient')

var ingredientQueries = {}
ingredientQueries.selectIngObj =
` SELECT
  ${ss.projections(ingredientModels.ingredient)},
  ${ss.projections(ingredientModels.recipe_ingredient)},
  ${ss.projections(ingredientModels.UoM)},
  ${ss.projections(ingredientModels.foodVariant)},
  ${ss.projections(ingredientModels.substance)},
  ${ss.projections(ingredientModels.prepStyle)}
  FROM ingredient
  ${ss.lJoin("ingredient", "UoM")}
  ${ss.lJoin("ingredient", "foodVariant")}
  ${ss.join("ingredient", "substance")}
  ${ss.lJoin("ingredient", "prepStyle")}`

  // ${ss.projections(ingredientModels.quantity)},
  // ${ss.join("ingredient", "quantity")}

ingredientQueries.getForRecipeSet = (recipeSetName, setName) => {
  setName = setName || "tmp_ingredient"
  var query =
`${ss.addSet(setName).body(`
  ${ingredientQueries.selectIngObj}
  ${ss.join("ingredient", "recipe_ingredient", "id", "ingredientId")}
  ${ss.join("recipe_ingredient", recipeSetName, "recipeId", "id")}
`)}
`
  return query
}
// quantityId = ?
//   AND UoMId = ?
//   AND
ingredientQueries.upsertIngredient = (qb, UoMId, foodVariantId, substanceId, prepStyleId) => {
  var query = `
SELECT @ingId:=id FROM ingredient
  WHERE UoMId = ?
    AND ${qb.nullableWhere("ingredient", "foodVariantId", foodVariantId)}
    AND substanceId = ?
    AND ${qb.nullableWhere("ingredient", "prepStyleId", prepStyleId)};
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId)
  SELECT ?, ${ss.nullableParam(foodVariantId)}, ?, ${ss.nullableParam(prepStyleId)} WHERE @ingId IS NULL;
SET @ingId = (SELECT IFNULL(@ingId, LAST_INSERT_ID()));
`
  qb.insertQuery(query)
  qb.insertFilteredParams(UoMId, foodVariantId, substanceId, prepStyleId, UoMId, foodVariantId, substanceId, prepStyleId)
}

module.exports = ingredientQueries
