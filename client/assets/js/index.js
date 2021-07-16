$(async () => {
  ftbLog("Document ready, firing strap function")
  await cDI.remote.loadComponent($("body"), "components/big5", "contentMain")
  await cDI.remote.loadComponent($("body"), "components/big5", "cargoHold", 0)
  await cDI.remote.loadComponent($("body"), "components/big5", "header", 0)
  if (cDI.config.debugMode) { await cDI.remote.loadComponent($("#cargoHold"), "components/big5", "dev", 0) }
  await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "router")
  if (cDI.config.unitTest) { await cDI.remote.loadComponent($("#cargoHold"), "components/big5", "unitTests") }
})
