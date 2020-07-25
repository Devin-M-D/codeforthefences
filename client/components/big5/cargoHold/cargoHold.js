async function loadCargoHold(){
  //generic widgets
  var modal = await cDI.asyncGet("components/genericWidgets/modal.html")
  $("#cargoHold").append(modal)

  //project widgets
  var recipeCards = await cDI.asyncGet("components/projectWidgets/recipeCard/recipeCard.html")
  $("#cargoHold").append(recipeCards)
}
