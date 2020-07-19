module.exports = {
  getAllRecipes: {
    // query: `
    // SELECT @rid, @class, $depth, * FROM (
    // 	TRAVERSE out(), inV() FROM (
    //     SELECT FROM recipe
    //   )
    // )
    // ORDER BY @class`,
    query: `
    SELECT @class, @rid, * FROM (
      TRAVERSE
      out("recipeTool")
      , out("recipeTool").inV("tool")
      , out("recipeTool").out("toolSize")

      , out("recipeIngredient")
      , out("recipeIngredient").inV("ingredient")
      , out("recipeIngredient").inV("ingredient").out("ingredientUoM")
      , out("recipeIngredient").inV("ingredient").out("ingredientUoM").inV("UoM")
      , out("recipeIngredient").inV("ingredient").out("ingredientFood")
      , out("recipeIngredient").inV("ingredient").out("ingredientFood").inV("foodType")
      , out("recipeIngredient").inV("ingredient").out("ingredientPrepStyle")
      , out("recipeIngredient").inV("ingredient").out("ingredientPrepStyle").inV("prepStyle")

      , out("recipeStep")
      , out("recipeStep").inV("step")
      , out("recipeStep").inV("step").out("stepTool")
      , out("recipeStep").inV("step").out("stepIngredient")
      FROM (
        SELECT FROM recipe WHERE @rid = $parent.$current.@rid
      )
    ) ORDER BY @class
    `,
    params: {},
  },
}
