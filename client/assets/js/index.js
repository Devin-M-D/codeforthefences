$(async () => {
  ftbLog("Document ready, firing strap function")
  await cDI.remote.loadSimpleComponent("components/big6", "contentMain")
  await cDI.remote.loadSimpleComponent("components/big6", "cargoHold")
  await cDI.remote.loadSimpleComponent("components/big6", "header")
  if (cDI.config.debugMode) { await cDI.remote.loadComponent($("#cargoHold"), "components/big6", "devMenu") }
  await cDI.remote.loadSimpleComponent("components/big6", "router")
  if (cDI.config.unitTest) { await cDI.remote.loadSimpleComponent("components/big6", "unitTests") }
})
