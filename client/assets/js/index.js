$(async () => {
  ftbLog("Document ready, firing strap function")
  await ftbLoadComponent("components/big6", "contentMain", $("body"))
  await ftbLoadComponent("components/big6", "cargoHold", $("body"), 0)
  await ftbLoadComponent("components/big6", "header", $("body"), 0)
  if (cDI.config.debugMode) { await ftbLoadComponent("components/big6", "devZone", $("#cargoHold")) }
  await ftbLoadComponent("components/big6", "router")
  if (cDI.config.unitTest) { await ftbLoadComponent("components/big6", "unitTests") }
})
