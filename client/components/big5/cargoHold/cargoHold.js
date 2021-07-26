cDI.components.cargoHold = {
  init: async() => {
    //generic widgets
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "modal")
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "drawerPane")
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "flexCarousel")
    await cDI.remote.loadSimpleComponent(`components/genericWidgets`, `searchSelect`)
  }
}
