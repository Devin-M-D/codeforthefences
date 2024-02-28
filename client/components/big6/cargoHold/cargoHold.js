cDI.components.cargoHold = {
  html: `<span id="cargoHold" style="height: 0px; width: 0px; visibility: hidden; display: none;"></span>`,
  init: async () => {
    //generic widgets
    await ftbLoadComponent("components/genericWidgets", "modal")
    await ftbLoadComponent(`components/genericWidgets`, `drawerPane`)
    await ftbLoadComponent(`components/genericWidgets`, `authMenu`)
    await ftbLoadComponent(`components/genericWidgets`, `accountDash`)
    // await ftbLoadComponent("components/genericWidgets", "flexCarousel")
    // await ftbLoadComponent(`components/genericWidgets`, `searchSelect`)
  }
}
