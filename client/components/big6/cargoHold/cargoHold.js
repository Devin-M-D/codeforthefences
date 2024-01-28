cDI.components.cargoHold = {
  html: `<span id="cargoHold"></span>`,
  init: async () => {
    //generic widgets
    await ftbLoadComponent("components/genericWidgets", "modal", $("#cargoHold"))
    await ftbLoadComponent("components/genericWidgets", "flexCarousel")
    await ftbLoadComponent(`components/genericWidgets`, `searchSelect`)
    await ftbLoadComponent(`components/genericWidgets`, `drawerPane`)
  }
}
