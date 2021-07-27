cDI.components.cargoHold = {
  init: async () => {
    //generic widgets
    $("body").prepend(`<span id="cargoHold"></span>`)
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "modal")
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "flexCarousel")
    await cDI.remote.loadSimpleComponent(`components/genericWidgets`, `searchSelect`)
    await cDI.remote.loadSimpleComponent(`components/genericWidgets`, `drawerPane`)
  }
}
