async function pageHomeOnStrap(){
  var recipes = await getAllRecipes()
  console.log("recipes", recipes)
  recipes.forEach(async (recipe) => {
    var foo = await buildRecipeCard(recipe)
    $("#counterTop").append(foo)
  })
  
  $.get("/components/widgets/search.html", val => { $("#siteSearch").html(val) })
}
