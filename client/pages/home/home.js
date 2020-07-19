async function pageHomeOnStrap(){
  var recipes = await getAllRecipes()
  console.log("recipes", recipes[0])
  recipes.forEach(async (recipe) => {
    var foo = await buildRecipeCard(recipe)
    $("#counterTop").append(foo)
  })

  $.get("/components/widgets/search.html", val => { $("#siteSearch").html(val) })
}
