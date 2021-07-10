cDI.components.cargoHold = {
  init: async() => {
    //generic widgets
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "modal")
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "drawerPane")
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "searchSelect")
    await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "flexCarousel")
  }
}
