cDI.components.cargoHold = {
  init: async() => {
    //generic widgets
    // await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "modal")

    var modal = await cDI.remote.asyncGet("components/genericWidgets/modal.html")
    $("#cargoHold").append(modal)

    var drawerPane = await cDI.remote.asyncGet("components/genericWidgets/drawerPane/drawerPane.html")
    $("#cargoHold").append(drawerPane)
    await loadWidgetDrawerPane()

    var searchSelect = await cDI.remote.asyncGet("components/genericWidgets/searchSelect/searchSelect.html")
    $("#cargoHold").append(searchSelect)

    var flexCarousel = await cDI.remote.asyncGet("components/genericWidgets/flexCarousel/flexCarousel.html")
    $("#cargoHold").append(flexCarousel)
    await loadFlexCarousel()

    //project widgets
    var recipeCard = await cDI.remote.asyncGet("components/projectWidgets/recipeCard/recipeCard.html")
    $("#cargoHold").append(recipeCard)
    await loadWidgetRecipeCard()
  }
}
