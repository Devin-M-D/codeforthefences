async function strapPageHome(){
  var recipes = await getAllRecipes()
  var favorites = await buildRecipeCardList(recipes)
  $("#counterTop").append(favorites)

  $.get("/components/genericWidgets/search.html", val => { $("#siteSearch").html(val) })
}
