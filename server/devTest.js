var db = require('./foundation/dbLogic')
var recipeQueries = require('./queries/recipe/index')

var run = async () => {
  console.log(recipeQueries.getRecipeObjByName())
  // var data = await db.runQuery(recipeQueries.getRecipeObjByName(), ["%treat%"])
  // console.log(data)
}
run()
