async function strapPageHome(){
  var recipes = await getAllRecipes()
  console.log("recipes", recipes[0])
  recipes.forEach(async (recipe) => {
    var card = await buildRecipeCard(recipe)
    $("#counterTop").append(card)
  })

  $.get("/components/genericWidgets/search.html", val => { $("#siteSearch").html(val) })
}
