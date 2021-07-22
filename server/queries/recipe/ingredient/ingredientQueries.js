var ss = require('../../../utils/sqlSnippets')
var ingredientObjModels = require('../../../models/recipe/ingredient/ingredientObjModel')

var ingredientQueries = {}
ingredientQueries.selectIngObj =
` SELECT
  ${ss.projections(ingredientObjModels.ingredient)},
  ${ss.projections(ingredientObjModels.recipe_ingredient)},
  ${ss.projections(ingredientObjModels.UoM)},
  ${ss.projections(ingredientObjModels.foodVariant)},
  ${ss.projections(ingredientObjModels.substance)},
  ${ss.projections(ingredientObjModels.prepStyle)}
  FROM ingredient
  ${ss.lJoin("ingredient", "UoM")}
  ${ss.lJoin("ingredient", "foodVariant")}
  ${ss.join("ingredient", "substance")}
  ${ss.lJoin("ingredient", "prepStyle")}`

ingredientQueries.getForRecipeSet = (recipeSetName, setName) => {
  return `${ss.addSet(setName || "tmp_ingredient").body(`
  ${ingredientQueries.selectIngObj}
  ${ss.join("ingredient", "recipe_ingredient", "id", "ingredientId")}
  ${ss.join("recipe_ingredient", recipeSetName, "recipeId", "id")}
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
