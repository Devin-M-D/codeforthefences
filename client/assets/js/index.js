$(async () => {
  ftbLog("Document ready, firing strap function")
  await cDI.remote.loadSimpleComponent("components/big5", "contentMain")
  await cDI.remote.loadSimpleComponent("components/big5", "cargoHold")
  await cDI.remote.loadSimpleComponent("components/big5", "header")
  if (cDI.config.debugMode) { await cDI.remote.loadComponent($("#cargoHold"), "components/big5", "devMenu") }
  await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "router")
  if (cDI.config.unitTest) { await cDI.remote.loadComponent($("#cargoHold"), "components/big5", "unitTests") }
})
