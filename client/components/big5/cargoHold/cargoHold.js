async function loadCargoHold(){
  //generic widgets
  var modal = await cDI.asyncGet("components/genericWidgets/modal.html")
  $("#cargoHold").append(modal)

  //project widgets
  var recipeCard = await cDI.asyncGet("components/projectWidgets/recipeCard/recipeCard.html")
  $("#cargoHold").append(recipeCard)
  await loadWidgetRecipeCard()

  var drawerPane = await cDI.asyncGet("components/genericWidgets/drawerPane/drawerPane.html")
  $("#cargoHold").append(drawerPane)
  await loadWidgetDrawerPane()

  var flexCarousel = await cDI.asyncGet("components/genericWidgets/flexCarousel/flexCarousel.html")
  $("#cargoHold").append(flexCarousel)
  await loadFlexCarousel()
}
